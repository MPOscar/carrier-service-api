import { Module, Logger } from '@nestjs/common';
import { SoapService } from './soap.service';
import { ConfigService } from '../common/config/config.service';

const configService = new ConfigService();

@Module({
    imports: [],
    controllers: [],
    providers: [SoapService, ConfigService, Logger],
    exports: [SoapService],
})
export class SoapModule {}
