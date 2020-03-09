import { NotFoundResult } from './../common/error-manager/errors';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
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
import { OrderService } from '../order/order.service';
import { OrderIdDto } from './dto/order-id.dto';

@Injectable()
export class AdmissionService {
    constructor(
        private readonly soapService: SoapService,
        private readonly admissionRepository: AdmissionRepository,
        @Inject(forwardRef(() => OrderService))
        private readonly orderService: OrderService,
    ) {}

    async processAdmission(orderId: string, user: User): Promise<Admission> {
        return new Promise(
            (
                resolve: (result: Admission) => void,
                reject: (reason: ErrorResult) => void,
            ): void => {
                this.orderService
                    .getOrder(orderId)
                    .then((order: Order) => {
                        if (!order) {
                            reject(
                                new NotFoundResult(
                                    ErrorCode.UnknownEntity,
                                    'There is no order with the specified ID!',
                                ),
                            );
                            return;
                        }

                        this.soapService
                            .processAdmission(order, user)
                            .then((resp: AdmissionResponseDto) => {
                                this.admissionRepository
                                    .getAdmissionByOrderId(order.id)
                                    .then((admission: Admission) => {
                                        if (!admission) {
                                            this.admissionRepository
                                                .createAdmission(resp, order)
                                                .then(
                                                    (admission: Admission) => {
                                                        resolve(admission);
                                                    },
                                                )
                                                .catch(error => {
                                                    reject(
                                                        new InternalServerErrorResult(
                                                            ErrorCode.GeneralError,
                                                            error,
                                                        ),
                                                    );
                                                });
                                        } else {
                                            this.admissionRepository
                                                .updateAdmission(
                                                    resp,
                                                    admission,
                                                )
                                                .then(
                                                    (admission: Admission) => {
                                                        resolve(admission);
                                                    },
                                                )
                                                .catch(error => {
                                                    reject(
                                                        new InternalServerErrorResult(
                                                            ErrorCode.GeneralError,
                                                            error,
                                                        ),
                                                    );
                                                });
                                        }
                                    })
                                    .catch(error => {
                                        reject(error);
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
