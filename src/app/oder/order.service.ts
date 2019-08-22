import { Injectable, HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';

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
import { FilterOrderDto } from './dto/filter-carrier-service.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class OrderService {
    constructor(
        //@InjectRepository(Order)  
        private readonly httpService: HttpService,
        private readonly OrderRepository: OrderRepository,
        private readonly userService: UserService,
    ) { }

    async create(OrderDto: CreateOrderDto): Promise<Order> {
        return new Promise((resolve: (result: Order) => void, reject: (reason: ErrorResult) => void): void => {

            this.OrderRepository.createOrder(OrderDto).then((Order: Order) => {
                resolve(Order);
                /*this.userService.create(Order.id).then((user: User) => {
                }).catch((error) => {
                    reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
                });*/
            }).catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });

        });
    }

    getQuotes() {
        return this.httpService.get('http://quotesondesign.com/wp-json/posts')
            .pipe(
                map(response => response.data)
            );
    }

    getAcccesToken(accessTokenRequestUrl: string, accessTokenPayload: any) {
        return this.httpService.post(accessTokenRequestUrl, accessTokenPayload)
            .pipe(
                map(response => response.data)
            );
    }

    update(id: string, OrderDto: UpdateOrderDto): Promise<Order> {
        return new Promise((resolve: (result: Order) => void, reject: (reason: ErrorResult) => void): void => {
            this.OrderRepository.getOrder(id).then((Order: Order) => {
                if (!Order) {
                    reject(new NotFoundResult(ErrorCode.UnknownEntity, 'There is no Order with the specified ID!'));
                    return;
                }
                this.OrderRepository.updateOrder(id, OrderDto).then((Order: Order) => {
                    resolve(Order);
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
            this.OrderRepository.getOrder(id).then((Order: Order) => {
                if (!Order) {
                    reject(new NotFoundResult(ErrorCode.UnknownEntity, 'There is no Order with the specified ID!'));
                    return;
                }
                resolve(Order);
            }).catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });
        });
    }

    getCompanies(user: User, filter: FilterOrderDto): Promise<Order[]> {
        return new Promise((resolve: (result: Order[]) => void, reject: (reason: ErrorResult) => void): void => {
            this.OrderRepository.getCompanies(user, filter).then((companies: Order[]) => {
                resolve(companies);
            }).catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });
        });
    }

    delete(id: string): Promise<Order> {
        return new Promise((resolve: (result: Order) => void, reject: (reason: ErrorResult) => void): void => {
            this.OrderRepository.getOrder(id).then((Order: Order) => {
                if (!Order) {
                    reject(new NotFoundResult(ErrorCode.UnknownEntity, 'There is no Order with the specified ID!'));
                    return;
                }
                this.OrderRepository.remove(Order).then((Order: Order) => {
                    if (!Order) {
                        reject(new BadRequestResult(ErrorCode.UnknownError, 'It can not be eliminated!'));
                        return;
                    }
                    resolve(Order);
                });
            }).catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });
        });
    }
}
