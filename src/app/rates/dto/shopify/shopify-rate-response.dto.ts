import { IsString } from "class-validator";

export class ShopifyRateResponseDto {
    @IsString()
    service_name: string;

    @IsString()
    service_code: string;

    @IsString()
    total_price: string;

    @IsString()
    description?: string;

    @IsString()
    currency: string;

    @IsString()
    min_delivery_date: string;

    @IsString()
    max_delivery_date: string;
}