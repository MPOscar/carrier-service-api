import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { AuthModule } from '../common/auth/auth.module';
import { CarrierController } from '../carrier-service/carrier-service.controller';
import { CarrierService } from '../carrier-service/carrier-service.service';
import { Carrier } from 'dist/src/app/carrier-service/carrier-service.entity';
import { CarrierRepository } from '../carrier-service/carrier-service.repository';

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
export class WebHooksModule { }
