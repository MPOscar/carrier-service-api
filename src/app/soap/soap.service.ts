import { Injectable } from "@nestjs/common";
import { ConfigService } from "../common/config/config.service";

import * as soap from 'soap';
import { ShopifyRateDto } from "../carrier-service/dto/shopify-rate.dto";
import { ShopifyItemDto } from "../carrier-service/dto/shopify-item.dto";
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

    // TODO: Interfaces and Dto stuff... using types
    getServiceCost(ratesDto: ShopifyRateDto): any{
        const url = "http://apicert.correos.cl:8008/ServicioTarificacionCEPEmpresasExterno/cch/ws/tarificacionCEP/externo/implementacion/ExternoTarificacion.asmx?wsdl"
        const args = {

            //TODO: stop mock, implement get mocked fields
            usuario: this.configService.get('SOAP_USER'),
            contrasena: this.configService.get('SOAP_PASSWORD'),
            CodigoPostalDestinatario: ratesDto.destination.postal_code,
            CodigoPostalRemitente: ratesDto.origin.postal_code,
            ComunaDestino: "ALTO HOSPICIO",
            ComunaRemitente: ratesDto.origin.province,
            ImporteReembolso: 5,
            ImporteValorAsegurado: 3,
            Kilos: this.getTotalWeight(ratesDto.items),
            NumeroTotalPieza: this.getTotalPieces(ratesDto.items),
            PaisDestinatario: ratesDto.destination.country,
            PaisRemitente: ratesDto.origin.country,
            TipoPortes: "P",
            Volumen: 2
        }

        soap.createClient(url, function(err, client) {
            console.log("ERRORRR 1 => " + err);
            client.consultaCobertura(args, function(err, result) {
                console.log("ERRORRR => " + err);
                console.log("SOAPPPPPP => " + JSON.stringify(result));
            });
        });

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
        };
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