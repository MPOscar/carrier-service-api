import { Type } from 'class-transformer';
import { ConceptosTasacion } from './conceptos-tasacion.dto';
import { IsString } from 'class-validator';
import { TotalTasacion } from './total-tasacion.dto';

export class ConsultaCoberturaPorProductoResult {
    @IsString()
    CodigoServicio: string;

    @Type(() => ConceptosTasacion)
    ConceptosTasacion: ConceptosTasacion;

    @Type(() => TotalTasacion)
    TotalTasacion: TotalTasacion;
}
