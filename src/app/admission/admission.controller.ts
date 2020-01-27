import {
    Controller,
    Post,
    UsePipes,
    ValidationPipe,
    Query,
    UseGuards,
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

@Controller('admission')
@UseGuards(JwtAuthGuard)
export class AdmissionController {
    constructor(
        private readonly userService: UserService,
        private readonly admissionService: AdmissionService,
    ) {}

    @Post()
    @UsePipes(new ValidationPipe())
    async processAdmission(@GetUser() user: User, @Query() query: any) {
        return this.admissionService
            .processAdmission(query.orderId, user)
            .then((admission: Admission) => {
                return this.getIAdmission(admission);
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
}
