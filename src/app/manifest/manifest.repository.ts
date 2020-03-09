import { EntityRepository, Repository } from 'typeorm';

import { ManifestDto } from './dto/create-manifest.dto';
import { UpdateManifestDto } from './dto/update-manifest.dto';
import { Manifest } from './manifest.entity';
import { User } from '../user/user.entity';
import { Order } from '../order/order.entity';

@EntityRepository(Manifest)
export class ManifestRepository extends Repository<Manifest> {
    async createManifest(manifestDto: ManifestDto, order: Order) {
        let manifest: Manifest = this.create();
        manifest.clientRut = manifestDto.clientRut;
        manifest.manifestNumber = manifestDto.manifestNumber;
        manifest.productName = order.name;
        manifest.trackingReference = manifestDto.trackingReference;
        manifest.barCode = manifestDto.barCode;
        manifest.packagesCount = manifestDto.packagesCount;
        manifest.expNumber = manifestDto.expNumber;
        manifest.admissionCode = manifestDto.admissionCode;
        manifest.order = order;
        manifest.updatedAt = new Date();
        manifest.createdAt = new Date();
        manifest = await this.save(manifest);
        return this.getManifest(manifest.id);
    }

    async updateManifest(id: string, manifestDto: ManifestDto) {
        let manifest: Manifest = await this.getManifest(id);
        manifest.clientRut = manifestDto.clientRut
            ? manifestDto.clientRut
            : manifest.clientRut;
        manifest.manifestNumber = manifestDto.manifestNumber
            ? manifestDto.manifestNumber
            : manifest.manifestNumber;
        manifest.productName = manifestDto.productName
            ? manifestDto.productName
            : manifest.productName;
        manifest.trackingReference = manifestDto.trackingReference
            ? manifestDto.trackingReference
            : manifest.trackingReference;
        manifest.barCode = manifestDto.barCode
            ? manifestDto.barCode
            : manifest.barCode;
        manifest.packagesCount = manifestDto.packagesCount
            ? manifestDto.packagesCount
            : manifest.packagesCount;
        manifest.expNumber = manifestDto.expNumber
            ? manifestDto.expNumber
            : manifest.expNumber;
        manifest.admissionCode = manifestDto.admissionCode;
        manifest.updatedAt = new Date();
        manifest = await this.save(manifest);
        return this.getManifest(manifest.id);
    }

    getManifest(id: string) {
        return this.createQueryBuilder('Manifest')
            .select()
            .where('Manifest.id = :ManifestId', { ManifestId: id })
            .innerJoinAndSelect('Manifest.order', 'order')
            .getOne();
    }

    getManifests() {
        return this.createQueryBuilder('manifest')
            .select()
            .getMany();
    }

    async deleteManifest(id: string) {
        let Manifest: Manifest = await this.getManifest(id);
        await this.remove(Manifest);
        return Manifest;
    }
}
