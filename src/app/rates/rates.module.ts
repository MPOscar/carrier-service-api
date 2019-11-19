import { Module } from "@nestjs/common";
import { ConfigService } from "../common/config/config.service";
import { RatesService } from "./rates.service";

@Module({
    imports: [  
    ],
    controllers: [],
    providers: [
        RatesService,
        ConfigService
    ],
    exports: [
        RatesService,
    ],
})
export class RatesModule { }