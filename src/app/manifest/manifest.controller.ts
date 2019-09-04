import { Controller, Post, Put, Get, Delete, UsePipes, Body, Param, Query, Response, HttpService } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { map } from 'rxjs/operators';
//
import { RolesGuard } from '../common/auth/guards/roles.guard';
import { GetUser } from '../common/decorator/user.decorator';
import { Roles } from '../common/decorator/roles.decorator';
import { ErrorManager } from '../common/error-manager/error-manager';
import { ErrorResult } from '../common/error-manager/errors';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { User } from '../user/user.entity';
//
import { Manifest } from './manifest.entity';
import { ManifestService } from './manifest.service';
import { CreateManifestDto } from './dto/create-manifest.dto';
import { UpdateManifestDto } from './dto/update-manifest.dto';
import { IManifest } from './interfaces/manifest.interface';
import * as express from 'express';
//

import { ConfigService } from '../common/config/config.service';
const configService = new ConfigService();
const request = require('request-promise');
const nonce = require('nonce')();

const apiKey = configService.get('SHOPIFY_API_KEY');
const apiSecret = configService.get('SHOPIFY_API_SECRET_KEY');
const scopes = 'write_shipping, read_order';
const forwardingAddress = 'http://bb3c10db.ngrok.io/api/v1';

@Controller('webhook')
//@UseGuards(AuthGuard(), RolesGuard)
export class ManifestController {

    constructor(
        private readonly carrierService: ManifestService,
        private readonly httpService: HttpService,
    ) { }

    @Post("order-create")
    @UsePipes(new ValidationPipe())
    async create(@Body() createManifestDto: any) {
        console.log(createManifestDto)
        console.log(createManifestDto.items)
        //return this.carrierService.getQuotes();
        /*return this.carrierService.create(createManifestDto)
            .then((carrier: Manifest) => {
                return this.getIManifest(carrier);
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });*/
        return {
            rates: [{
                'service_name': 'Endertech Overnight',
                'service_code': 'ETON',
                'total_price': 50,
                'currency': 'USD',
                'min_delivery_date': '2019-08-20T18:26:28.158Z',
                'max_delivery_date': '2019-08-20T18:26:28.158Z'
            },
            {
                'service_name': 'Endertech Regular',
                'service_code': 'ETREG',
                'total_price': 100,
                'currency': 'USD',
                'min_delivery_date': '2019-08-20T18:26:28.158Z',
                'max_delivery_date': '2019-08-20T18:26:28.158Z'
            }]
        }
    }

    @Get('callback')
    @UsePipes(new ValidationPipe())
    async callback(@Query() query: any) {
        let shop = query.shop;
        let code = query.code;

        const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
        const accessTokenPayload = {
            client_id: apiKey,
            client_secret: apiSecret,
            code
        }

        return request.post(accessTokenRequestUrl, { json: accessTokenPayload })
            .then((accessTokenResponce) => {
                const accessToken = accessTokenResponce.access_token;

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
                return request.post(apiRequestUrl, { json: data, headers: apiRequestHeader })
                    .then((accessTokenResponce) => {
                        console.log(accessTokenResponce);
                        console.log(data);
                    })
                /*this.httpService.post(apiRequestUrl, {}, { headers:  apiRequestHeader })
                    .pipe(
                        map(response => {
                            console.log(response.data);
                            return accessToken
                        })
                    );*/
            })

        /* return this.httpService.post(accessTokenRequestUrl, accessTokenPayload)
             .pipe(               
                 map(response => {
                    return response.data.access_token;
                 })
             );*/

        /*return this.httpService.post(accessTokenRequestUrl,{json: accessTokenPayload})
            .pipe(
                map(response => {
                    console.log(response.data);
                })
            );
        /*return this.carrierService.create(createManifestDto)
            .then((carrier: Manifest) => {
                return this.getIManifest(carrier);
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });*/
    }

    @Put(':id')
    @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
    async update(@Param('id') id: string, @Body() carrier: UpdateManifestDto) {
        return this.carrierService.update(id, carrier)
            .then((carrier: Manifest) => {
                return this.getIManifest(carrier);
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });
    }

    @Get()
    async getManifest(@Query() query: any, @Response() response: express.Response) {
        let shop = query.shop;
        if (shop) {
            const state = nonce();
            const redirectUrl = forwardingAddress + '/carrier-service/callback';
            const installUrl = 'https://' + shop + '/admin/oauth/authorize?client_id='
                + apiKey +
                '&scope=' + scopes +
                '&state=' + state +
                '&redirect_uri=' + redirectUrl;
            return response.redirect(303, installUrl);
        } else {
            console.log('please add a valid shop parameter');
        }

        /*return this.carrierService.getManifest(id)
            .then((carrier: Manifest) => {
                return this.getIManifest(carrier);
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });*/
    }

    /*@Get()
    getCompanies(@GetUser() user: User, @Query() filter: FilterManifestDto) {
        return this.carrierService.getCompanies(user, filter)
            .then((companies: Manifest[]) => {
                return companies.map((carrier: Manifest) => {
                    return this.getIManifest(carrier);
                });
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });

    }*/

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.carrierService.delete(id)
            .then((carrier: Manifest) => {
                return this.getIManifest(carrier);
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });
    }

    getIManifest(carrier: Manifest): IManifest {
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
