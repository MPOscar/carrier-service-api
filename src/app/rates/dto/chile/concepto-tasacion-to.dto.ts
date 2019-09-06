import { IsString } from "class-validator";

export class ConceptoTasacionTO {
    @IsString()
    ExtensionData: string;

    @IsString()
    Base: string;

    @IsString()
    Concepto: string;

    @IsString()
    Impuesto: string;

    @IsString()
    Observaciones: string;

    @IsString()
    Portes: string;
}