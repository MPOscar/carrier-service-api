export class LocationDto {
    id: number;
    name: string;
    address1: string;
    address2: string;
    city: string;
    zip: number;
    province: string;
    country: string;
    phone: string;
    created_at: Date;
    updated_at: Date;
    country_code: string;
    country_name: string;
    province_code: string;
    legacy: boolean;
    active: boolean;
    admin_graphql_api_id: string;
}
