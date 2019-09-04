import { Module, HttpModule } from '@nestjs/common';
import { ConfigService } from './app/common/config/config.service';
//
import { UserModule } from './app/user/user.module';
import { CarrierModule } from './app/carrier-service/carrier-service.module';
<<<<<<< HEAD
import { OrderModule } from './app/oder/order.module';
import { SoapModule } from './app/soap/soap.module';
=======
import { ItemModule } from './app/item/item.module';
import { LabelModule } from './app/label/label.module';
import { OrderModule } from './app/order/order.module';
>>>>>>> e2fd8c203bba06eb4fa0b0d49f893c7181ad882c


@Module({
  imports: [
    HttpModule,
    UserModule,
    CarrierModule,
<<<<<<< HEAD
    SoapModule,
    OrderModule
=======
    ItemModule,
    LabelModule,
    OrderModule    
>>>>>>> e2fd8c203bba06eb4fa0b0d49f893c7181ad882c
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
