import { IsString, IsInt, IsEmail, IsUUID } from 'class-validator';

export class UpdateItemDto {
    
    @IsString()
    readonly name: string;

    sku: string;

    quantity: number;

    grams: number;

    price: number;

    vendor: string;

    requires_shipping: boolean;

    taxable: boolean;

    fulfillment_service: string;

    properties: string;

    product_id: string;

    variant_id: string;
}