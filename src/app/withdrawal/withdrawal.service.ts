import { User } from './../user/user.entity';
import { Injectable } from '@nestjs/common';
import { Order } from '../order/order.entity';
import {
    ErrorResult,
    InternalServerErrorResult,
    NotFoundResult,
} from '../common/error-manager/errors';
import { SoapService } from '../soap/soap.service';
import { ErrorCode } from '../common/error-manager/error-codes';
import { WithdrawalRepository } from './withdrawal.repository';
import { Withdrawal } from './withdrawal.entity';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { WithdrawalDto } from './dto/withdrawal.dto';
import { OrderService } from '../order/order.service';
import { FulfillmentService } from '../fulfillment/fulfillment.service';

@Injectable()
export class WithdrawalService {
    constructor(
        private readonly soapService: SoapService,
        private readonly withdrawalRepository: WithdrawalRepository,
        private readonly orderService: OrderService,
        private readonly fulfillmentService: FulfillmentService,
    ) {}

    async create(
        user: User,
        createWithrawalDto: CreateWithdrawalDto,
    ): Promise<Withdrawal> {
        return new Promise(
            (
                resolve: (result: Withdrawal) => void,
                reject: (reason: ErrorResult) => void,
            ): void => {
                this.soapService
                    .processWithdrawal(user, createWithrawalDto)
                    .then((resp: WithdrawalDto) => {
                        this.orderService
                            .getOrdersByIds(createWithrawalDto.orderIds)
                            .then(async (orders: Order[]) => {
                                for (let i = 0; i < orders.length; i++) {
                                    const order = orders[i];

                                    try {
                                        const fulfillment = await this.fulfillmentService.createFulfillment(
                                            order,
                                            user,
                                            order.admission
                                                .numeroEnvio,
                                        );
                                    } catch (error) {
                                        if (
                                            error.statusCode === 422 &&
                                            error.response.body.errors
                                                .base[0] ===
                                                'Line items are already fulfilled'
                                        ) {
                                            this.orderService
                                                .delete(order.id)
                                                .then((order: Order) => {
                                                    orders.splice(i, 1);
                                                    reject(error);
                                                })
                                                .catch(error => {
                                                    reject(error);
                                                });
                                        }
                                        reject(error);
                                    }
                                }
                                if (orders.length > 0) {
                                    this.withdrawalRepository
                                        .createWithdrawal(
                                            resp,
                                            orders,
                                            createWithrawalDto,
                                        )
                                        .then((withdrawal: Withdrawal) => {
                                            resolve(withdrawal);
                                        })
                                        .catch(error => {
                                            reject(
                                                new InternalServerErrorResult(
                                                    ErrorCode.GeneralError,
                                                    error,
                                                ),
                                            );
                                        });
                                } else {
                                    resolve(null);
                                }
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

    async getWithdrawal(id: string): Promise<Withdrawal> {
        return new Promise(
            (
                resolve: (result: Withdrawal) => void,
                reject: (reason: ErrorResult) => void,
            ): void => {
                this.withdrawalRepository
                    .getWithdrawal(id)
                    .then((withdrawal: Withdrawal) => {
                        if (!withdrawal) {
                            reject(
                                new NotFoundResult(
                                    ErrorCode.UnknownEntity,
                                    'There is no Withdrawal with the specified ID!',
                                ),
                            );
                            return;
                        }
                        resolve(withdrawal);
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

    getWithdrawals(user: User): Promise<Withdrawal[]> {
        return new Promise(
            (
                resolve: (result: Withdrawal[]) => void,
                reject: (reason: ErrorResult) => void,
            ): void => {
                this.withdrawalRepository
                    .getWithdrawals(user)
                    .then((withdrawals: Withdrawal[]) => {
                        resolve(withdrawals);
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
