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
    Req,
    Response,
    Query,
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
import { UserService } from '../user/user.service';
import * as express from 'express';
import { SoapService } from '../soap/soap.service';
import { ManifestService } from '../manifest/manifest.service';
import { ManifestDto } from '../manifest/dto/create-manifest.dto';
import { AdmissionResponseDto } from '../admission/dto/admission-response.dto';
import { plainToClass } from 'class-transformer';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Controller('webhook')
@UseGuards(AuthGuard())
export class OrderController {
    constructor(
        private userService: UserService,
        private orderService: OrderService,
        private soapService: SoapService,
        private manifestService: ManifestService,
    ) {}

    @Post('orders-create')
    async create(@Req() request: Request, @Body() order: CreateOrderDto) {
        console.log('ORDER =>', order);
        let shop: any = request.headers['x-shopify-shop-domain'];
        this.userService.findUserByShop(shop).then((user: User) => {
            return this.orderService
                .create(user, order)
                .then((order: Order) => {
                    return this.getIOrder(order);
                })
                .catch((error: ErrorResult) => {
                    return ErrorManager.manageErrorResult(error);
                });
        });
    }

    @Post('uninstalled-app')
    async uninstalledApp(
        @Req() request: Request,
        @Response() res: express.Response,
        @Body() order: CreateOrderDto,
    ) {
        let shop: any = request.headers['x-shopify-shop-domain'];
        console.log(shop);
        this.userService.findUserByShop(shop).then((user: User) => {
            user.shopUrl = user.shopUrl + user.id;
            user.isDeleted = true;
            this.userService.delete(user.id).then((user: User) => {
                console.log(user);
                res.status(200).send({
                    data: {
                        user: user,
                    },
                });
            });
        });
    }

    @Put('orders:id')
    @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
    async update(@Param('id') id: string, @Body() order: UpdateOrderDto) {
        return this.orderService
            .update(id, order)
            .then((order: Order) => {
                return this.getIOrder(order);
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });
    }

    @Get('orders:id')
    async getOrder(@Param('id') id: string) {
        return this.orderService
            .getOrder(id)
            .then((order: Order) => {
                return this.getIOrder(order);
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });
    }

    @Get('orders')
    async getOrders(@GetUser() user: User) {
        return this.orderService
            .getOrders(user)
            .then((orders: Order[]) => {
                return orders.map((order: Order) => {
                    return this.getIOrder(order);
                });
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });
    }

    @Delete('orders:id')
    async delete(@Param('id') id: string) {
        return this.orderService
            .delete(id)
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
        };
    }
}
