import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Put,
    Param,
    Delete,
    UsePipes,
    Req
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { IOrder } from './interfaces/order.interface';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { RolesGuard } from '../common/auth/guards/roles.guard';
import { Roles } from '../common/decorator/roles.decorator';
import { GetUser } from '../common/decorator/user.decorator';
import { ErrorResult } from '../common/error-manager/errors';
import { ErrorManager } from '../common/error-manager/error-manager';
import { Order } from './order.entity';
import { User } from '../user/user.entity';

@Controller('webhook')
//@UseGuards(AuthGuard(), RolesGuard)
export class OrderController {

    constructor(private readonly orderService: OrderService) { }

    @Post('orders-create')
    async create(@Req() request: Request, @Body() order: CreateOrderDto) {
        console.log(request.headers['x-shopify-shop-domain']);
        return this.orderService.create(order)
            .then((order: Order) => {
                return this.getIOrder(order);
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });
    }

    @Put(':id')
    @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
    async update(@Param('id') id: string, @Body() order: UpdateOrderDto) {
        return this.orderService.update(id, order)
            .then((order: Order) => {
                return this.getIOrder(order);
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });
    }

    @Get(':id')
    async getOrder(@Param('id') id: string) {
        return this.orderService.getOrder(id)
            .then((order: Order) => {
                return this.getIOrder(order);
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });
    }

    @Get()
    async getOrders(@GetUser() user: User) {
        return this.orderService.getOrders(user)
            .then((orders: Order[]) => {
                return orders.map((order: Order) => {
                    return this.getIOrder(order);
                });
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.orderService.delete(id)
            .then((order: Order) => {
                return this.getIOrder(order);
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });
    }

    getIOrder(order: Order): IOrder {
        return {
            id: order.id,
        };
    }
}
