export interface IOrder {

    readonly id?: string;

    readonly order_id?: number;

    readonly status?: string;   

    readonly service?: string;    

    readonly tracking_company?: string;

    readonly shipment_status?: string;

    readonly location_id?: string;

    readonly email?: string;

    readonly tracking_number?: string;

    readonly tracking_numbers?: string;

    readonly tracking_url?: string;

    readonly tracking_urls?: string;

    readonly name?: string;

    readonly created_at?: Date;

    readonly updated_at?: Date;

}