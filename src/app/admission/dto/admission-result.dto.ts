import { IsString } from 'class-validator';

export class AdmissionResutlDto {
    @IsString()
    readonly ExtensionData: string;

    @IsString()
    readonly Cuartel: string;

    @IsString()
    readonly Sector: string;

    @IsString()
    readonly SDP: string;

    @IsString()
    readonly AbreviaturaCentro: string;

    @IsString()
    readonly CodigoDelegacionDestino: string;

    @IsString()
    readonly NombreDelegacionDestino: string;

    @IsString()
    readonly DireccionDestino: string;

    @IsString()
    readonly CodigoEncaminamiento: string;

    @IsString()
    readonly GrabarEnvio: string;

    @IsString()
    readonly NumeroEnvio: string;

    @IsString()
    readonly ComunaDestino: string;

    @IsString()
    readonly AbreviaturaServicio: string;

    @IsString()
    readonly CodigoAdmision: string;
}
