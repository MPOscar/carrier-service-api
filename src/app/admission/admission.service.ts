import { NotFoundResult } from './../common/error-manager/errors';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Order, FinancialStatus } from '../order/order.entity';
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
import { OrderService } from '../order/order.service';
import { IdsDto } from './dto/ids.dto';
import { CreateAdmissionDto } from './dto/create-admission.dto';

@Injectable()
export class AdmissionService {
    constructor(
        private readonly soapService: SoapService,
        private readonly admissionRepository: AdmissionRepository,
        @Inject(forwardRef(() => OrderService))
        private readonly orderService: OrderService,
    ) { }

    async create(createAdmissionDto: CreateAdmissionDto, order: Order): Promise<Admission> {
        return new Promise((resolve: (result: Admission) => void, reject: (reason: ErrorResult) => void): void => {
            this.admissionRepository.createAd(createAdmissionDto, order)
            .then((createdAdmission: Admission) => resolve(createdAdmission))
            .catch(error => reject(new InternalServerErrorResult(ErrorCode.GeneralError, error)));
        });
    }

    async processAdmission(orderId: string, user: User): Promise<Admission> {
        return new Promise((resolve: (result: Admission) => void, reject: (reason: ErrorResult) => void): void => {
            this.orderService.getOrder(orderId).then((order: Order) => {
                if (!order) {
                    reject(new NotFoundResult(ErrorCode.UnknownEntity, 'There is no order with the specified ID!'));
                    return;
                }

                this.soapService.processAdmission(order, user).then((resp: AdmissionResponseDto) => {
                    this.admissionRepository.getAdmissionByOrderId(order.id).then((admission: Admission) => {
                        if (!admission) {
                            this.admissionRepository.createAdmission(resp, order)
                                .then((createdAdmission: Admission) => resolve(createdAdmission))
                                .catch(error => reject(new InternalServerErrorResult(ErrorCode.GeneralError, error)));
                        } else {
                            this.admissionRepository.updateAdmission(resp, admission)
                                .then((updatedAdmission: Admission) => resolve(updatedAdmission))
                                .catch(error => reject(new InternalServerErrorResult(ErrorCode.GeneralError, error)));
                        }
                    }).catch(error => reject(new InternalServerErrorResult(ErrorCode.GeneralError, error)));
                }).catch(error => reject(error));
            }).catch(error => reject(error));
        });
    }

    processBulkAdmission(user: User, ids: IdsDto): Promise<Admission[]> {
        return new Promise((resolve: (result: Admission[]) => void, reject: (reason: ErrorResult) => void): void => {
            this.orderService.getOrdersByIds(ids.ids).then((orders: Order[]) => {
                if (orders.length === 0) {
                    reject(new NotFoundResult(ErrorCode.UnknownEntity, 'There is no orders with the specified IDs!'));
                    return;
                }
                this.createBulkAdmission(user, orders).then((updatedAdmissions) => {
                    resolve(updatedAdmissions);
                }).catch((error) => {
                    reject(error);
                });
            }).catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });
        });
    }

    createBulkAdmission(user: User, orders: Order[]) {
        return Promise.all(orders.map((order) => {
            return new Promise((resolve: (result: Admission) => void, reject: (reason: ErrorResult) => void): void => {
                if (order.financialStatus === FinancialStatus.PAID) {
                    this.soapService.processAdmission(order, user).then((resp: AdmissionResponseDto) => {
                        this.admissionRepository.getAdmissionByOrderId(order.id).then((admission: Admission) => {
                            if (!admission) {
                                this.admissionRepository.createAdmission(resp, order)
                                    .then((createdAdmission: Admission) => resolve(createdAdmission))
                                    .catch(error => reject(new InternalServerErrorResult(ErrorCode.GeneralError, error)));
                            } else {
                                this.admissionRepository.updateAdmission(resp, admission)
                                    .then((updatedAdmission: Admission) => resolve(updatedAdmission))
                                    .catch(error => reject(new InternalServerErrorResult(ErrorCode.GeneralError, error)));
                            }
                        }).catch(error => reject(new InternalServerErrorResult(ErrorCode.GeneralError, error)));
                    }).catch(error => reject(error));
                }
            });
        }));
    }

    updateAdmissionShippingNumber(orderId: string, shippingNumber): Promise<Admission> {
        return new Promise(
            (
                resolve: (result: Admission) => void,
                reject: (reason: ErrorResult) => void,
            ): void => {
                this.admissionRepository.getAdmissionByOrderId(orderId).then((admission: Admission) => {
                    if (!admission) {
                        reject(new NotFoundResult(ErrorCode.UnknownEntity, 'There is no admission with the specified ID!'));
                        return;
                    }

                    this.admissionRepository.updateShippingNumber(admission, shippingNumber).then((updatedAdmission: Admission) => {
                        resolve(updatedAdmission);
                    }).catch(error => reject(new InternalServerErrorResult(ErrorCode.GeneralError, error)));
                }).catch(error => reject(new InternalServerErrorResult(ErrorCode.GeneralError, error)));
            },
        );
    }
}
