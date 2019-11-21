import { IsString } from 'class-validator';

export class TotalTasacion {
    @IsString()
    ConceptoTotal: string;

    @IsString()
    Total: string;
}
