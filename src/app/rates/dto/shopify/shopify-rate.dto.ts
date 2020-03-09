import { ShopifyOriginDto } from './shopify-origin.dto';
import { ShopifyDestinationDto } from './shopify-destination.dto';
import { ShopifyItemDto } from './shopify-item.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class ShopifyRateDto {
    readonly origin: ShopifyOriginDto;
    readonly destination: ShopifyDestinationDto;

    @IsNotEmpty()
    readonly items: ShopifyItemDto[];

    @IsString()
    readonly currency: string;

    @IsString()
    readonly locale: string;
}
