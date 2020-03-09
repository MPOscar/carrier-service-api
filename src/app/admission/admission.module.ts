import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../common/auth/auth.module';
import { UserModule } from '../user/user.module';
import { SoapModule } from '../soap/soap.module';
import { AdmissionController } from './admission.controller';
import { AdmissionService } from './admission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admission } from './admission.entity';
import { AdmissionRepository } from './admission.repository';
import { OrderModule } from '../order/order.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Admission, AdmissionRepository]),
        AuthModule,
        UserModule,
        SoapModule,
        forwardRef(() => OrderModule),
    ],
    controllers: [AdmissionController],
    providers: [AdmissionService],
    exports: [AdmissionService],
})
export class AdmissionModule {}
