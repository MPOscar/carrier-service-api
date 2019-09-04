import { IConceptosTasacion } from "./conceptos-tasacion.interface";
import { ITotalTasacion } from "./total-tasacion.interface";

export interface IServicioTO {
    ExtensionData:     string;
    CodigoServicio:    string;
    ConceptosTasacion: IConceptosTasacion;
    TotalTasacion:     ITotalTasacion;
}