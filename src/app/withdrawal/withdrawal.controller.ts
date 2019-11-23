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
                return this.getIWithdrawal(withdrawal);
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

    getIWithdrawal(withdrawal: Withdrawal): IWithdrawal {
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
            orders: withdrawal.orders,
        };
    }
}
