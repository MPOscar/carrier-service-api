import {
    Controller,
    Post,
    UsePipes,
    ValidationPipe,
    Query,
    UseGuards,
} from '@nestjs/common';
import { User } from '../user/user.entity';
import { Order } from '../order/order.entity';
import { UserService } from '../user/user.service';
import { OrderService } from '../order/order.service';
import { AdmissionService } from './admission.service';
import { IAdmission } from './interfaces/admission.interface';
import { ErrorResult } from '../common/error-manager/errors';
import { ErrorManager } from '../common/error-manager/error-manager';
import { Admission } from './admission.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../common/decorator/user.decorator';

@Controller('admission')
@UseGuards(AuthGuard())
export class AdmissionController {
    constructor(
        private readonly userService: UserService,
        private readonly orderService: OrderService,
        private readonly admissionService: AdmissionService,
    ) {}

    @Post()
    @UsePipes(new ValidationPipe())
    async processAdmission(@GetUser() user: User, @Query() query: any) {
        let order: Order = await this.orderService.getOrder(query.orderId);

        return this.admissionService
            .processAdmission(order, user)
            .then((admission: Admission) => {
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

    getIAdmission(admission: Admission): IAdmission {
        return {
            cuartel: admission.cuartel,
            sector: admission.sector,
            SDP: admission.SDP,
            abreviaturaCentro: admission.abreviaturaCentro,
            codigoDelegacionDestino: admission.codigoDelegacionDestino,
            nombreDelegacionDestino: admission.nombreDelegacionDestino,
            direccionDestino: admission.direccionDestino,
            codigoEncaminamiento: admission.codigoEncaminamiento,
            grabarEnvio: admission.grabarEnvio,
            numeroEnvio: admission.numeroEnvio,
            comunaDestino: admission.comunaDestino,
            abreviaturaServicio: admission.abreviaturaServicio,
            codigoAdmision: admission.codigoAdmision,
        };
    }
}
