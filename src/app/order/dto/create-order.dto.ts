import { IsString, IsInt, IsEmail, IsUUID } from 'class-validator';

export class CreateOrderDto {
    
    @IsString()
    readonly order_id?: number;

    @IsString()
    readonly status?: string;

    @IsString()
    readonly service?: string;

    @IsString()
    readonly tracking_company?: string;

    @IsString()
    readonly shipment_status?: string;
    
    @IsString()
    readonly location_id?: string;

    @IsString()
    readonly email?: string;

    @IsString()
    readonly tracking_number?: string;

    @IsString()
    readonly tracking_numbers?: string;

    @IsString()
    readonly tracking_url?: string;

    @IsString()
    readonly tracking_urls?: string;

    @IsString()
    readonly name?: string;

    readonly created_at?: Date;

    readonly updated_at?: Date;

}
