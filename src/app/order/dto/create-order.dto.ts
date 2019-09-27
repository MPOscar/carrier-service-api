import { IsString, IsInt, IsEmail, IsUUID } from 'class-validator';

export class CreateOrderDto {
    readonly order_id?: number;

    readonly email: string;

    readonly number: number;

    readonly note: null;

    readonly token: string;

    readonly gateway: string;

    readonly test: boolean;

    readonly total_price: string;

    readonly subtotal_price: string;

    readonly total_weight: number;

    readonly total_tax: string;

    readonly taxes_included: boolean;

    readonly currency: string;

    readonly financial_status: string;

    readonly confirmed: boolean;

    readonly total_discounts: string;

    readonly total_line_items_price: string;

    readonly cart_token: string;

    readonly buyer_accepts_marketing: boolean;

    readonly name: string;

    readonly referring_site: string;

    readonly closed_at: Date;

    readonly shipping_address: ShippingAddress;

    readonly shipping_lines: ShippingLines[];

    readonly line_items: LineItems[];

    //readonly custome: Customer;
}

export class ShippingAddress {
    readonly first_name: string;

    readonly address1: string;

    readonly phone: string;

    readonly city: string;

    readonly zip: string;

    readonly country: string;

    readonly name: string;

    readonly country_code: string;
}

export class ShippingLines {
    readonly id: number;

    readonly title: string;

    readonly price: string;

    readonly code: string;

    readonly source: string;

    readonly phone: string;

    readonly requested_fulfillment_service_id: string;

    readonly delivery_category: string;

    readonly carrier_identifier: string;

    readonly discounted_price: string;
}

export class LineItems {
    readonly title: string;

    readonly quantity: number;

    readonly vendor: string;

    readonly grams: number;
}

export class Customer {
    id: number;

    email: string;

    accepts_marketing: boolean;

    created_at: Date;

    updated_at: Date;

    first_name: string;

    last_name: string;

    orders_count: number;

    state: string;

    total_spent: string;

    last_order_id: number;

    note: string;

    verified_email: boolean;

    multipass_identifier: string;

    tax_exempt: boolean;

    phone: string;

    tags: string;

    last_order_name: string;

    currency: string;

    accepts_marketing_updated_at: Date;

    marketing_opt_in_level: string;

    admin_graphql_api_id: string;

    default_address: DefaultAddress;
}

export class DefaultAddress {
    id: number;

    customer_id: number;

    first_name: string;

    last_name: string;

    company: string;

    address1: string;

    address2: string;

    city: string;

    province: string;

    country: string;

    zip: string;

    phone: string;

    name: string;

    province_code: string;

    country_code: string;

    country_name: string;

    default: boolean;
}
