import { IsString, IsEmail } from 'class-validator';

export class LoginDto {
    shop: string;
    queryParams: QueryParams;
}

export class QueryParams {
    @IsString()
    readonly hmac: string;

    @IsString()
    readonly shop: string;

    readonly timestamp: any;
}
