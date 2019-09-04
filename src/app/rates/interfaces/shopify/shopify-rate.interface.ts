import { IShopifyOrigin } from "./shopify-origin.interface";
import { IShopifyDestination } from "./shopify-destination.interface";
import { IShopifyItem } from "./shopify-item.interface";

export interface IShopifyRate {
    readonly origin: IShopifyOrigin;
    readonly destination: IShopifyDestination;
    readonly items: IShopifyItem[];
    readonly currency: string;
    readonly locale: string;
}