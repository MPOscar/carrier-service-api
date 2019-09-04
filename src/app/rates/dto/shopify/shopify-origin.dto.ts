import { IsString, IsEmail } from "class-validator";

export class ShopifyOriginDto {
    @IsString()
    readonly country: string;

    @IsString()
    readonly postal_code: string;

    @IsString()
    readonly province: string;

    @IsString()
    readonly city: string;

    @IsString()
    readonly name: string;

    @IsString()
    readonly address1: string;

    @IsString()
    readonly address2: string;

    @IsString()
    readonly address3: string;

    @IsString()
    readonly phone: string;

    @IsString()
    readonly fax: string;

    @IsEmail()
    readonly email: string;

    @IsString()
    readonly address_type: string;

    @IsString()
    readonly company_name: string;
}