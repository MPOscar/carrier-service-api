import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Put,
    Param,
    Response,
    Delete,
    UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './interfaces/user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { RolesGuard } from '../common/auth/guards/roles.guard';
import { Roles } from '../common/decorator/roles.decorator';
import { ErrorResult } from '../common/error-manager/errors';
import { ErrorManager } from '../common/error-manager/error-manager';
import { User } from './user.entity';

import * as express from 'express';
import { ConfigService } from '../common/config/config.service';
const configService = new ConfigService();
const request = require('request-promise');
const nonce = require('nonce')();

const apiKey = configService.get('SHOPIFY_API_KEY');
const apiSecret = configService.get('SHOPIFY_API_SECRET_KEY');
const scopes = 'write_shipping, read_themes, write_themes, read_orders, read_script_tags, write_script_tags, read_fulfillments';
const forwardingAddress =  configService.get('FORWARDING_ADDRESS');;

@Controller('users')
//@UseGuards(AuthGuard(), RolesGuard)
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Post()
    async create(@Body() user: CreateUserDto) {
        return this.userService.create(user)
            .then((user: User) => {
                /*if (user.shopUrl) {
                    const state = nonce();
                    const redirectUrl = forwardingAddress + '/carrier-service/callback';
                    const installUrl = 'https://' + user.shopUrl + '/admin/oauth/authorize?client_id='
                        + apiKey +
                        '&scope=' + scopes +
                        '&state=' + state +
                        '&redirect_uri=' + redirectUrl;
                    return response.redirect(303, installUrl);
                } else {
                    console.log('please add a valid shop parameter');
                }*/
                return this.getIUser(user);
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });
    }

    @Put(':id')
    //@Roles('expert')
    @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
    async update(@Param('id') id: string, @Body() user: UpdateUserDto) {
        return this.userService.update(id, user)
            .then((user: User) => {
                return this.getIUser(user);
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });
    }

    @Get(':id')
    async getUser(@Param('id') id: string) {
        return this.userService.getUser(id)
            .then((user: User) => {
                return this.getIUser(user);
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });
    }

    @Get()
    //@Roles('expert')
    async getUsers() {
        return this.userService.getUsers()
            .then((users: User[]) => {
                return users.map((user: User) => {
                    return this.getIUser(user);
                });
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });
    }

    @Delete(':id')
    //@Roles('expert')
    async delete(@Param('id') id: string) {
        return this.userService.delete(id)
            .then((user: User) => {
                return this.getIUser(user);
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });
    }

    getIUser(user: User): IUser {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            language: user.language,
            lastLogin: user.lastLogin,
            lastName: user.lastName,
            password: user.password,
            phone: user.phone,
            verificationCode: user.id,
            region: user.region,
            comuna: user.comuna,
            address: user.address,
            zip: user.zip,
            shopUrl: user.shopUrl,
            userApiChile: user.userApiChile,
            passwordApiChile: user.passwordApiChile,
            idApiChile: user.idApiChile,
        };
    }
}
