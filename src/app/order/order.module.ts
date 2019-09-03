import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderController } from './oder.controller';
import { OrderService } from './order.service';
import { UserModule } from '../user/user.module';
import { Order } from './order.entity';
import { OrderRepository } from './order.repository';
import { AuthModule } from '../common/auth/auth.module';

@Module({
    imports: [  
        HttpModule,     
        TypeOrmModule.forFeature([Order, OrderRepository]),
        AuthModule,
        UserModule,
    ],
    controllers: [OrderController],
    providers: [
        OrderService,
    ],
    exports: [
        OrderService,
    ],
})
export class OrderModule { }
