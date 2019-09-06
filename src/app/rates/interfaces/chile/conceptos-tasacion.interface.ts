import { IConceptoTasacionTO } from "./concepto-tasacion-to.interface";
import { Type } from "class-transformer";

export interface IConceptosTasacion {
    ConceptoTasacionTO: IConceptoTasacionTO[];
}