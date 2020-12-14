import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Order, FinancialStatus } from './order.entity';
import { OrderRepository } from './order.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
    ErrorResult,
    NotFoundResult,
    BadRequestResult,
    InternalServerErrorResult,
} from '../common/error-manager/errors';
import { ErrorCode } from '../common/error-manager/error-codes';
import { User } from '../user/user.entity';
import { AdmissionService } from '../admission/admission.service';
import { Admission } from '../admission/admission.entity';
import { ErrorManager } from '../common/error-manager/error-manager';
import { resolve } from 'dns';
import { FilterOrderDto } from './dto/filter-order.dto';
import { removeAccents } from '../common/lib/remove-accents'

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: OrderRepository,
        @Inject(forwardRef(() => AdmissionService))
        private readonly admissionService: AdmissionService,
    ) { }

    async create(user: User, orderDto: CreateOrderDto): Promise<Order> {
        return new Promise(
            async (
                resolve: (result: Order) => void,
                reject: (reason: ErrorResult) => void,
            ): Promise<void> => {
                this.removeAccentsFn(orderDto);

                this.orderRepository
                    .createOrder(user, orderDto)
                    .then((order: Order) => {
                        // if (order.financialStatus === FinancialStatus.PAID) {
                        //     this.admissionService
                        //         .processAdmission(order.id, user)
                        //         .then((admission: Admission) => {
                        //             console.log(
                        //                 'Admission created => ' + admission.id,
                        //             );
                        //         })
                        //         .catch((error) => {
                        //             reject(error);
                        //         });
                        // }
                        resolve(order);
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

    removeAccentsFn(obj: object) {
        for (const [key, val] of Object.entries(obj)) {
            if (val && typeof val === "object" ) {
                this.removeAccentsFn(val);
            } else if (val && typeof val === "string") {
                obj[key] = removeAccents(val);
            }
        }
        return obj;
    }

    update(id: string, orderDto: UpdateOrderDto): Promise<Order> {
        return new Promise(
            (
                resolve: (result: Order) => void,
                reject: (reason: ErrorResult) => void,
            ): void => {
                this.orderRepository
                    .getOrder(id)
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
                        this.orderRepository
                            .updateOrder(id, orderDto)
                            .then((order: Order) => {
                                resolve(order);
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

    async getOrder(id: string): Promise<Order> {
        return new Promise(
            (
                resolve: (result: Order) => void,
                reject: (reason: ErrorResult) => void,
            ): void => {
                this.orderRepository
                    .getOrder(id)
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
                        resolve(order);
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

    getOrders(user: User, filter?: FilterOrderDto): Promise<Order[]> {
        return new Promise(
            (
                resolve: (result: Order[]) => void,
                reject: (reason: ErrorResult) => void,
            ): void => {
                this.orderRepository
                    .getOrdersNoWithdrawal(user, filter)
                    .then((orders: Order[]) => {
                        resolve(orders);
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

    getOrdersNoWithdrawal(user: User): Promise<Order[]> {
        return new Promise(
            (
                resolve: (result: Order[]) => void,
                reject: (reason: ErrorResult) => void,
            ): void => {
                this.orderRepository
                    .getOrdersNoWithdrawal(user)
                    .then((orders: Order[]) => {
                        resolve(orders);
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

    getOrdersByIds(ids: string[]): Promise<Order[]> {
        return new Promise(
            (
                resolve: (result: Order[]) => void,
                reject: (reason: ErrorResult) => void,
            ): void => {
                this.orderRepository
                    .getOrdersByIds(ids)
                    .then((orders: Order[]) => {
                        resolve(orders);
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

    markOrderAsPaid(orderDto: CreateOrderDto, user: User): Promise<Order> {
        return new Promise((resolve: (result: Order) => void, reject: (reason: ErrorResult) => void): void => {
            this.orderRepository.getOrderByNumber(orderDto.order_number, user).then((order: Order) => {
                if (!order) {
                    reject(new NotFoundResult(ErrorCode.UnknownEntity, 'There is no order with the specified ID!'));
                    return;
                }
                this.orderRepository.markOrderAsPaid(order)
                    .then((orderPaid: Order) => {
                        resolve(orderPaid);
                    }).catch(error => new InternalServerErrorResult(ErrorCode.GeneralError, error));
            }).catch(error => new InternalServerErrorResult(ErrorCode.GeneralError, error));
        });
    }

    markOrderAsCancelled(orderDto: CreateOrderDto, user: User): Promise<Order> {
        return new Promise((resolve: (result: Order) => void, reject: (reason: ErrorResult) => void): void => {
            this.orderRepository.getOrderByNumber(orderDto.order_number, user).then((order: Order) => {
                if (!order) {
                    reject(new NotFoundResult(ErrorCode.UnknownEntity, 'There is no order with the specified ID!'));
                    return;
                }

                this.orderRepository.markOrderAsCancelled(order)
                    .then((orderCancelled: Order) => resolve(orderCancelled))
                    .catch(error => new InternalServerErrorResult(ErrorCode.GeneralError, error));
            }).catch(error => new InternalServerErrorResult(ErrorCode.GeneralError, error));
        });
    }

    markOrderGeneratedLabel(orderId: string): Promise<Order> {
        return new Promise((resolve: (result: Order) => void, reject: (reason: ErrorResult) => void): void => {
            this.orderRepository.getOrder(orderId).then((order: Order) => {
                if (!order) {
                    reject(new NotFoundResult(ErrorCode.UnknownEntity, 'There is no order with the specified ID!'));
                    return;
                }
                this.orderRepository.markOrderGeneratedLabel(order)
                    .then((updatedOrder: Order) => {
                        resolve(updatedOrder);
                    }).catch(error => new InternalServerErrorResult(ErrorCode.GeneralError, error));
            }).catch(error => new InternalServerErrorResult(ErrorCode.GeneralError, error));
        });
    }

    delete(id: string): Promise<Order> {
        return new Promise(
            (
                resolve: (result: Order) => void,
                reject: (reason: ErrorResult) => void,
            ): void => {
                this.orderRepository
                    .getOrder(id)
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
                        this.orderRepository
                            .remove(order)
                            .then((order: Order) => {
                                if (!order) {
                                    reject(
                                        new BadRequestResult(
                                            ErrorCode.UnknownError,
                                            'It can not be eliminated!',
                                        ),
                                    );
                                    return;
                                }
                                resolve(order);
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
