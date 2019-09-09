import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { LoginUserDto } from './dto/login-user.dto'
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundResult, ErrorResult, BadRequestResult, InternalServerErrorResult } from '../common/error-manager/errors';
import { ErrorCode } from '../common/error-manager/error-codes';

import { ConfigService } from '../common/config/config.service';
const configService = new ConfigService();
const crypto = require('crypto');
const cookie = require('cookie');
const querystring = require('querystring');
const nonce = require('nonce')();
const request = require('request-promise');

const apiKey = configService.get('SHOPIFY_API_KEY');
const apiSecret = configService.get('SHOPIFY_API_SECRET_KEY');
const scopes = 'write_shipping, read_themes, write_themes, read_orders, read_script_tags, write_script_tags, read_fulfillments';
const forwardingAddress = configService.get('FORWARDING_ADDRESS');
const redirectAddress = configService.get('REDIRECT_URL');


@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: UserRepository
    ) { }

    create(userDto: CreateUserDto): Promise<User> {
        return new Promise((resolve: (result: User) => void, reject: (reason: ErrorResult) => void): void => {
            this.userRepository.getUserByEmail(userDto.email).then((user: User) => {
                if (user) {
                    reject(new BadRequestResult(ErrorCode.UnknownEntity, 'There is a user with same email!'));
                    return;
                }
                this.userRepository.createUser(userDto).then((user: User) => {
                    resolve(user);
                });
            })/*.catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });*/
        });
    }

    update(id: string, userDto: UpdateUserDto): Promise<User> {
        return new Promise((resolve: (result: User) => void, reject: (reason: ErrorResult) => void): void => {
            this.userRepository.getUser(id).then((user: User) => {
                if (!user) {
                    reject(new NotFoundResult(ErrorCode.UnknownEntity, 'There is no user with the specified ID!'));
                    return;
                }
                this.userRepository.getUserByEmail(userDto.email).then((user: User) => {
                    if (user && user.id !== id) {
                        reject(new BadRequestResult(ErrorCode.UnknownEntity, 'There is a user with same email!'));
                        return;
                    }
                    this.userRepository.updateUser(id, userDto).then((user: User) => {
                        resolve(user);
                    });
                });
            }).catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });
        });
    }

    getUser(id: string): Promise<User> {
        return new Promise((resolve: (result: User) => void, reject: (reason: ErrorResult) => void): void => {
            this.userRepository.getUser(id).then((user: User) => {
                if (!user) {
                    reject(new NotFoundResult(ErrorCode.UnknownEntity, 'There is no user with the specified ID!'));
                    return;
                }
                resolve(user);
            }).catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });
        });
    }

    getUsers(): Promise<User[]> {
        return new Promise((resolve: (result: User[]) => void, reject: (reason: ErrorResult) => void): void => {
            this.userRepository.getUsers().then((users: User[]) => {
                resolve(users);
            }).catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });
        });
    }

    delete(id: string): Promise<User> {
        return new Promise((resolve: (result: User) => void, reject: (reason: ErrorResult) => void): void => {
            this.userRepository.getUser(id).then((user: User) => {
                if (!user) {
                    reject(new NotFoundResult(ErrorCode.UnknownEntity, 'There is no user with the specified ID!'));
                    return;
                }
                this.userRepository.deleteUser(user).then((user: User) => {
                    if (!user) {
                        reject(new BadRequestResult(ErrorCode.UnknownError, 'It can not be eliminated!'));
                        return;
                    }
                    resolve(user);
                });
            }).catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });
        });
    }

    signIn(hmac: string, shop: string, timestamp: string, code?: string): Promise<LoginUserDto> {
        return new Promise((resolve: (result: LoginUserDto) => void, reject: (reason: ErrorResult) => void): void => {
            this.userRepository.getUserByEmail(shop).then((user: User) => {
                if (!user) {
                    let userDto: CreateUserDto = {
                        shopUrl: shop
                    }
                    this.userRepository.createUser(userDto).then((user: User) => {
                        let loginUserDto: LoginUserDto = user;
                        const state = nonce();
                        const redirectUrl = redirectAddress;
                        const installUrl = 'https://' + shop + '/admin/oauth/authorize?client_id='
                            + apiKey +
                            '&scope=' + scopes +
                            '&state=' + state +
                            '&redirect_uri=' + redirectUrl;
                        loginUserDto.newUser = true;
                        loginUserDto.redirect = installUrl;
                        resolve(loginUserDto);
                    });
                } else {
                    if (shop && hmac) {
                        let loginUserDto: LoginUserDto = user;
                        //Validate request is from Shopify   
                        let query: any = {
                            shop: shop,
                            timestamp: timestamp
                        }
                        const map = Object.assign({}, query);
                        const message = querystring.stringify(map);
                        const providedHmac = Buffer.from(hmac, 'utf-8');
                        const generatedHash = Buffer.from(
                            crypto
                                .createHmac('sha256', apiSecret)
                                .update(message)
                                .digest('hex'),
                            'utf-8'
                        );
                        let hashEquals = false;

                        try {
                            hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
                        } catch (e) {
                            hashEquals = false;
                        };

                        if (!hashEquals) {
                            console.log("hmac failed");
                            let loginUserDto: LoginUserDto = user;                          
                            loginUserDto.newUser = false;
                            loginUserDto.hmac = false;
                            loginUserDto.redirect = "https://" + shop + "/admin";
                            resolve(loginUserDto);
                        } else {
                            let loginUserDto: LoginUserDto = user;                          
                            loginUserDto.newUser = false;
                            loginUserDto.hmac = true;
                            resolve(loginUserDto);
                        }

                        const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
                        const accessTokenPayload = {
                            client_id: apiKey,
                            client_secret: apiSecret,
                            code
                        }

                        /*return request.post(accessTokenRequestUrl, { json: accessTokenPayload })
                            .then((response) => {
                                const accessToken = response.access_token;

                                //create user in db

                                const apiRequestUrl = 'https://' + shop + '/admin/carrier_services';

                                const apiRequestHeader = {
                                    "X-Shopify-Access-Token": accessToken,
                                    "Content-Type": "application/json",
                                    "Accept": "application/json"
                                }

                                const data = {
                                    "carrier_service": {
                                        "name": "Correos Chile",
                                        "callback_url": forwardingAddress + "/carrier-service",
                                        "service_discovery": true
                                    }
                                }

                                const apiRequestUrlWebhook = 'https://' + shop + '/admin/webhooks';

                                const apiRequestHeaderWebhook = {
                                    "X-Shopify-Access-Token": accessToken,
                                    "Content-Type": "application/json",
                                    "Accept": "application/json",
                                    "X-Shopify-Topic": "orders/create",
                                    "X-Shopify-Hmac-Sha256": "XWmrwMey6OsLMeiZKwP4FppHH3cmAiiJJAweH5Jo4bM=",
                                    "X-Shopify-Shop-Domain": shop,
                                    "X-Shopify-API-Version": "2019-04"
                                }

                                const dataWebhook = {
                                    "webhook": {
                                        "topic": "orders/create",
                                        "address": forwardingAddress + "/webhook/orders-create",
                                        "format": "json"
                                    }
                                }

                                return request.post(apiRequestUrl, { json: data, headers: apiRequestHeader })
                                    .then((response) => {
                                        console.log(response);
                                        return request.post(apiRequestUrlWebhook, { json: dataWebhook, headers: apiRequestHeaderWebhook })
                                            .then((response) => {
                                                console.log(response);
                                            })
                                    });
                            })*/
                    } else {
                        //res.status(400).send('Required parameters missing');
                    }
                    resolve(user);
                }
            })/*.catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });*/
        });
    }

    getUserByEmail(email: string): Promise<User> {
        return new Promise((resolve: (result: User) => void, reject: (reason: ErrorResult) => void): void => {
            this.userRepository.getUserByEmail(email).then((user: User) => {
                if (!user) {
                    reject(new NotFoundResult(ErrorCode.UnknownEntity, 'There is no user with the specified ID!'));
                    return;
                }
                resolve(user);
            }).catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });
        });
    }

    findUserByShop(email: string): Promise<User> {
        return new Promise((resolve: (result: User) => void, reject: (reason: ErrorResult) => void): void => {
            this.userRepository.getUserByEmail(email).then((user: User) => {
                if (!user) {
                    reject(new NotFoundResult(ErrorCode.UnknownEntity, 'There is no user with the specified ID!'));
                    return;
                }
                resolve(user);
            }).catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });
        });
    }
}
