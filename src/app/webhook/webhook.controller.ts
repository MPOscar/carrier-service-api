import { Controller, Post, Req, Body, Response } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { OrderService } from '../order/order.service';
import { CreateOrderDto } from '../order/dto/create-order.dto';
import { User } from '../user/user.entity';
import { Order } from '../order/order.entity';
import { ErrorResult } from '../common/error-manager/errors';
import * as express from 'express';
import { IOrder } from '../order/interfaces/order.interface';
import { Request } from 'express';
import { ErrorManager } from '../common/error-manager/error-manager';
import { GetUser } from '../common/decorator/user.decorator';

@Controller('webhook')
export class WebhookController {
    constructor(
        private userService: UserService,
        private orderService: OrderService,
    ) { }

    @Post('orders-create')
    async create(@Req() request: Request, @Body() order: CreateOrderDto) {
        const shop: any = request.headers['x-shopify-shop-domain'];

        if (order.shipping_lines[0].source === 'Correos Chile') {
            this.userService.findUserByShop(shop).then((user: User) => {
                return this.orderService
                    .create(user, order)
                    .then((createdOrder: Order) => {
                        return this.getIOrder(createdOrder);
                    })
                    .catch((error: ErrorResult) => {
                        return ErrorManager.manageErrorResult(error);
                    });
            });
        }
    }

    @Post('orders-paid')
    async createPaidOrder(@Req() request: Request, @Body() order: CreateOrderDto, @GetUser() user: User) {
        return this.orderService.markOrderAsPaid(order, user)
            .then((paidOrder: Order) => this.getIOrder(paidOrder))
            .catch((error: ErrorResult) => ErrorManager.manageErrorResult(error));
    }

    @Post('orders-cancelled')
    async cancellOrder(@Req() request: Request, @Body() order: CreateOrderDto, @GetUser() user: User) {
        return this.orderService.markOrderAsCancelled(order, user)
            .then((cancelledOrder: Order) => this.getIOrder(cancelledOrder))
            .catch((error: ErrorResult) => ErrorManager.manageErrorResult(error));
    }

    @Post('uninstalled-app')
    async uninstalledApp(
        @Req() request: Request,
        @Response() res: express.Response,
    ) {
        let shop: any = request.headers['x-shopify-shop-domain'];
        this.userService.findUserByShop(shop).then((user: User) => {
            user.shopUrl = user.shopUrl + user.id;
            user.isDeleted = true;
            this.userService.delete(user.id).then((user: User) => {
                res.status(200).send({
                    data: {
                        user: user,
                    },
                });
            });
        });
    }

    getIOrder(order: Order): IOrder {
        return {
            id: order.id,
            email: order.email,
            orderNumber: order.number,
            note: order.note,
            token: order.token,
            gateway: order.gateway,
            test: order.test,
            totalPrice: order.totalPrice,
            subtotalPrice: order.subtotalPrice,
            totalWeight: order.totalWeight,
            totalTax: order.totalTax,
            taxesIncluded: order.taxesIncluded,
            currency: order.currency,
            financialStatus: order.financialStatus,
            confirmed: order.confirmed,
            totalDiscounts: order.totalDiscounts,
            totalLineItemsPrice: order.totalLineItemsPrice,
            cartToken: order.cartToken,
            buyerAcceptsMarketing: order.buyerAcceptsMarketing,
            name: order.name,
            referringSite: order.referringSite,
            receiverName: order.receiverName,
            receiverAddress: order.receiverAddress,
            receiverContactName: order.receiverContactName,
            receiverContactPhone: order.receiverContactPhone,
            serviceCode: order.serviceCode,
            totalPieces: order.totalPieces,
            kg: order.kg,
            volumen: order.volumen,
            admissionProcessed: order.admissionProcessed,
            receiverCountry: order.receiverCountry,
            admission: order.admission,
        };
    }
}
