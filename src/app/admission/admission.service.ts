import { Injectable } from '@nestjs/common';
import { Order } from '../order/order.entity';
import { User } from '../user/user.entity';
import {
    ErrorResult,
    InternalServerErrorResult,
} from '../common/error-manager/errors';
import { SoapService } from '../soap/soap.service';
import { AdmissionResponseDto } from './dto/admission-response.dto';
import { ErrorCode } from '../common/error-manager/error-codes';

@Injectable()
export class AdmissionService {
    constructor(private readonly soapService: SoapService) {}

    async processAdmission(
        order: Order,
        user: User,
    ): Promise<AdmissionResponseDto> {
        return new Promise(
            (
                resolve: (result: AdmissionResponseDto) => void,
                reject: (reason: ErrorResult) => void,
            ): void => {
                this.soapService
                    .processAdmission(order, user)
                    .then((resp: AdmissionResponseDto) => {
                        resolve(resp);
                    })
                    .catch(error => {
                        reject(
                            new InternalServerErrorResult(
                                ErrorCode.GeneralError,
                                error,
                            ),
                        );
                    });
            },
        );
    }
}
