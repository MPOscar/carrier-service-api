import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Order } from './order.entity';
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

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: OrderRepository,
        @Inject(forwardRef(() => AdmissionService))
        private readonly admissionService: AdmissionService,
    ) {}

    async create(user: User, orderDto: CreateOrderDto): Promise<Order> {
        return new Promise(
            (
                resolve: (result: Order) => void,
                reject: (reason: ErrorResult) => void,
            ): void => {
                this.orderRepository
                    .createOrder(user, orderDto)
                    .then((order: Order) => {
                        this.admissionService
                            .processAdmission(order.id, user)
                            .then((admission: Admission) => {
                                console.log(
                                    'Admission created => ' + admission.id,
                                );
                            })
                            .catch((error) => {
                                console.log("AError => " + JSON.stringify(error));
                                return error;//ErrorManager.manageErrorResult(error);
                            });
                        resolve(order);
                    })
                    .catch(error => {
                        console.log("OError => " + error);
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

    getOrders(user: User): Promise<Order[]> {
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
                        console.log("GetOError => " + error);
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
