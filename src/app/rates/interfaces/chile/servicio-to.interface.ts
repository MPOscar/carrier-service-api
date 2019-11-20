import { IConceptosTasacion } from './conceptos-tasacion.interface';
import { ITotalTasacion } from './total-tasacion.interface';

export interface IServicioTO {
    CodigoServicio: string;
    ConceptosTasacion: IConceptosTasacion;
    TotalTasacion: ITotalTasacion;
}
