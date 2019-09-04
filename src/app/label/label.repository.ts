import { EntityRepository, Repository } from "typeorm";

import { CreateLabelDto } from "./dto/create-label.dto";
import { UpdateLabelDto } from "./dto/update-label.dto";
import { Label } from "./label.entity";
import { User } from "../user/user.entity";

@EntityRepository(Label)
export class LabelRepository extends Repository<Label> {

    async createLabel(LabelDto: CreateLabelDto) {
        let Label: Label = this.create();
        Label.name = LabelDto.name;
        Label.phone = LabelDto.phone;
        Label.email = LabelDto.email;
        Label.address = LabelDto.address;
        Label.city = LabelDto.city;
        Label.state = LabelDto.state;
        Label.zip = LabelDto.zip;
        Label.language = LabelDto.language;
        Label.driverAssignRadius = LabelDto.driverAssignRadius;
        Label.updatedAt = new Date();
        Label.createdAt = new Date();
        Label = await this.save(Label);
        return this.getLabel(Label.id);
    }

    async updateLabel(id: string, LabelDto: UpdateLabelDto) {
        let Label: Label = await this.getLabel(id);
        Label.name = LabelDto.name ? LabelDto.name : Label.name;
        Label.phone = LabelDto.phone ? LabelDto.phone : Label.phone;
        Label.email = LabelDto.email ? LabelDto.email : Label.email;
        Label.address = LabelDto.address ? LabelDto.address : Label.address;
        Label.city = LabelDto.city ? LabelDto.city : Label.city;
        Label.state = LabelDto.state ? LabelDto.state : Label.state;
        Label.zip = LabelDto.zip ? LabelDto.zip : Label.zip;
        Label.updatedAt = new Date();
        Label = await this.save(Label);
        return this.getLabel(Label.id);
    }

    getLabel(id: string) {
        return this.createQueryBuilder("Label")
            .select()
            .where("Label.id = :LabelId", { LabelId: id })
            .getOne();
    }
   
    async deleteLabel(id: string) {
        let Label: Label = await this.getLabel(id);
        await this.remove(Label);
        return Label;
    }
}