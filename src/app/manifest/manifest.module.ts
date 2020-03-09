import { Module, HttpModule, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ManifestController } from './manifest.controller';
import { ManifestService } from './manifest.service';
import { UserModule } from '../user/user.module';
import { Manifest } from './manifest.entity';
import { ManifestRepository } from './manifest.repository';
import { AuthModule } from '../common/auth/auth.module';
import { OrderModule } from '../order/order.module';

@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([Manifest, ManifestRepository]),
        AuthModule,
        UserModule,
        forwardRef(() => OrderModule),
    ],
    controllers: [ManifestController],
    providers: [ManifestService],
    exports: [ManifestService],
})
export class ManifestModule {}
