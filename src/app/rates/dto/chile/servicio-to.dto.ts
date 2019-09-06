import { Type } from "class-transformer";
import { ConceptosTasacion } from "./conceptos-tasacion.dto";
import { TotalTasacion } from "./total-tasacion.interface";
import { IsString } from "class-validator";

export class ServicioTO {
    @IsString()
    ExtensionData: string;

    @IsString()
    CodigoServicio: string;

    @Type(() => ConceptosTasacion)
    ConceptosTasacion: ConceptosTasacion;

    @Type(() => TotalTasacion)
    TotalTasacion: TotalTasacion;
}