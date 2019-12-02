import { Type } from 'class-transformer';
import { ConsultaCoberturaPorProductoResult } from './consulta-cobertura-product-result.dto';

export class RateProductResponse {
    @Type(() => ConsultaCoberturaPorProductoResult)
    consultaCoberturaPorProductoResult: ConsultaCoberturaPorProductoResult;
}
