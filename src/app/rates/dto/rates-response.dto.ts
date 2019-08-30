import { IsString, IsInt, IsEmail, IsUUID } from 'class-validator';
import { Double } from 'typeorm';

export class RatesRequestDto {
    @IsString()
    readonly base: string;

    @IsString()
    readonly serviceCode: string;

    @IsString()
    readonly concept: string;

    @IsString()
    readonly totalConcept: string;

    @IsString()
    readonly tax: string;

    @IsString()
    readonly observations: string;

    @IsString()
    readonly portes: string;

    @IsString()
    readonly total: string;    

}