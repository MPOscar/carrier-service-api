import { IsString, IsInt, IsEmail, IsUUID, IsNumber } from 'class-validator';
import { CreateUserDto } from '../../user/dto/create-user.dto'

export class ManifestDto {
    @IsString()
    readonly clientRut: string;

    @IsString()
    readonly clientName: string;

    // @IsString()
    // readonly clientIdApiChile: string; // SAP code

    // @IsString()
    // readonly user: string; // by default WEB_SERVICE

    @IsString()
    readonly manifestNumber: string;

    // @IsString()
    // readonly comuna: string;

    @IsString()
    readonly productName: string;

    @IsString()
    readonly trackingReference: string;

    @IsNumber()
    readonly packagesCount: number;

    @IsString()
    readonly barCode: string;

    @IsString()
    readonly expNumber: string;
}

export class RegisterManifestDto {
    readonly company: ManifestDto;
    readonly user: CreateUserDto;
}