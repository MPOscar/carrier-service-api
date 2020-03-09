import { Module } from '@nestjs/common';
import { SoapService } from './soap.service';
import { ConfigService } from '../common/config/config.service';
import { ManifestService } from '../manifest/manifest.service';
import { ManifestModule } from '../manifest/manifest.module';
import { GeoResService } from '../geocoder/geores.service';

const configService = new ConfigService();

@Module({
    imports: [ManifestModule],
    controllers: [],
    providers: [SoapService, ConfigService, GeoResService],
    exports: [SoapService],
})
export class SoapModule {}
