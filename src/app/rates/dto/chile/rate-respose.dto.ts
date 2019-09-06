import { Type } from "class-transformer";
import { ConsultaCoberturaResult } from "./consulta-cobertura-result.dto";

export class RateResponse {
    @Type(() => ConsultaCoberturaResult)
    consultaCoberturaResult: ConsultaCoberturaResult;
}