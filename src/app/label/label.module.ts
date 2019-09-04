import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LabelController } from './label.controller';
import { LabelService } from './label.service';
import { UserModule } from '../user/user.module';
import { Label } from './label.entity';
import { LabelRepository } from './label.repository';
import { AuthModule } from '../common/auth/auth.module';

@Module({
    imports: [  
        HttpModule,     
        TypeOrmModule.forFeature([Label, LabelRepository]),
        AuthModule,
        UserModule,
    ],
    controllers: [LabelController],
    providers: [
        LabelService,
    ],
    exports: [
        LabelService,
    ],
})
export class LabelModule { }
