import { IRatesRequest } from "../interfaces/rates-request.interface";
import { RatesRequestDto } from "../dto/rates-request.dto";

export class RatesModel implements IRatesRequest {
    sendingCountry: string;
    sendingZipCode: string;
    snedingCommune: string;
    receiverCountry: string;
    receiverZipCode: string;
    receiverCommune: string;
    serviceCode: string;
    portesType: string;
    numberOfPieces: number;
    kilos: number;
    volume: number;
    refundAmount: number;
    amountInsuredValue: number;

    constructor(sendingCountry: string, sendingZipCode: string, snedingCommune: string, 
        receiverCountry: string, receiverZipCode: string, receiverCommune: string, serviceCode: string, 
        portesType: string, numberOfPieces: number, kilos: number, volume: number, refundAmount: number, 
        amountInsuredValue: number){
            this.sendingCountry = sendingCountry;
            this.sendingZipCode = sendingZipCode;
            this.snedingCommune = snedingCommune;
            this.receiverCountry = receiverCountry;
            this.receiverZipCode = receiverZipCode;
            this.receiverCommune = receiverCommune;
            this.serviceCode = serviceCode;
            this.portesType = portesType;
            this.numberOfPieces = numberOfPieces;
            this.kilos = kilos;
            this.volume = volume;
            this.refundAmount = refundAmount;
            this.amountInsuredValue = amountInsuredValue;
    }

    static create(ratesDto: RatesRequestDto): RatesModel {
        return new RatesModel(ratesDto.sendingCountry, ratesDto.sendingZipCode, ratesDto.snedingCommune, 
            ratesDto.receiverCountry, ratesDto.receiverZipCode, ratesDto.receiverCommune, ratesDto.serviceCode, 
            ratesDto.portesType, ratesDto.numberOfPieces, ratesDto.kilos, ratesDto.volume, 
            ratesDto.refundAmount, ratesDto.amountInsuredValue);
    }

}