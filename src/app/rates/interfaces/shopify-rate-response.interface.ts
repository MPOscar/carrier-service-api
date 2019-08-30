export interface IShopifyRateResponse {
    service_name: string;
    service_code: string;
    total_price: string;
    description?: string;
    currency: string;
    min_delivery_date: string;
    max_delivery_date: string;
}