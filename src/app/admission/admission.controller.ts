import {
    Controller,
    Post,
    UsePipes,
    ValidationPipe,
    UseGuards,
    Body,
} from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { AdmissionService } from './admission.service';
import { IAdmission } from './interfaces/admission.interface';
import { ErrorResult } from '../common/error-manager/errors';
import { ErrorManager } from '../common/error-manager/error-manager';
import { Admission } from './admission.entity';
import { GetUser } from '../common/decorator/user.decorator';
import { JwtAuthGuard } from '../common/auth/guards/auth.guard';
import { OrderIdDto } from './dto/order-id.dto';
import { IdsDto } from './dto/ids.dto';

@Controller('admission')
@UseGuards(JwtAuthGuard)
export class AdmissionController {
    constructor(private readonly admissionService: AdmissionService) {}

    @Post()
    @UsePipes(new ValidationPipe())
    async processAdmission(@GetUser() user: User, @Body() orderId: OrderIdDto) {
        return this.admissionService
            .processAdmission(orderId.orderId, user)
            .then((admission: Admission) => {
                return this.getIAdmission(admission);
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });
    }

    @Post('bulk')
    @UsePipes(new ValidationPipe())
    async processBulkAdmission(@GetUser() user: User, @Body() orderIds: IdsDto) {
        return this.admissionService
            .processBulkAdmission(user, orderIds)
            .then((admissions: Admission[]) => {
                return this.getIAdmissions(admissions);
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });
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

    getIAdmissions(admissions: Admission[]) {
        return admissions.map((admission: Admission) => {
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
        });
    }
}
