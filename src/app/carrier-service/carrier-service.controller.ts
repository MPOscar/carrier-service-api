import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    Req,
    Response,
    UsePipes,
} from '@nestjs/common';
import * as express from 'express';
import { Request } from 'express';
//
import { AuthService } from '../common/auth/auth.service';
//
import { ConfigService } from '../common/config/config.service';
import { ErrorManager } from '../common/error-manager/error-manager';
import { ErrorResult } from '../common/error-manager/errors';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { ShopifyParentRateDto } from '../rates/dto/shopify/shopify-parent-rate.dto';
import { SoapService } from '../soap/soap.service';
//
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserDto } from '../user/dto/login-user.dto';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { Carrier } from './carrier-service.entity';
import { CarrierService } from './carrier-service.service';
import { ICarrier } from './interfaces/carrier-service.interface';
const configService = new ConfigService();
const crypto = require('crypto');
const querystring = require('querystring');
const nonce = require('nonce')();
const request = require('request-promise');

const apiKey = configService.get('SHOPIFY_API_KEY');
const apiSecret = configService.get('SHOPIFY_API_SECRET_KEY');
const scopes =
    'write_shipping, read_themes, write_themes, read_orders, read_script_tags, write_script_tags, read_fulfillments';
const forwardingAddress = configService.get('FORWARDING_ADDRESS');

@Controller('carrier-service')
//@UseGuards(AuthGuard())
export class CarrierController {
    constructor(
        private readonly authService: AuthService,
        private readonly carrierService: CarrierService,
        private readonly soapService: SoapService,
        private readonly userService: UserService,
    ) {}

    @Post()
    @UsePipes(new ValidationPipe())
    async create(
        @Body() createCarrierDto: ShopifyParentRateDto,
        @Req() req: Request,
        @Response() response: express.Response,
    ) {
        let shop: any = req.headers['x-shopify-shop-domain'];
        const user = await this.userService.getUserByEmail(shop);
        try {
            const resp = await this.soapService.getServiceCost(
                createCarrierDto,
                user,
            );
            console.log('CARRIER CONTROLLER => ' + JSON.stringify(resp));
            return response.json({ rates: resp });
        } catch (error) {
            throw error;
        }
    }

