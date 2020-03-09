import { Module, HttpModule, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderController } from './oder.controller';
import { OrderService } from './order.service';
import { UserModule } from '../user/user.module';
import { Order } from './order.entity';
import { OrderRepository } from './order.repository';
import { AuthModule } from '../common/auth/auth.module';
import { Manifest } from '../manifest/manifest.entity';
import { ManifestRepository } from '../manifest/manifest.repository';
import { ConfigService } from '../common/config/config.service';
import { Admission } from '../admission/admission.entity';
import { AdmissionRepository } from '../admission/admission.repository';
import { AdmissionModule } from '../admission/admission.module';
import { ManifestModule } from '../manifest/manifest.module';
import { FulfillmentModule } from '../fulfillment/fulfillment.module';
import { SoapModule } from '../soap/soap.module';

@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([Order, OrderRepository]),
        AuthModule,
        UserModule,
        forwardRef(() => AdmissionModule),
    ],
    controllers: [OrderController],
    providers: [
        OrderService,
        ConfigService,
    ],
    exports: [OrderService],
})
export class OrderModule {}
