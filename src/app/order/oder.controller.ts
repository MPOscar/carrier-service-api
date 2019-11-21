import {
    Controller,
    Get,
    Body,
    UseGuards,
    Put,
    Param,
    Delete,
    UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { OrderService } from './order.service';
import { IOrder } from './interfaces/order.interface';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { GetUser } from '../common/decorator/user.decorator';
import { ErrorResult } from '../common/error-manager/errors';
import { ErrorManager } from '../common/error-manager/error-manager';
import { Order } from './order.entity';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { SoapService } from '../soap/soap.service';
import { ManifestService } from '../manifest/manifest.service';

@Controller('orders')
@UseGuards(AuthGuard())
export class OrderController {
    constructor(private orderService: OrderService) {}

    @Put(':id')
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

    @Get(':id')
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

    @Get()
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

    @Delete(':id')
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
            admission: order.admission,
        };
    }
}
