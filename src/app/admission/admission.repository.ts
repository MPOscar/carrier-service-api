import { EntityRepository, Repository } from 'typeorm';

import { Order } from '../order/order.entity';
import { Admission } from './admission.entity';
import { AdmissionResponseDto } from './dto/admission-response.dto';
import { User } from '../user/user.entity';

@EntityRepository(Admission)
export class AdmissionRepository extends Repository<Admission> {
    async createAdmission(admissionDto: AdmissionResponseDto, order: Order) {
        let admission: Admission = this.create();
        admission.abreviaturaCentro =
            admissionDto.admitirEnvioResult.AbreviaturaCentro;
        admission.abreviaturaServicio =
            admissionDto.admitirEnvioResult.AbreviaturaServicio;
        admission.codigoAdmision =
            admissionDto.admitirEnvioResult.CodigoAdmision;
        admission.codigoDelegacionDestino =
            admissionDto.admitirEnvioResult.CodigoDelegacionDestino;
        admission.codigoEncaminamiento =
            admissionDto.admitirEnvioResult.CodigoEncaminamiento;
        admission.comunaDestino = admissionDto.admitirEnvioResult.ComunaDestino;
        admission.cuartel = admissionDto.admitirEnvioResult.Cuartel;
        admission.direccionDestino =
            admissionDto.admitirEnvioResult.DireccionDestino;
        admission.grabarEnvio = admissionDto.admitirEnvioResult.GrabarEnvio;
        admission.nombreDelegacionDestino =
            admissionDto.admitirEnvioResult.NombreDelegacionDestino;
        admission.numeroEnvio = admissionDto.admitirEnvioResult.NumeroEnvio;
        admission.SDP = admissionDto.admitirEnvioResult.SDP;
        admission.sector = admissionDto.admitirEnvioResult.Sector;
        admission.order = order;
        admission.updatedAt = new Date();
        admission.createdAt = new Date();
        admission = await this.save(admission);
        return this.getAdmission(admission.id);
    }

    async updateAdmission(admissionDto: AdmissionResponseDto, admission: Admission) {
        admission.abreviaturaCentro =
            admissionDto.admitirEnvioResult.AbreviaturaCentro;
        admission.abreviaturaServicio =
            admissionDto.admitirEnvioResult.AbreviaturaServicio;
        admission.codigoAdmision =
            admissionDto.admitirEnvioResult.CodigoAdmision;
        admission.codigoDelegacionDestino =
            admissionDto.admitirEnvioResult.CodigoDelegacionDestino;
        admission.codigoEncaminamiento =
            admissionDto.admitirEnvioResult.CodigoEncaminamiento;
        admission.comunaDestino = admissionDto.admitirEnvioResult.ComunaDestino;
        admission.cuartel = admissionDto.admitirEnvioResult.Cuartel;
        admission.direccionDestino =
            admissionDto.admitirEnvioResult.DireccionDestino;
        admission.grabarEnvio = admissionDto.admitirEnvioResult.GrabarEnvio;
        admission.nombreDelegacionDestino =
            admissionDto.admitirEnvioResult.NombreDelegacionDestino;
        admission.numeroEnvio = admissionDto.admitirEnvioResult.NumeroEnvio;
        admission.SDP = admissionDto.admitirEnvioResult.SDP;
        admission.sector = admissionDto.admitirEnvioResult.Sector;
        admission.updatedAt = new Date();
        return await this.save(admission);
    }

    getAdmission(id: string) {
        return this.createQueryBuilder('Admission')
            .select()
            .where('Admission.id = :AdmissionId', { AdmissionId: id })
            .innerJoinAndSelect('Admission.order', 'order')
            .getOne();
    }

    getAdmissionByOrderId(orderId: string) {
        return this.createQueryBuilder('admission')
            .select()
            .where('admission.order_id = :orderId', { orderId })
            .getOne();
    }

    getAdmissions() {
        return this.createQueryBuilder('admission')
            .select()
            .getMany();
    }

    async deleteAdmission(id: string) {
        const admission: Admission = await this.getAdmission(id);
        await this.remove(admission);
        return admission;
    }
}
