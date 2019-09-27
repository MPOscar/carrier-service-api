'use strict';
import { Injectable } from '@nestjs/common';
import * as NodeGeocoder from 'node-geocoder';
import * as soap from 'soap';
import { ConfigService } from '../common/config/config.service';
import { GeoRes } from '../geocoder/geores.dto';
import { RateProductResponse } from '../rates/dto/chile/rate-product-respose.dto';
import { Sucursal } from '../rates/dto/chile/sucursal.dto';
import { ShopifyItemDto } from '../rates/dto/shopify/shopify-item.dto';
import { ShopifyParentRateDto } from '../rates/dto/shopify/shopify-parent-rate.dto';
import { ShopifyRateResponseDto } from '../rates/dto/shopify/shopify-rate-response.dto';
import { User } from '../user/user.entity';
import { Order } from '../order/order.entity';

@Injectable()
export class SoapService {
    constructor(private readonly configService: ConfigService) {}

    async getServiceCost(
        ratesDto: ShopifyParentRateDto,
        user: User,
    ): Promise<ShopifyRateResponseDto[]> {
        const url =
            'http://apicert.correos.cl:8008/ServicioTarificacionCEPEmpresasExterno/cch/ws/tarificacionCEP/externo/implementacion/ExternoTarificacion.asmx?wsdl';

        let geoItem = await this.getGeocodeAddress(
            ratesDto.rate.destination.address1,
            ratesDto.rate.destination.country,
        );

        const args = {
            // usuario: user.userApiChile,
            // contrasena: user.passwordApiChile,

            usuario: this.configService.get('SOAP_USER'),
            contrasena: this.configService.get('SOAP_PASSWORD'),

            consultaCobertura: {
                CodigoPostalDestinatario: ratesDto.rate.destination.postal_code,
                CodigoPostalRemitente: ratesDto.rate.origin.postal_code,
                ComunaDestino: geoItem ? geoItem.city : '?',
                ComunaRemitente: ratesDto.rate.origin.province,
                CodigoServicio: '?',
                ImporteReembolso: 5,
                ImporteValorAsegurado: 3,
                Kilos: this.getTotalWeight(ratesDto.rate.items),
                NumeroTotalPieza: this.getTotalPieces(ratesDto.rate.items),
                PaisDestinatario: ratesDto.rate.destination.country,
                PaisRemitente: ratesDto.rate.origin.country,
                TipoPortes: 'P',
                Volumen: 50 ** 3 / 1000000,
            },
        };

        let sucursalCarrier: ShopifyRateResponseDto = await this.getSucursal(
            ratesDto,
            user,
        );

        console.log('USERRR => ' + JSON.stringify(user));
        console.log('GEOOOOO => ' + JSON.stringify(geoItem));
        console.log('SUCURSAL => ' + JSON.stringify(sucursalCarrier));

        return new Promise(
            (
                resolve: (result: ShopifyRateResponseDto[]) => void,
                reject: (reason) => void,
            ): void => {
                soap.createClient(url, {}, function(err, client) {
                    if (err) reject(err);

                    client.consultaCoberturaPorProducto(args, function(
                        err,
                        obj: RateProductResponse,
                    ) {
                        if (err) {
                            throw err;
                        }
                        console.log(
                            'CARRIERRR CHILE => ' + JSON.stringify(obj),
                        );
                        sucursalCarrier.total_price =
                            obj.consultaCoberturaPorProductoResult.TotalTasacion.Total;
                        let date = new Date();
                        let res: ShopifyRateResponseDto[] = [
                            {
                                service_name: 'PED Correos de Chile',
                                service_code: '24',
                                total_price:
                                    obj.consultaCoberturaPorProductoResult
                                        .TotalTasacion.Total,
                                currency: ratesDto.rate.currency,
                                min_delivery_date: date.toDateString(),
                                max_delivery_date: (
                                    date.getDate() + 30
                                ).toString(),
                            },
                            sucursalCarrier,
                        ];
                        console.log('CARRIERRR => ' + JSON.stringify(res));
                        return resolve(res);
                    });

                    // Other method that return an array
                    /* client.consultaCobertura(args, function(err, obj: RateResponse) {
                    if(err) { throw err; }

                    let res = obj.consultaCoberturaResult.ServicioTO.map((val) => {
                        return {
                            service_name: "Name", 
                            service_code: val.CodigoServicio,
                            total_price: val.TotalTasacion.Total,
                            currency: ratesDto.rate.currency,
                            min_delivery_date: new Date(),
                            max_delivery_date: new Date()
                        }
                    });
    
                    return resolve(res);
                });*/
                });
            },
        );
    }

