import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ILogin } from './interfaces/login.interface';
import { ConfigService } from '../config/config.service';
import {
    NotFoundResult,
    ErrorResult,
    InternalServerErrorResult,
    BadRequestResult,
} from '../error-manager/errors';

import { ErrorCode } from '../error-manager/error-codes';
import { LoginUserDto, UserDto } from '../../user/dto/login-user.dto';
import { User } from '../../user/user.entity';
import { IUser } from '../../user/interfaces/user.interface';
import { UserService } from '../../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) {}

    signIn(hmac: string, shop: string, timestamp: string) {
        return new Promise(
            (
                resolve: (result: ILogin) => void,
                reject: (reason: ErrorResult) => void,
            ): void => {
                this.userService
                    .signIn(hmac, shop, timestamp)
                    .then((user: LoginUserDto) => {
                        console.log(user);
                        const response: ILogin = {
                            user: this.getUserDto(user),
                            token: this.createToken(user),
                            expiresIn: +this.configService.get(
                                'JWT_EXPIRES_IN',
                            ),
                        };
                        resolve(response);
                    })
                    .catch(error => {
                        reject(error);
                    });
            },
        );
    }

    createToken(user: LoginUserDto) {
        const token: JwtPayload = {
            userId: user.id,
            email: user.email,
            role: 'user.role',
        };
        return this.jwtService.sign(token);
    }

    validate(payload: JwtPayload): Promise<User> {
        return new Promise(
            (
                resolve: (result: any) => void,
                reject: (reason: ErrorResult) => void,
            ): void => {
                this.userService
                    .getUser(payload.userId)
                    .then((user: User) => {
                        resolve(user);
                    })
                    .catch(error => {
                        reject(error);
                    });
            },
        );
    }

    getUserDto(user: LoginUserDto): UserDto {
        return {
            id: user.id,
            redirect: user.redirect,
            newUser: user.newUser,
            hmac: user.hmac,
            shopUrl: user.shopUrl,
            profile: user.profile,
        };
    }
}
