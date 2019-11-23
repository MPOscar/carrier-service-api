'use strict';
import { Injectable } from '@nestjs/common';
import * as soap from 'soap';
import { ConfigService } from '../common/config/config.service';
import { RateProductResponse } from '../rates/dto/chile/rate-product-respose.dto';
import { Sucursal } from '../rates/dto/chile/sucursal.dto';
import { ShopifyItemDto } from '../rates/dto/shopify/shopify-item.dto';
import { ShopifyParentRateDto } from '../rates/dto/shopify/shopify-parent-rate.dto';
import { ShopifyRateResponseDto } from '../rates/dto/shopify/shopify-rate-response.dto';
import { User } from '../user/user.entity';
import { Order } from '../order/order.entity';
import * as dataRegions from './region-comuna-sucursal.json';
import { CreateWithdrawalDto } from '../withdrawal/dto/create-withdrawal.dto';

@Injectable()
export class SoapService {
    constructor(private readonly configService: ConfigService) {}

    async getServiceCost(
        ratesDto: ShopifyParentRateDto,
        user: User,
    ): Promise<ShopifyRateResponseDto[]> {
        return new Promise(
            async (
                resolve: (result: ShopifyRateResponseDto[]) => void,
                reject: (reason) => void,
            ): Promise<void> => {
                const url =
                    'http://apicert.correos.cl:8008/ServicioTarificacionCEPEmpresasExterno/cch/ws/tarificacionCEP/externo/implementacion/ExternoTarificacion.asmx?wsdl';

                let comunaDestino = dataRegions
                    .find(reg => reg.rgi == ratesDto.rate.destination.province)
                    .comunas.find(
                        comuna =>
                            comuna.name.includes(
                                ratesDto.rate.destination.city.toUpperCase(),
                            ) ||
                            ratesDto.rate.destination.city
                                .toUpperCase()
                                .includes(comuna.name),
                    ).name;

                const args = {
                    usuario: user.userApiChile,
                    contrasena: user.passwordApiChile,

                    // usuario: this.configService.get('SOAP_USER'),
                    // contrasena: this.configService.get('SOAP_PASSWORD'),

                    consultaCobertura: {
                        CodigoPostalDestinatario: '',
                        CodigoPostalRemitente: user.zip,
                        ComunaDestino: comunaDestino,
                        ComunaRemitente: user.comuna,
                        CodigoServicio: '24',
                        ImporteReembolso: '',
                        ImporteValorAsegurado: '',
                        Kilos: this.getTotalWeight(ratesDto.rate.items),
                        NumeroTotalPieza: this.getTotalPieces(
                            ratesDto.rate.items,
                        ),
                        PaisDestinatario: '056',
                        PaisRemitente: '056',
                        TipoPortes: 'P',
                        Volumen: 0.000001,
                    },
                };

                let sucursalCarrier: ShopifyRateResponseDto[] = await this.getSucursals(
                    ratesDto,
                );

                let res: ShopifyRateResponseDto[] = [];

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

                        let recharge: number =
                            user.recharge != null ? user.recharge : 0;
                        let date = new Date();
                        let totalPrice =
                            obj.consultaCoberturaPorProductoResult.TotalTasacion
                                .Total + recharge;

                        res.push({
                            service_name: 'OFICINA DE CORREOS',
                            service_code: '24',
                            total_price: totalPrice,
                            currency: ratesDto.rate.currency,
                            min_delivery_date: date.toDateString(),
                            max_delivery_date: (date.getDate() + 30).toString(),
                        });

                        for (let i = 0; i < sucursalCarrier.length; i++) {
                            const element = sucursalCarrier[i];
                            element.total_price = totalPrice;

                            res.push(element);
                        }
                        console.log('CARRIERRR => ' + JSON.stringify(res));
                        resolve(res);
                    });
                });
            },
        );
    }

    async getSucursals(
        ratesDto: ShopifyParentRateDto,
    ): Promise<ShopifyRateResponseDto[]> {
        return new Promise(
            (
                resolve: (result: ShopifyRateResponseDto[]) => void,
                reject: (reason) => void,
            ): void => {
                let responseArr = [];
                let date = new Date();

                let sucursales = dataRegions
                    .find(reg => reg.rgi == ratesDto.rate.destination.province)
                    .comunas.find(
                        comuna =>
                            comuna.name.includes(
                                ratesDto.rate.destination.city.toUpperCase(),
                            ) ||
                            ratesDto.rate.destination.city
                                .toUpperCase()
                                .includes(comuna.name),
                    ).sucursales;

                let serviceCode = 25;

                for (let i = 0; i < sucursales.length; i++) {
                    const sucursal = sucursales[i];

                    let res: ShopifyRateResponseDto = {
                        service_name: 'SUCURSAL ' + sucursal.address,
                        service_code: ('0' + serviceCode++).slice(-3),
                        total_price: '0',
                        currency: ratesDto.rate.currency,
                        min_delivery_date: date.toDateString(),
                        max_delivery_date: (date.getDate() + 30).toString(),
                    };

                    responseArr.push(res);
                }
                resolve(responseArr);
            },
        );
    }

    async processAdmission(order: Order, user: User): Promise<any> {
        const url =
            'http://apicert.correos.cl:8008/ServicioAdmisionCEPExterno/cch/ws/enviosCEP/externo/implementacion/ServicioExternoAdmisionCEP.asmx?wsdl';

        let comunaDestino = dataRegions
            .find(reg => reg.rgi == order.receiverCityCode)
            .comunas.find(
                comuna =>
                    comuna.name.includes(order.receiverCity.toUpperCase()) ||
                    order.receiverCity.toUpperCase().includes(comuna.name),
            ).name;

        const args = {
            usuario: user.userApiChile,
            contrasena: user.passwordApiChile,
            // usuario: this.configService.get('SOAP_USER'),
            // contrasena: this.configService.get('SOAP_PASSWORD'),

            admisionTo: {
                CodigoAdmision: '011043183201', // TODO: change admission code strategiy
                ClienteRemitente: user.idApiChile,
                CentroRemitente: '',
                NombreRemitente: user.firstName, // TODO: save in user store name
                DireccionRemitente: user.address,
                PaisRemitente: '056',
                CodigoPostalRemitente: '',
                ComunaRemitente: user.comuna,
                RutRemitente: user.rut,
                PersonaContactoRemitente: (
                    user.firstName +
                    ' ' +
                    user.lastName
                ).toString(),
                TelefonoContactoRemitente: user.phone ? user.phone : '',
                ClienteDestinatario: '',
                CentroDestinatario: '',
                NombreDestinatario: order.receiverName
                    ? order.receiverName
                    : '',
                DireccionDestinatario: order.receiverAddress,
                PaisDestinatario: '056',
                CodigoPostalDestinatario: '',
                ComunaDestinatario: comunaDestino,
                RutDestinatario: '',
                PersonaContactoDestinatario: order.receiverContactName
                    ? order.receiverContactName
                    : '',
                TelefonoContactoDestinatario: order.receiverContactPhone
                    ? order.receiverContactPhone
                    : '',
                CodigoServicio: order.serviceCode ? order.serviceCode : '',
                NumeroTotalPiezas: order.totalPieces ? order.totalPieces : '',
                Kilos: order.kg ? order.kg : '',
                Volumen: order.volumen ? order.volumen : '',
                NumeroReferencia: '011043183201',
                ImporteReembolso: 0,
                ImporteValorDeclarado: 0,
                TipoPortes: 'P',
                Observaciones: '',
                Observaciones2: '',
                EmailDestino: order.email,
                TipoMercancia: '',
                DevolucionConforme: 'N',
                NumeroDocumentos: 0,
                PagoSeguro: 'N',
            },
        };

        console.log('USER ADM => ' + JSON.stringify(user));
        console.log('ARGS ADM => ' + JSON.stringify(args));

        return new Promise(
            (
                resolve: (result: any) => void,
                reject: (reason) => void,
            ): void => {
                soap.createClient(url, {}, function(err, client) {
                    if (err) reject(err);

                    client.admitirEnvio(args, function(err, obj: any) {
                        if (err) reject(err);
                        client.describe();
                        return resolve(obj);
                    });
                });
            },
        );
    }

    async processWithdrawal(
        user: User,
        createWithdrawalDto: CreateWithdrawalDto,
    ): Promise<any> {
        const url =
            'http://apicert.correos.cl:8008/ServicioRetiroEnvioExterno/cch/ws/retirosCEP/externo/implementacion/ServicioExternoRetiro.asmx?wsdl';

        const args = {
            // usuario: user.userApiChile,
            // contrasena: user.passwordApiChile,
            usuario: this.configService.get('SOAP_USER'),
            contrasena: this.configService.get('SOAP_PASSWORD'),

            retiroTo: {
                CodigoAdmision: '9290582385',
                ClienteRemitente: user.idApiChile,
                CentroRemitente: '',
                NombreRemitente: user.firstName, // TODO: save in user store name
                DireccionRemitente: createWithdrawalDto.address,
                PaisRemitente: '056',
                CodigoPostalRemitente: createWithdrawalDto.zip,
                ComunaRemitente: createWithdrawalDto.comuna,
                RutRemitente: createWithdrawalDto.rut,
                PersonaContactoRemitente: createWithdrawalDto.contact,
                TelefonoContactoRemitente: createWithdrawalDto.contactPhone,
                FechaRetiro: createWithdrawalDto.date,
                HoraDesde: createWithdrawalDto.horaDesde,
                HoraHasta: createWithdrawalDto.horaHasta,
            },
        };

        return new Promise(
            (
                resolve: (result: any) => void,
                reject: (reason) => void,
            ): void => {
                soap.createClient(url, {}, function(err, client) {
                    if (err) reject(err);

                    client.registrarRetiro(args, function(err, obj: any) {
                        if (err) reject(err);

                        return resolve(obj);
                    });
                });
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
