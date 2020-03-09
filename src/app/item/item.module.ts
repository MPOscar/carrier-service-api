import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { UserModule } from '../user/user.module';
import { Item } from './item.entity';
import { ItemRepository } from './item.repository';
import { AuthModule } from '../common/auth/auth.module';

@Module({
    imports: [
        HttpModule,
        TypeOrmModule.forFeature([Item, ItemRepository]),
        AuthModule,
        UserModule,
    ],
    controllers: [ItemController],
    providers: [
        ItemService,
    ],
    exports: [
        ItemService,
    ],
})
export class ItemModule { }
