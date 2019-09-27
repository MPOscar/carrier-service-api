export interface IManifest {
    readonly id?: string;
    readonly clientRut?: string;
    readonly manifestNumber?: string;
    readonly productName?: string;
    readonly trackingReference?: string;
    readonly packagesCount?: number;
    readonly barCode?: string;
    readonly expNumber?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
