import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderController } from './oder.controller';
import { OrderService } from './order.service';
import { UserModule } from '../user/user.module';
import { Order } from './order.entity';
import { OrderRepository } from './order.repository';
import { AuthModule } from '../common/auth/auth.module';
import { SoapModule } from '../rates/rates.module';
import { ManifestService } from '../manifest/manifest.service';

@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([Order, OrderRepository]),
        AuthModule,
        UserModule,
        SoapModule,
    ],
    controllers: [OrderController],
    providers: [OrderService, ManifestService],
    exports: [OrderService],
})
export class OrderModule {}
