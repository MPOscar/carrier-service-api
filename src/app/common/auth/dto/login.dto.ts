import { IsString, IsEmail } from 'class-validator';

export class LoginDto {

    @IsString()
    readonly hmac: string;

    @IsString()
    readonly shop: string;

    readonly timestamp: any;

}
