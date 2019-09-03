import { EntityRepository, Repository } from "typeorm";

import { CreateManifestDto } from "./dto/create-manifest.dto";
import { UpdateManifestDto } from "./dto/update-manifest.dto";
import { Manifest } from "./manifest.entity";
import { User, UserRole } from "../user/user.entity";

@EntityRepository(Manifest)
export class ManifestRepository extends Repository<Manifest> {

    async createManifest(ManifestDto: CreateManifestDto) {
        let Manifest: Manifest = this.create();
        Manifest.name = ManifestDto.name;
        Manifest.phone = ManifestDto.phone;
        Manifest.email = ManifestDto.email;
        Manifest.address = ManifestDto.address;
        Manifest.city = ManifestDto.city;
        Manifest.state = ManifestDto.state;
        Manifest.zip = ManifestDto.zip;
        Manifest.language = ManifestDto.language;
        Manifest.driverAssignRadius = ManifestDto.driverAssignRadius;
        Manifest.updatedAt = new Date();
        Manifest.createdAt = new Date();
        Manifest = await this.save(Manifest);
        return this.getManifest(Manifest.id);
    }

    async updateManifest(id: string, ManifestDto: UpdateManifestDto) {
        let Manifest: Manifest = await this.getManifest(id);
        Manifest.name = ManifestDto.name ? ManifestDto.name : Manifest.name;
        Manifest.phone = ManifestDto.phone ? ManifestDto.phone : Manifest.phone;
        Manifest.email = ManifestDto.email ? ManifestDto.email : Manifest.email;
        Manifest.address = ManifestDto.address ? ManifestDto.address : Manifest.address;
        Manifest.city = ManifestDto.city ? ManifestDto.city : Manifest.city;
        Manifest.state = ManifestDto.state ? ManifestDto.state : Manifest.state;
        Manifest.zip = ManifestDto.zip ? ManifestDto.zip : Manifest.zip;
        Manifest.updatedAt = new Date();
        Manifest = await this.save(Manifest);
        return this.getManifest(Manifest.id);
    }

    getManifest(id: string) {
        return this.createQueryBuilder("Manifest")
            .select()
            .where("Manifest.id = :ManifestId", { ManifestId: id })
            .getOne();
    }
   
    async deleteManifest(id: string) {
        let Manifest: Manifest = await this.getManifest(id);
        await this.remove(Manifest);
        return Manifest;
    }
}