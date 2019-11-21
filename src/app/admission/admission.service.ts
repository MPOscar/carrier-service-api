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
import { AdmissionRepository } from './admission.repository';
import { Admission } from './admission.entity';
import { FulfillmentService } from '../fulfillment/fulfillment.service';

@Injectable()
export class AdmissionService {
    constructor(
        private readonly soapService: SoapService,
        private readonly admissionRepository: AdmissionRepository,
    ) {}

    async processAdmission(order: Order, user: User): Promise<Admission> {
        return new Promise(
            (
                resolve: (result: Admission) => void,
                reject: (reason: ErrorResult) => void,
            ): void => {
                this.soapService
                    .processAdmission(order, user)
                    .then((resp: AdmissionResponseDto) => {
                        this.admissionRepository
                            .createAdmission(resp, order)
                            .then((admission: Admission) => {
                                resolve(admission);
                            })
                            .catch(error => {
                                reject(
                                    new InternalServerErrorResult(
                                        ErrorCode.GeneralError,
                                        error,
                                    ),
                                );
                            });
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
