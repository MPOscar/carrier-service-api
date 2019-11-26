import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LabelController } from './label.controller';
import { LabelService } from './label.service';
import { UserModule } from '../user/user.module';
import { Label } from './label.entity';
import { LabelRepository } from './label.repository';
import { AuthModule } from '../common/auth/auth.module';
import { ConfigService } from '../common/config/config.service';
import { ManifestModule } from '../manifest/manifest.module';
import { OrderService } from '../order/order.service';
import { AdmissionService } from '../admission/admission.service';
import { SoapService } from '../soap/soap.service';
@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([Label, LabelRepository]),
        AuthModule,
        UserModule,
        ManifestModule,
    ],
    controllers: [LabelController],
    providers: [
        LabelService,
        ConfigService,
        OrderService,
        AdmissionService,
        SoapService,
    ],
    exports: [LabelService],
})
export class LabelModule {}
