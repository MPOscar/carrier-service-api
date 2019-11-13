import { Module } from '@nestjs/common';
import { AuthModule } from '../common/auth/auth.module';
import { UserModule } from '../user/user.module';
import { SoapModule } from '../soap/soap.module';
import { AdmissionController } from './admission.controller';
import { OrderService } from '../order/order.service';
import { ManifestService } from '../manifest/manifest.service';
import { AdmissionService } from './admission.service';

@Module({
    imports: [AuthModule, UserModule, SoapModule],
    controllers: [AdmissionController],
    providers: [OrderService, ManifestService, AdmissionService],
    exports: [AdmissionService],
})
export class AdmissionModule {}
