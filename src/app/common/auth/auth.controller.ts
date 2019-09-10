import { Controller, Post, Body, UsePipes } from '@nestjs/common';

import { AuthService } from './auth.service';
import { ILogin } from './interfaces/login.interface';
import { LoginDto } from './dto/login.dto';
import { ValidationPipe } from '../pipes/validation.pipe';
import { ErrorResult } from '../error-manager/errors';
import { ErrorManager } from '../error-manager/error-manager';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @UsePipes(new ValidationPipe())
    signIn(@Body() loginDto: LoginDto) {
        const shop: string = loginDto.shop;
        const hmac: string = loginDto.queryParams.hmac;
        const timestamp: string = loginDto.queryParams.timestamp;
        return this.authService.signIn(hmac, shop, timestamp)
            .then((result: ILogin) => {
                return result;
            })
            /*.catch((error: ErrorResult) => {
                return ErrorManager.manageErrorResult(error);
            });*/
    }
}
