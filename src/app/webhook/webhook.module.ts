import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { UserModule } from '../user/user.module';
import { OrderModule } from '../order/order.module';

@Module({
    imports: [UserModule, OrderModule],
    controllers: [WebhookController],
    providers: [],
    exports: [],
})
export class WebhookModule {}
