import { Controller, Post, Put, Get, Delete, UsePipes, Body, Param, Query, Response, Req, HttpService } from '@nestjs/common';
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
const crypto = require('crypto');
const cookie = require('cookie');
const querystring = require('querystring');
const nonce = require('nonce')();
const request = require('request-promise');

const apiKey = configService.get('SHOPIFY_API_KEY');
const apiSecret = configService.get('SHOPIFY_API_SECRET_KEY');
const scopes = 'write_shipping, read_themes, write_themes, read_orders, read_script_tags, write_script_tags, read_fulfillments';
// const forwardingAddress =  configService.get('FORWARDING_ADDRESS');
const forwardingAddress =  "https://56908b25.ngrok.io/api/v1";
import { Request } from 'express';

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
            console.log("ITEMSSS => " + JSON.stringify(createCarrierDto.rate.items));
            const resp = await this.soapService.getServiceCost(createCarrierDto);
            return response.json({ rates: resp });
        } catch(error) {
            throw error;
        }  
    }

    @Get('callback')
    @UsePipes(new ValidationPipe())
    async callback(@Query() query: any, @Req() req: Request, @Response() res: express.Response) {
        let code = query.code;
        let hmac = query.hmac;
        let shop = query.shop;
        let state = query.state;

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
                'utf-8'
              );
            let hashEquals = false;      

            try {
              hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
            } catch (e) {
              hashEquals = false;
            };
        
            if (!hashEquals) {
              return res.status(400).send('HMAC validation failed');
            }
        
            const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
            const accessTokenPayload = {
                client_id: apiKey,
                client_secret: apiSecret,
                code
            }
    
            return request.post(accessTokenRequestUrl, { json: accessTokenPayload })
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
          } else {
            res.status(400).send('Required parameters missing');
          }
     
    }

  
    @Get()
    async getCarrier(@Query() query: any, @Response() res: express.Response) {
        let shop = query.shop;
        if (shop) {
            const state = nonce();
            const redirectUrl = forwardingAddress + '/carrier-service/callback';
            const installUrl = 'https://' + shop + '/admin/oauth/authorize?client_id='
                + apiKey +
                '&scope=' + scopes +
                '&state=' + state +
                '&redirect_uri=' + redirectUrl;
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
