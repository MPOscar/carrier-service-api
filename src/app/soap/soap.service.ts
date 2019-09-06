"use strict";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "../common/config/config.service";

import * as soap from 'soap';
import { ShopifyItemDto } from "../rates/dto/shopify/shopify-item.dto";
import { ShopifyParentRateDto } from "../rates/dto/shopify/shopify-parent-rate.dto";
import { plainToClass } from "class-transformer";
import { RateResponse } from "../rates/dto/chile/rate-respose.dto";
import { IRateResponse } from "../rates/interfaces/chile/rate-respose.interface";
import { ServicioTO } from "../rates/dto/chile/servicio-to.dto";
import { ShopifyRateResponseDto } from "../rates/dto/shopify/shopify-rate-response.dto";
// var soap = require('soap');


@Injectable()
export class SoapService {

    constructor(
        private readonly configService: ConfigService,
    ) { }

    getRegions(){
        const url = "http://apicert.correos.cl:8008/ServicioRegionYComunasExterno/cch/ws/distribucionGeografica/externo/implementacion/ServicioExternoRegionYComunas.asmx?wsdl"
        const args = {
            usuario: this.configService.get('SOAP_USER'),
            contrasena: this.configService.get('SOAP_PASSWORD')
        }

        soap.createClient(url, function(err, client) {
            console.log("ERRORRR 1 => " + err);
            client.listarTodasLasRegiones(args, function(err, result) {
                console.log("ERRORRR => " + err);
                console.log("SOAPPPPPP => " + JSON.stringify(result));
            });
        });

        // soap.createClientAsync(url).then((client) => {
        //     return client.listarTodasLasRegiones(args);
        //   }).then((result) => {
        //     console.log("SOAPPPPPP => " + result);
        //   });
    }

    getServiceCost(ratesDto: ShopifyParentRateDto): any{
        const url = "http://apicert.correos.cl:8008/ServicioTarificacionCEPEmpresasExterno/cch/ws/tarificacionCEP/externo/implementacion/ExternoTarificacion.asmx?wsdl";

        const args = {
            usuario: this.configService.get('SOAP_USER'),
            contrasena: this.configService.get('SOAP_PASSWORD'),

            consultaCobertura: {
                CodigoPostalDestinatario: ratesDto.rate.destination.postal_code,
                CodigoPostalRemitente: ratesDto.rate.origin.postal_code,
                ComunaDestino: "ALTO HOSPICIO",
                ComunaRemitente: ratesDto.rate.origin.province,
                ImporteReembolso: 5,
                ImporteValorAsegurado: 3,
                Kilos: this.getTotalWeight(ratesDto.rate.items),
                NumeroTotalPieza: this.getTotalPieces(ratesDto.rate.items),
                PaisDestinatario: ratesDto.rate.destination.country,
                PaisRemitente: ratesDto.rate.origin.country,
                TipoPortes: "P",
                Volumen: 2
            }
        }
       
        return new Promise((resolve, reject) => {
            soap.createClient(url, {}, function(err, client) {
                if (err) { throw err; }
    
                client.consultaCobertura(args, function(err, obj: RateResponse) {
                    if(err) { throw err; }
                    
                    let res = obj.consultaCoberturaResult.ServicioTO.map((val) => {
                        return {
                            service_name: "Name", 
                            service_code: val.CodigoServicio,
                            total_price: val.TotalTasacion.Total,
                            currency: "USD",
                            min_delivery_date: new Date(),
                            max_delivery_date: new Date()
                        }
                    });
    
                    return resolve(res);
                });
            });
        })

        // Async
        // soap.createClientAsync(url).then((client) => {
        //     return client.consultaCobertura(args);
        //   }).then((result) => {
        //     console.log("SOAPPPPPP => " + JSON.stringify(result));
        // }).catch(err => console.log(err));
    }

    mapToShopifyResponse(res: RateResponse[]){
        const result = res.reduce((r,c) => {
            Object.keys(c).map(x => {
              r.push({ rates: c[x].map(y => ({
                service_name: "Name", 
                service_code: y.CodigoServicio,
                total_price: y.Base,
                currency: "USD",
                min_delivery_date: new Date(),
                max_delivery_date: new Date()
             }))})})
             return r}, [])
         
         console.log(result)
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