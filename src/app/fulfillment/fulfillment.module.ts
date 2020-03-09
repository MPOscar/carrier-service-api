import { Module } from '@nestjs/common';
import { ConfigService } from '../common/config/config.service';
import { FulfillmentService } from './fulfillment.service';

@Module({
    imports: [],
    controllers: [],
    providers: [FulfillmentService, ConfigService],
    exports: [FulfillmentService],
})
export class FulfillmentModule {}
