export interface IShopifyItem {
    readonly name: string,
    readonly sku: string,
    readonly quantity: number,
    readonly grams: number,
    readonly price: number,
    readonly vendor: string,
    readonly requires_shipping: boolean,
    readonly taxable: boolean,
    readonly fulfillment_service: string,
    readonly properties: any,
    readonly product_id: number,
    readonly variant_id: number
}