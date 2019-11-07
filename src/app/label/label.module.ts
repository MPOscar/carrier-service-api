import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LabelController } from './label.controller';
import { LabelService } from './label.service';
import { UserModule } from '../user/user.module';
import { Label } from './label.entity';
import { LabelRepository } from './label.repository';
import { AuthModule } from '../common/auth/auth.module';
import { ConfigService } from '../common/config/config.service';
import { ManifestService } from '../manifest/manifest.service';
import { ManifestModule } from '../manifest/manifest.module';
import { GeoResService } from '../geocoder/geores.service';
@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([Label, LabelRepository]),
        AuthModule,
        UserModule,
        ManifestModule,
    ],
    controllers: [LabelController],
    providers: [LabelService, ConfigService, GeoResService],
    exports: [LabelService],
})
export class LabelModule {}