    @Get('callback')
    @UsePipes(new ValidationPipe())
    async callback(
        @Query() query: any,
        @Req() req: Request,
        @Response() res: express.Response,
    ) {
        let code = query.code;
        let hmac = query.hmac;
        let shop = query.shop;

        //const stateCookie = cookie.parse(req.headers.cookie).state;
        /* if (state !== stateCookie) {
             return query.status(403).send('Request origin cannot be verified');
         }*/

        if (shop && hmac && code) {
            //Validate request is from Shopify

            const map = Object.assign({}, req.query);
            delete map['signature'];
            delete map['hmac'];

            const message = querystring.stringify(map);

            const providedHmac = Buffer.from(hmac, 'utf-8');
            const generatedHash = Buffer.from(
                crypto
                    .createHmac('sha256', apiSecret)
                    .update(message)
                    .digest('hex'),
                'utf-8',
            );
            let hashEquals = false;

            try {
                hashEquals = crypto.timingSafeEqual(
                    generatedHash,
                    providedHmac,
                );
            } catch (e) {
                hashEquals = false;
            }

            if (!hashEquals) {
                return res.status(400).send('HMAC validation failed');
            }

            const accessTokenRequestUrl =
                'https://' + shop + '/admin/oauth/access_token';
            const accessTokenPayload = {
                client_id: apiKey,
                client_secret: apiSecret,
                code,
            };

            return request
                .post(accessTokenRequestUrl, { json: accessTokenPayload })
                .then(response => {
                    const accessToken = response.access_token;

                    console.log(accessToken);

                    let user: CreateUserDto = {
                        accessToken: accessToken,
                        shopUrl: shop,
                        profile: false,
                    };

                    this.userService.createUser(user).then((user: User) => {
                        const apiRequestUrl =
                            'https://' + shop + '/admin/carrier_services';

                        const apiRequestHeader = {
                            'X-Shopify-Access-Token': accessToken,
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                        };

                        const data = {
                            carrier_service: {
                                name: 'Correos Chile',
                                callback_url:
                                    forwardingAddress + '/carrier-service',
                                service_discovery: true,
                            },
                        };

                        const apiRequestUrlWebhook =
                            'https://' + shop + '/admin/webhooks';

                        const apiRequestHeaderWebhook = {
                            'X-Shopify-Access-Token': accessToken,
                            'Content-Type': 'application/json',
                            Accept: 'application/json',
                            'X-Shopify-Topic': 'orders/create',
                            'X-Shopify-Hmac-Sha256':
                                'XWmrwMey6OsLMeiZKwP4FppHH3cmAiiJJAweH5Jo4bM=',
                            'X-Shopify-Shop-Domain': shop,
                            'X-Shopify-API-Version': '2019-04',
                        };

                        const dataWebhook = {
                            webhook: {
                                topic: 'orders/create',
                                address:
                                    forwardingAddress +
                                    '/webhook/orders-create',
                                format: 'json',
                            },
                        };

                        const dataWebhookUninstalled = {
                            webhook: {
                                topic: 'app/uninstalled',
                                address:
                                    forwardingAddress +
                                    '/webhook/uninstalled-app',
                                format: 'json',
                            },
                        };

                        return request
                            .post(apiRequestUrl, {
                                json: data,
                                headers: apiRequestHeader,
                            })
                            .then(() => {
                                return request
                                    .post(apiRequestUrlWebhook, {
                                        json: dataWebhook,
                                        headers: apiRequestHeaderWebhook,
                                    })
                                    .then(() => {
                                        request
                                            .post(apiRequestUrlWebhook, {
                                                json: dataWebhookUninstalled,
                                                headers: apiRequestHeaderWebhook,
                                            })
                                            .then(() => {})
                                            .catch(error => {
                                                console.log(
                                                    'ERROR 1 => ' + error.error,
                                                );
                                                res.status(400).send({
                                                    error: error.error,
                                                });
                                            });
                                        let userDto: UserDto = {
                                            id: user.id,
                                            newUser: true,
                                            shopUrl: user.shopUrl,
                                            profile: user.profile,
                                        };
                                        userDto.newUser = true;

                                        return res.status(200).send({
                                            user: userDto,
                                            token: this.authService.createToken(
                                                user,
                                            ),
                                            carrierService: true,
                                            webhook: true,
                                        });
                                    })
                                    .catch(error => {
                                        console.log(
                                            'ERROR 2 => ' +
                                                JSON.stringify(error.error),
                                        );
                                        return res.status(400).send({
                                            user: user,
                                            token: this.authService.createToken(
                                                user,
                                            ),
                                            carrierService: true,
                                            webhook: false,
                                            error: error.error,
                                        });
                                    });
                            })
                            .catch(error => {
                                return res.status(400).send({
                                    error: error.error,
                                });
                            });
                    });
                })
                .catch(error => {
                    return res.status(400).send({
                        error: error.error,
                    });
                });
        } else {
            return res.status(400).send({
                hmac: false,
                code: false,
            });
        }
    }

    @Get()
    async getCarrier(@Query() query: any, @Response() res: express.Response) {
        let shop = query.shop;
        if (shop) {
            const state = nonce();
            const redirectUrl = forwardingAddress + '/carrier-service/callback';
            const installUrl =
                'https://' +
                shop +
                '/admin/oauth/authorize?client_id=' +
                apiKey +
                '&scope=' +
                scopes +
                '&state=' +
                state +
                '&redirect_uri=' +
                redirectUrl;
            res.cookie('state', state);
            return res.redirect(303, installUrl);
        } else {
            console.log('please add a valid shop parameter');
        }
    }

    /*@Get()
    getCompanies(@GetUser() user: User, @Query() filter: FilterCarrierDto) {
        return this.carrierService.getCompanies(user, filter)
            .then((companies: Carrier[]) => {
                return companies.map((carrier: Carrier) => {
                    return this.getICarrier(carrier);
                });
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });

    }*/

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.carrierService
            .delete(id)
            .then((carrier: Carrier) => {
                return this.getICarrier(carrier);
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });
    }

    getICarrier(carrier: Carrier): ICarrier {
        return {
            id: carrier.id,
            name: carrier.name,
            phone: carrier.phone,
            email: carrier.email,
            address: carrier.address,
            city: carrier.city,
            state: carrier.state,
            zip: carrier.zip,
            language: carrier.language,
            driverAssignRadius: carrier.driverAssignRadius,
            createdAt: carrier.createdAt,
            updatedAt: carrier.updatedAt,
        };
    }
}
