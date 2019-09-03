export interface IItem {

    readonly id?: string;

    readonly name?: string;

    readonly sku?: string;

    readonly quantity?: number;

    readonly grams?: number;

    readonly price?: number;

    readonly vendor?: string;

    readonly requires_shipping?: boolean;

    readonly taxable?: boolean;

    readonly fulfillment_service?: string;

    readonly properties?: string;

    readonly product_id?: string;

    readonly variant_id?: string;

    readonly createdAt: Date;
    
    readonly updatedAt: Date;

}