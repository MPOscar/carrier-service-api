import { ServicioTO } from "./servicio-to.dto";
import { Type } from "class-transformer";

export class ConsultaCoberturaResult {
    @Type(() => ServicioTO)
    ServicioTO: ServicioTO[];
}
