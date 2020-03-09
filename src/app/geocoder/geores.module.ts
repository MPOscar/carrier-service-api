import { Module } from '@nestjs/common';
import { ConfigService } from '../common/config/config.service';
import { GeoResService } from './geores.service';

@Module({
    imports: [],
    controllers: [],
    providers: [GeoResService, ConfigService],
    exports: [GeoResService],
})
export class GeoResModule {}
