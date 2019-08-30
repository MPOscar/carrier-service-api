import { IsString, IsInt, IsEmail, IsUUID, IsNumber } from 'class-validator';

export class RatesRequestDto {
    @IsString()
    readonly sendingCountry: string;

    @IsString()
    readonly sendingZipCode: string;

    @IsEmail()
    readonly snedingCommune: string;

    @IsString()
    readonly receiverCountry: string;

    @IsString()
    readonly receiverZipCode: string;

    @IsString()
    readonly receiverCommune: string;

    @IsString()
    readonly serviceCode: string;

    @IsString()
    readonly portesType: string;
    
    @IsInt()
    readonly numberOfPieces: number;

    @IsNumber()
    readonly kilos: number;

    @IsNumber()
    readonly volume: number;
    
    @IsNumber()
    readonly refundAmount: number;
    
    @IsNumber()
    readonly amountInsuredValue: number;

}