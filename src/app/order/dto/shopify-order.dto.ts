import { IsString, IsInt, IsEmail, IsUUID } from 'class-validator';
import { CreateUserDto } from '../../user/dto/create-user.dto';

export class ShopifyOrderDto {
    id: number;
    order_id: number;
    status: string;
    created_at: Date;
    service: string;
    updated_at: Date;
    tracking_company: string;
    shipment_status: string;
    location_id: string;
    email: string;
    destination: Destination;
    tracking_number: string;
    tracking_numbers: string[];
    tracking_url: string;
    tracking_urls: string[];
    name: string;
    line_items: Item[];
}

export class Item {
    id: number;
    variant_id: number;
    title: string;
    quantity: number;
    sku: string;
    variant_title: string;
    vendor: string;
    fulfillment_service: string;
    product_id: number;
    requires_shipping: boolean;
    taxable: boolean;
    gift_card: boolean;
    name: string;
    variant_inventory_management: string;
    properties: [];
    product_exists: boolean;
    fulfillable_quantity: number;
    grams: number;
    price: number;
    total_discount: number;
    fulfillment_status: string;
    price_set: {
        shop_money: {
            amount: number;
            currency_code: string;
        };
        presentment_money: {
            amount: number;
            currency_code: string;
        };
    };
    total_discount_set: {
        shop_money: {
            amount: number;
            currency_code: string;
        };
        presentment_money: {
            amount: number;
            currency_code: string;
        };
    };
    discount_allocations: [];
    tax_lines: [];
}

export class Destination {
    first_name: string;
    address1: string;
    phone: string;
    city: string;
    zip: string;
    province: string;
    country: string;
    last_name: string;
    address2: string;
    company: string;
    latitude: string;
    longitude: string;
    name: string;
    country_code: string;
    province_code: string;
}
