import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CarrierController } from './carrier-service.controller';
import { CarrierService } from './carrier-service.service';
import { UserModule } from '../user/user.module';
import { Carrier } from './carrier-service.entity';
import { CarrierRepository } from './carrier-service.repository';
import { AuthModule } from '../common/auth/auth.module';

@Module({
    imports: [  
        HttpModule,     
        TypeOrmModule.forFeature([Carrier, CarrierRepository]),
        AuthModule,
        UserModule,
    ],
    controllers: [CarrierController],
    providers: [
        CarrierService,
    ],
    exports: [
        CarrierService,
    ],
})
export class CarrierModule { }
