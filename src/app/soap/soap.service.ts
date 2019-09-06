"use strict";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "../common/config/config.service";

import * as soap from 'soap';
import { ShopifyItemDto } from "../rates/dto/shopify/shopify-item.dto";
import { ShopifyParentRateDto } from "../rates/dto/shopify/shopify-parent-rate.dto";
import { RateResponse } from "../rates/dto/chile/rate-respose.dto";
import { RateProductResponse } from "../rates/dto/chile/rate-product-respose.dto";

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
            client.listarTodasLasRegiones(args, function(err, result) {
                console.log("Regions => " + JSON.stringify(result));
            });
        });
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
                CodigoServicio: "?",
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
       
        return new Promise((resolve) => {
            soap.createClient(url, {}, function(err, client) {
                if (err) { throw err; }

                client.consultaCoberturaPorProducto(args, function(err, obj: RateProductResponse) {
                    if(err) { throw err; }
                    let date = new Date();
                    let res =  {
                            service_name: "Correos de Chile", 
                            service_code: "01",
                            total_price: obj.consultaCoberturaPorProductoResult.TotalTasacion.Total,
                            currency: ratesDto.rate.currency,
                            min_delivery_date: date,
                            max_delivery_date: date.getDate() + 30
                        }
    
                    return resolve(res);
                });
                
                // Other method that return an array
                // client.consultaCobertura(args, function(err, obj: RateResponse) {
                //     if(err) { throw err; }

                    // let res = obj.consultaCoberturaResult.ServicioTO.map((val) => {
                    //     return {
                    //         service_name: "Name", 
                    //         service_code: val.CodigoServicio,
                    //         total_price: val.TotalTasacion.Total,
                    //         currency: ratesDto.rate.currency,
                    //         min_delivery_date: new Date(),
                    //         max_delivery_date: new Date()
                    //     }
                    // });
    
                    // return resolve(res);
                // });
            });
        })
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