import { IsString } from "class-validator";

export class TotalTasacion {
    @IsString()
    ExtensionData: string;

    @IsString()
    ConceptoTotal: string;

    @IsString()
    Total: string;
}