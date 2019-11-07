import { IsString, IsInt, IsEmail, IsUUID, IsNumber } from 'class-validator';

export class AdmissionRequestDto {
    @IsString()
    readonly admissionCode: string;

    @IsString()
    readonly sendingClient: string;

    @IsString()
    readonly sendingCenter: string;

    @IsString()
    readonly sendingName: string;

    @IsString()
    readonly sendingAddress: string;

    @IsString()
    readonly sendingCountry: string;

    @IsString()
    readonly sendingZipCode: string;

    @IsEmail()
    readonly snedingCommune: string;

    @IsString()
    readonly sendingRut: string;

    @IsString()
    readonly sendingContactPerson: string;

    @IsString()
    readonly sendingContactPhone: string;

    @IsString()
    readonly receiverClient: string;

    @IsString()
    readonly receiverCenter: string;

    @IsString()
    readonly receiverName: string;

    @IsString()
    readonly receiverAddress: string;

    @IsString()
    readonly receiverCountry: string;

    @IsString()
    readonly receiverZipCode: string;

    @IsString()
    readonly receiverCommune: string;

    @IsString()
    readonly receiverRut: string;

    @IsString()
    readonly receiverContactPerson: string;

    @IsString()
    readonly receiverContactPhone: string;

    @IsString()
    readonly serviceCode: string;

    @IsInt()
    readonly numberOfPieces: number;

    @IsNumber()
    readonly kilos: number;

    @IsNumber()
    readonly volume: number;

    @IsNumber()
    readonly referenceNumber: number;

    @IsNumber()
    readonly refundAmount: number;

    @IsNumber()
    readonly amountInsuredValue: number;

    @IsString()
    readonly portesType: string;

    @IsString()
    readonly observations: string;

    @IsString()
    readonly observations2: string;

    @IsEmail()
    readonly receiverEmail: string;

    @IsString()
    readonly commodityType: string;

    @IsString()
    readonly conformentReturn: string;

    @IsNumber()
    readonly numberOfDocuments: number;

    @IsString()
    readonly securePayment: string;
}
