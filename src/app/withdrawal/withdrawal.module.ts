import { Module } from '@nestjs/common';
import { AuthModule } from '../common/auth/auth.module';
import { UserModule } from '../user/user.module';
import { SoapModule } from '../soap/soap.module';
import { OrderService } from '../order/order.service';
import { ManifestService } from '../manifest/manifest.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Withdrawal } from './withdrawal.entity';
import { WithdrawalRepository } from './withdrawal.repository';
import { WithdrawalController } from './withdrawal.controller';
import { WithdrawalService } from './withdrawal.service';
import { AdmissionService } from '../admission/admission.service';
import { FulfillmentService } from '../fulfillment/fulfillment.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Withdrawal, WithdrawalRepository]),
        AuthModule,
        UserModule,
        SoapModule,
    ],
    controllers: [WithdrawalController],
    providers: [
        WithdrawalService,
        OrderService,
        ManifestService,
        AdmissionService,
        FulfillmentService,
    ],
    exports: [WithdrawalService],
})
export class WithdrawalModule {}
