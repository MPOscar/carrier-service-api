import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderController } from './oder.controller';
import { OrderService } from './order.service';
import { UserModule } from '../user/user.module';
import { Order } from './order.entity';
import { OrderRepository } from './order.repository';
import { AuthModule } from '../common/auth/auth.module';
import { ManifestService } from '../manifest/manifest.service';
import { FulfillmentService } from '../fulfillment/fulfillment.service';
import { SoapService } from '../soap/soap.service';
import { Manifest } from '../manifest/manifest.entity';
import { ManifestRepository } from '../manifest/manifest.repository';
import { ConfigService } from '../common/config/config.service';
import { GeoResService } from '../geocoder/geores.service';
import { Admission } from '../admission/admission.entity';
import { AdmissionRepository } from '../admission/admission.repository';
import { AdmissionModule } from '../admission/admission.module';
import { AdmissionService } from '../admission/admission.service';

@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([Order, OrderRepository]),
        TypeOrmModule.forFeature([Manifest, ManifestRepository]),
        TypeOrmModule.forFeature([Admission, AdmissionRepository]),
        AuthModule,
        UserModule,
    ],
    controllers: [OrderController],
    providers: [
        OrderService,
        ManifestService,
        FulfillmentService,
        SoapService,
        AdmissionService,
        ConfigService,
        GeoResService,
    ],
    exports: [OrderService],
})
export class OrderModule {}
