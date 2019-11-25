import {
    Controller,
    Post,
    UsePipes,
    ValidationPipe,
    Body,
    UseGuards,
    Get,
    Query,
    Param,
} from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { OrderService } from '../order/order.service';
import { ErrorResult } from '../common/error-manager/errors';
import { ErrorManager } from '../common/error-manager/error-manager';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { WithdrawalService } from './withdrawal.service';
import { Withdrawal } from './withdrawal.entity';
import { IWithdrawal } from './interfaces/withdrawal.interface';
import { GetUser } from '../common/decorator/user.decorator';
import { JwtAuthGuard } from '../common/auth/guards/auth.guard';
import { IOrder } from '../order/interfaces/order.interface';
import { Order } from '../order/order.entity';

@Controller('withdrawal')
@UseGuards(JwtAuthGuard)
export class WithdrawalController {
    constructor(
        private readonly userService: UserService,
        private readonly orderService: OrderService,
        private readonly withdrawalService: WithdrawalService,
    ) {}

    @Post()
    @UsePipes(new ValidationPipe())
    async processWithdrawal(
        @GetUser() user: User,
        @Body() createWithdrawalDto: CreateWithdrawalDto,
    ) {
        return this.withdrawalService
            .create(user, createWithdrawalDto)
            .then((withdrawal: Withdrawal) => {
                return withdrawal != null
                    ? this.getIWithdrawal(withdrawal)
                    : null;
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });
    }

    @Get(':id')
    async getWithdrawal(@Param('id') id: string) {
        return this.withdrawalService
            .getWithdrawal(id)
            .then((withdrawal: Withdrawal) => {
                return this.getIWithdrawal(withdrawal);
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });
    }

    @Get()
    async getWithdrawals() {
        return this.withdrawalService
            .getWithdrawals()
            .then((withdrawals: Withdrawal[]) => {
                return withdrawals.map((withdrawal: Withdrawal) => {
                    return this.getIWithdrawal(withdrawal);
                });
            })
            .catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });
    }

    getIWithdrawal(withdrawal: Withdrawal): IWithdrawal {
        let orders: IOrder[] = [];
        if (withdrawal.orders) {
            orders = withdrawal.orders.map((order: Order) => {
                return this.getIOrder(order);
            });
        }
        return {
            id: withdrawal.id,
            admissionCode: withdrawal.admissionCode,
            withdrawalCode: withdrawal.withdrawalCode,
            address: withdrawal.address,
            comuna: withdrawal.comuna,
            contact: withdrawal.contact,
            contactPhone: withdrawal.contactPhone,
            date: withdrawal.date,
            horaDesde: withdrawal.horaDesde,
            horaHasta: withdrawal.horaHasta,
            region: withdrawal.region,
            rut: withdrawal.rut,
            zip: withdrawal.zip,
            orders: orders,
        };
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