    async getSucursal(
        ratesDto: ShopifyParentRateDto,
        user: User,
    ): Promise<ShopifyRateResponseDto> {
        const url =
            'http://b2b.correos.cl:8008/ServicioListadoSucursalesExterno/cch/ws/distribucionGeografica/implementacion/ServicioExternoListarSucursales.asmx?wsdl';

        let geoItem = await this.getGeocodeAddress(
            ratesDto.rate.destination.address1,
            ratesDto.rate.destination.country,
        );

        const args = {
            // usuario: user.userApiChile,
            // contrasena: user.passwordApiChile,
            usuario: this.configService.get('SOAP_USER'),
            contrasena: this.configService.get('SOAP_PASSWORD'),
            id: 1,
            nombreCalle: geoItem.streetName,
            numeroCalle: geoItem.streetNumber,
            restoCalle: '?',
            NombreComuna: geoItem.city,
            latitud: geoItem.latitude,
            longitud: geoItem.longitude,
        };

        return new Promise(
            (
                resolve: (result: ShopifyRateResponseDto) => void,
                reject: (reason) => void,
            ): void => {
                soap.createClient(url, {}, function(err, client) {
                    if (err) reject(err);

                    client.consultaSucursalMasCercana(args, function(
                        err,
                        obj: Sucursal,
                    ) {
                        if (err) reject(err);

                        let date = new Date();
                        let res: ShopifyRateResponseDto = {
                            service_name:
                                'PES ' +
                                obj.consultaSucursalMasCercanaResult
                                    .NombreAgencia,
                            service_code: '07',
                            total_price: '0',
                            currency: ratesDto.rate.currency,
                            min_delivery_date: date.toDateString(),
                            max_delivery_date: (date.getDate() + 30).toString(),
                        };

                        return resolve(res);
                    });
                });
            },
        );
    }

    async processAdmission(order: Order, user: User): Promise<any> {
        const url =
            'http://apicert.correos.cl:8008/ServicioAdmisionCEPExterno/cch/ws/enviosCEP/externo/implementacion/ServicioExternoAdmisionCEP.asmx?wsdl';

        let geoItem = await this.getGeocodeAddress(
            order.receiverAddress,
            order.receiverCountry,
        );

        const args = {
            // usuario: user.userApiChile,
            // contrasena: user.passwordApiChile,
            usuario: this.configService.get('SOAP_USER'),
            contrasena: this.configService.get('SOAP_PASSWORD'),

            admisionTo: {
                CodigoAdmision: '?',
                ClienteRemitente: user.idApiChile,
                CentroRemitente: '?',
                NombreRemitente: '?',
                DireccionRemitente: user.address,
                PaisRemitente: '056',
                CodigoPostalRemitente: '?',
                ComunaRemitente: user.comuna,
                RutRemitente: '?',
                PersonaContactoRemitente: user.firstName + ' ' + user.lastName,
                TelefonoContactoRemitente: user.phone,
                ClienteDestinatario: '?',
                CentroDestinatario: '?',
                NombreDestinatario: order.receiverName,
                DireccionDestinatario: order.receiverAddress,
                PaisDestinatario: '056',
                CodigoPostalDestinatario: '?',
                ComunaDestinatario: geoItem.city,
                RutDestinatario: '?',
                PersonaContactoDestinatario: order.receiverContactName,
                TelefonoContactoDestinatario: order.receiverContactPhone,
                CodigoServicio: order.serviceCode,
                NumeroTotalPiezas: order.totalPieces,
                Kilos: order.kg,
                Volumen: order.volumen,
                NumeroReferencia: '011043183201',
                ImporteReembolso: 0,
                ImporteValorDeclarado: 0,
                TipoPortes: 'P',
                Observaciones: '?',
                Observaciones2: '?',
                EmailDestino: order.email,
                TipoMercancia: '?',
                DevolucionConforme: 'N',
                NumeroDocumentos: 0,
                PagoSeguro: 'N',
            },
        };

        return new Promise(
            (
                resolve: (result: any) => void,
                reject: (reason) => void,
            ): void => {
                soap.createClient(url, {}, function(err, client) {
                    if (err) reject(err);

                    client.admitirEnvio(args, function(err, obj: any) {
                        if (err) reject(err);
                        console.log('ADMISION => ' + JSON.stringify(obj));
                        return resolve(obj);
                    });
                });
            },
        );
    }

    getGeocodeAddress(address: string, countryCode: string): Promise<GeoRes> {
        return new Promise(
            (
                resolve: (result: GeoRes) => void,
                reject: (reason) => void,
            ): void => {
                const options = {
                    provider: 'mapquest',
                    httpAdapter: 'http',
                    apiKey: this.configService.get('MAPQUEST_API_KEY'),
                    formatter: null,
                };

                var geocoder = NodeGeocoder(options);

                geocoder.geocode(
                    { address: address, country: countryCode },
                    function(err, res: GeoRes[]) {
                        if (err) reject(err);

                        resolve(res[0]);
                    },
                );
            },
        );
    }

    getTotalWeight(items: ShopifyItemDto[]): number {
        let totalWeight = 0;

        items.forEach(element => {
            totalWeight += element.grams / 1000;
        });

        return totalWeight;
    }

    getTotalPieces(items: ShopifyItemDto[]): number {
        let totalPieces = 0;

        items.forEach(element => {
            totalPieces += element.quantity;
        });

        return totalPieces;
    }
}
