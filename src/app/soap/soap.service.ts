import { Injectable } from "@nestjs/common";
import { ConfigService } from "../common/config/config.service";

import * as soap from 'soap';
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

}