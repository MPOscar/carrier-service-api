import { Module, HttpModule } from '@nestjs/common';
import { ConfigService } from './app/common/config/config.service';
//
import { UserModule } from './app/user/user.module';
import { CarrierModule } from './app/carrier-service/carrier-service.module';
import { SoapModule } from './app/soap/soap.module';
import { ItemModule } from './app/item/item.module';
import { LabelModule } from './app/label/label.module';
import { OrderModule } from './app/order/order.module';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { HttpErrorFilter } from './app/common/shared/http-error.filter';
import { LoggingInterceptor } from './app/common/shared/logging.interceptor';
import { ManifestModule } from './app/manifest/manifest.module';
import { GeoResModule } from './app/geocoder/geores.module';

@Module({
    imports: [
        HttpModule,
        UserModule,
        CarrierModule,
        SoapModule,
        OrderModule,
        ItemModule,
        LabelModule,
        OrderModule,
        ManifestModule,
        LabelModule,
        GeoResModule,
    ],
    controllers: [],
    providers: [
        {
            provide: ConfigService,
            useValue: new ConfigService(),
        },
        {
            provide: APP_FILTER,
            useClass: HttpErrorFilter,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggingInterceptor,
        },
    ],
})
export class AppModule {}
