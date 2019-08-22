import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CarrierController } from './oders.controller';
import { CarrierService } from './order.service';
import { UserModule } from '../user/user.module';
import { Carrier } from './orders.entity';
import { CarrierRepository } from './order.repository';
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
export class WebHooksModule { }
