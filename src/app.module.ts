import { Module, HttpModule } from '@nestjs/common';
import { ConfigService } from './app/common/config/config.service';
//
import { UserModule } from './app/user/user.module';
import { CarrierModule } from './app/carrier-service/carrier-service.module';
import { SoapModule } from './app/soap/soap.module';

@Module({
  imports: [
    HttpModule,
    UserModule,
    CarrierModule,
    SoapModule
  ],
  controllers: [],
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(),
    },
  ],
})
export class AppModule { }
