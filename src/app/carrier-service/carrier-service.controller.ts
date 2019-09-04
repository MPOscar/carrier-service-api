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
import { Carrier } from './carrier-service.entity';
import { CarrierService } from './carrier-service.service';
import { CreateCarrierDto } from './dto/create-carrier-service.dto';
import { FilterCarrierDto } from './dto/filter-carrier-service.dto';
import { UpdateCarrierDto } from './dto/update-carrier-service.dto';
import { ICarrier } from './interfaces/carrier-service.interface';
import * as express from 'express';
//

import { ConfigService } from '../common/config/config.service';
import { SoapService } from '../soap/soap.service';
import { ShopifyParentRateDto } from '../rates/dto/shopify/shopify-parent-rate.dto';
const configService = new ConfigService();
const request = require('request-promise');
const nonce = require('nonce')();

const apiKey = configService.get('SHOPIFY_API_KEY');
const apiSecret = configService.get('SHOPIFY_API_SECRET_KEY');
const scopes = 'write_shipping, read_themes, write_themes, read_orders, read_script_tags, write_script_tags';
const forwardingAddress = 'https://61ec8cb2.ngrok.io/api/v1';

@Controller('carrier-service')
//@UseGuards(AuthGuard(), RolesGuard)
export class CarrierController {

    constructor(
        private readonly carrierService: CarrierService,
        private readonly httpService: HttpService,
        private readonly soapService: SoapService
    ) { }

    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() createCarrierDto: ShopifyParentRateDto, @Response() response: express.Response) {
        try {
            const resp = await this.soapService.getServiceCost(createCarrierDto);
            console.log("RESPPPPPP2 => " + JSON.stringify(resp));
            return response.json({ rates: resp });
        } catch(error) {
            throw error;
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
            .then((response) => {
                const accessToken = response.access_token;

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

                console.log(accessToken);

                return request.post(apiRequestUrl, { json: data, headers: apiRequestHeader })
                    .then((response) => {
                        console.log(response);
                        return request.post(apiRequestUrlWebhook, { json: dataWebhook, headers: apiRequestHeaderWebhook })
                            .then((response) => {
                                console.log(response);
                            })
                    });               
            })
    }

    @Put(':id')
    @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
    async update(@Param('id') id: string, @Body() carrier: UpdateCarrierDto) {
        return this.carrierService.update(id, carrier)
            .then((carrier: Carrier) => {
                return this.getICarrier(carrier);
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });
    }

    @Get()
    async getCarrier(@Query() query: any, @Response() response: express.Response) {
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

        /*return this.carrierService.getCarrier(id)
            .then((carrier: Carrier) => {
                return this.getICarrier(carrier);
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });*/
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
        return this.carrierService.delete(id)
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
