import { Injectable } from '@nestjs/common';
import { Order } from '../order/order.entity';
import { User } from '../user/user.entity';
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

@Injectable()
export class WithdrawalService {
    constructor(
        private readonly soapService: SoapService,
        private readonly withdrawalRepository: WithdrawalRepository,
        private readonly orderService: OrderService,
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
                            .getOrdersNoWithdrawal()
                            .then((orders: Order[]) => {
                                this.withdrawalRepository
                                    .createWithdrawal(resp, orders)
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
}
