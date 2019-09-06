import { Injectable } from "@nestjs/common";
import { ConfigService } from "../common/config/config.service";

@Injectable()
export class RatesService {

    constructor(
        private readonly configService: ConfigService,
    ) { }

    

}