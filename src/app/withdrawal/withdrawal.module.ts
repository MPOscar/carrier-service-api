import { Module } from '@nestjs/common';
import { AuthModule } from '../common/auth/auth.module';
import { UserModule } from '../user/user.module';
import { SoapModule } from '../soap/soap.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Withdrawal } from './withdrawal.entity';
import { WithdrawalRepository } from './withdrawal.repository';
import { WithdrawalController } from './withdrawal.controller';
import { WithdrawalService } from './withdrawal.service';
import { OrderModule } from '../order/order.module';
import { FulfillmentModule } from '../fulfillment/fulfillment.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Withdrawal, WithdrawalRepository]),
        AuthModule,
        UserModule,
        SoapModule,
        OrderModule,
        FulfillmentModule,
    ],
    controllers: [WithdrawalController],
    providers: [
        WithdrawalService,
    ],
    exports: [WithdrawalService],
})
export class WithdrawalModule {}
