import { IsString, IsNumber, IsBoolean } from "class-validator";

export class ShopifyItemDto {
    @IsString()
    readonly name: string;

    @IsString()
    readonly sku: string;

    @IsNumber()
    readonly quantity: number;

    @IsNumber()
    readonly grams: number;

    @IsNumber()
    readonly price: number;

    @IsString()
    readonly vendor: string;

    @IsBoolean()
    readonly requires_shipping: boolean;

    @IsBoolean()
    readonly taxable: boolean;

    @IsString()
    readonly fulfillment_service: string;

    readonly properties: any;

    @IsNumber()
    readonly product_id: number;

    @IsNumber()
    readonly variant_id: number;
}