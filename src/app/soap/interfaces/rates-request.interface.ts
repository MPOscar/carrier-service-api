export interface IRatesRequest {
    readonly sendingCountry: string;
    readonly sendingZipCode: string;
    readonly snedingCommune: string;
    readonly receiverCountry: string;
    readonly receiverZipCode: string;
    readonly receiverCommune: string;
    readonly serviceCode: string;
    readonly portesType: string;
    readonly numberOfPieces: number;    
    readonly kilos: number;
    readonly volume: number;
    readonly refundAmount: number;
    readonly amountInsuredValue: number;
}