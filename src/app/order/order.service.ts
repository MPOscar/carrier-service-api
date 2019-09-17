import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Order } from './order.entity';
import { OrderRepository } from './order.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ErrorResult, NotFoundResult, BadRequestResult, InternalServerErrorResult } from '../common/error-manager/errors';
import { ErrorCode } from '../common/error-manager/error-codes';
import { User } from '../user/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: OrderRepository,
        private readonly userService: UserService,
    ) { }

    async create(user: User, orderDto: CreateOrderDto): Promise<Order> {
        return new Promise((resolve: (result: Order) => void, reject: (reason: ErrorResult) => void): void => {
            this.orderRepository.createOrder(user, orderDto).then((order: Order) => {
                resolve(order);               
            }).catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });
        });
    }

    update(id: string, orderDto: UpdateOrderDto): Promise<Order> {
        return new Promise((resolve: (result: Order) => void, reject: (reason: ErrorResult) => void): void => {
            this.orderRepository.getOrder(id).then((order: Order) => {
                if (!order) {
                    reject(new NotFoundResult(ErrorCode.UnknownEntity, 'There is no order with the specified ID!'));
                    return;
                }
                this.orderRepository.updateOrder(id, orderDto).then((order: Order) => {
                    resolve(order);
                }).catch((error) => {
                    reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
                });
            }).catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });
        });
    }

    async getOrder(id: string): Promise<Order> {
        return new Promise((resolve: (result: Order) => void, reject: (reason: ErrorResult) => void): void => {
            this.orderRepository.getOrder(id).then((order: Order) => {
                if (!order) {
                    reject(new NotFoundResult(ErrorCode.UnknownEntity, 'There is no order with the specified ID!'));
                    return;
                }
                resolve(order);
            }).catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });
        });
    }

    getOrders(user: User): Promise<Order[]> {
        return new Promise((resolve: (result: Order[]) => void, reject: (reason: ErrorResult) => void): void => {
            this.orderRepository.getOrders(user).then((companies: Order[]) => {
                resolve(companies);
            }).catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });
        });
    }

    delete(id: string): Promise<Order> {
        return new Promise((resolve: (result: Order) => void, reject: (reason: ErrorResult) => void): void => {
            this.orderRepository.getOrder(id).then((order: Order) => {
                if (!order) {
                    reject(new NotFoundResult(ErrorCode.UnknownEntity, 'There is no order with the specified ID!'));
                    return;
                }
                this.orderRepository.remove(order).then((order: Order) => {
                    if (!order) {
                        reject(new BadRequestResult(ErrorCode.UnknownError, 'It can not be eliminated!'));
                        return;
                    }
                    resolve(order);
                });
            }).catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });
        });
    }
}
