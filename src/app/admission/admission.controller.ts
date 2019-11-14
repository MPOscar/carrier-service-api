import {
    Controller,
    Post,
    UsePipes,
    ValidationPipe,
    Query,
    Response,
} from '@nestjs/common';
import { AdmissionResponseDto } from './dto/admission-response.dto';
import { User } from '../user/user.entity';
import { Order } from '../order/order.entity';
import { UserService } from '../user/user.service';
import { OrderService } from '../order/order.service';
import * as express from 'express';
import { AdmissionService } from './admission.service';
import { IAdmission } from './interfaces/admission.interface';
import { ErrorResult } from '../common/error-manager/errors';
import { ErrorManager } from '../common/error-manager/error-manager';

@Controller('admission')
export class AdmissionController {
    constructor(
        private readonly userService: UserService,
        private readonly orderService: OrderService,
        private readonly admissionService: AdmissionService,
    ) {}

    @Post()
    @UsePipes(new ValidationPipe())
    async processAdmission(@Query() query: any) {
        let user: User = await this.userService.getUser(query.userId);
        let order: Order = await this.orderService.getOrder(query.orderId);

        return this.admissionService
            .processAdmission(order, user)
            .then((admission: AdmissionResponseDto) => {
                return this.getIAdmission(admission);
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });

        // try {
        //     const resp: AdmissionResponseDto = await this.soapService.processAdmission(
        //         order,
        //         user,
        //     );

        //     const userDto = plainToClass(UpdateUserDto, user);
        //     let correlativeNumber = user.correlativeNumber + 1;

        //     let manifestDto: ManifestDto = {
        //         clientRut: '88020127381', // must be user.rut
        //         clientName: user.firstName,
        //         manifestNumber: user.idApiChile + correlativeNumber,
        //         productName: order.name,
        //         trackingReference: resp.admitirEnvioResult.CodigoEncaminamiento,
        //         packagesCount: 1,
        //         barCode:
        //             resp.admitirEnvioResult.CodigoEncaminamiento +
        //             resp.admitirEnvioResult.NumeroEnvio +
        //             '1', //TODO: Change 1 for tatola pieces
        //         expNumber: '805', // TODO: check this
        //         admissionCode: resp.admitirEnvioResult.CodigoAdmision,
        //     };

        //     userDto.correlativeNumber = correlativeNumber;
        //     await this.userService.update(user.id, userDto);

        //     const manifest = await this.manifestService.create(
        //         manifestDto,
        //         order,
        //     );
        //     return response.json({ manifest });
        // } catch (error) {
        //     throw error;
        // }
    }

    getIAdmission(admission: AdmissionResponseDto): IAdmission {
        return {
            cuartel: admission.admitirEnvioResult.Cuartel,
            sector: admission.admitirEnvioResult.Sector,
            SDP: admission.admitirEnvioResult.SDP,
            abreviaturaCentro: admission.admitirEnvioResult.AbreviaturaCentro,
            codigoDelegacionDestino:
                admission.admitirEnvioResult.CodigoDelegacionDestino,
            nombreDelegacionDestino:
                admission.admitirEnvioResult.NombreDelegacionDestino,
            direccionDestino: admission.admitirEnvioResult.DireccionDestino,
            codigoEncaminamiento:
                admission.admitirEnvioResult.CodigoEncaminamiento,
            grabarEnvio: admission.admitirEnvioResult.GrabarEnvio,
            numeroEnvio: admission.admitirEnvioResult.NumeroEnvio,
            comunaDestino: admission.admitirEnvioResult.ComunaDestino,
            abreviaturaServicio:
                admission.admitirEnvioResult.AbreviaturaServicio,
            codigoAdmision: admission.admitirEnvioResult.CodigoAdmision,
        };
    }
}
