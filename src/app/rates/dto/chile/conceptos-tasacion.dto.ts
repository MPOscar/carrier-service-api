import { Type } from "class-transformer";
import { ConceptoTasacionTO } from "./concepto-tasacion-to.dto";

export class ConceptosTasacion {
    @Type(() => ConceptoTasacionTO)
    ConceptoTasacionTO: ConceptoTasacionTO[];
}