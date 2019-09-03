import { EntityRepository, Repository } from "typeorm";

import { CreateCarrierDto } from "./dto/create-carrier-service.dto";
import { UpdateCarrierDto } from "./dto/update-carrier-service.dto";
import { Carrier } from "./carrier-service.entity";
import { User } from "../user/user.entity";
import { FilterCarrierDto } from "./dto/filter-carrier-service.dto";

@EntityRepository(Carrier)
export class CarrierRepository extends Repository<Carrier> {

    async createCarrier(carrierDto: CreateCarrierDto) {
        let carrier: Carrier = this.create();
        carrier.name = carrierDto.name;
        carrier.phone = carrierDto.phone;
        carrier.email = carrierDto.email;
        carrier.address = carrierDto.address;
        carrier.city = carrierDto.city;
        carrier.state = carrierDto.state;
        carrier.zip = carrierDto.zip;
        carrier.language = carrierDto.language;
        carrier.driverAssignRadius = carrierDto.driverAssignRadius;
        carrier.updatedAt = new Date();
        carrier.createdAt = new Date();
        carrier = await this.save(carrier);
        return this.getCarrier(carrier.id);
    }

    async updateCarrier(id: string, carrierDto: UpdateCarrierDto) {
        let carrier: Carrier = await this.getCarrier(id);
        carrier.name = carrierDto.name ? carrierDto.name : carrier.name;
        carrier.phone = carrierDto.phone ? carrierDto.phone : carrier.phone;
        carrier.email = carrierDto.email ? carrierDto.email : carrier.email;
        carrier.address = carrierDto.address ? carrierDto.address : carrier.address;
        carrier.city = carrierDto.city ? carrierDto.city : carrier.city;
        carrier.state = carrierDto.state ? carrierDto.state : carrier.state;
        carrier.zip = carrierDto.zip ? carrierDto.zip : carrier.zip;
        carrier.updatedAt = new Date();
        carrier = await this.save(carrier);
        return this.getCarrier(carrier.id);
    }

    getCarrier(id: string) {
        return this.createQueryBuilder("carrier")
            .select()
            .where("carrier.id = :carrierId", { carrierId: id })
            .getOne();
    }

    getCompanies(user: User, filter: FilterCarrierDto) {
       /* let query = this.createQueryBuilder("carrier")
            .select()
            .leftJoinAndSelect("carrier.activitySector", "activitySector");

        if (user.role === UserRole.ADVISER) {
            query = query.where("ownerUser.id = :userId", { userId: user.id });
        }

        if (filter) {
            if (filter.name) {
                query = query.andWhere("LOWER(carrier.name) LIKE LOWER(:name)", { name: '%' + filter.name + '%' });
            }
            if (filter.startDate && filter.endDate) {
                query = query.andWhere("carrier.updatedAt BETWEEN :startDate AND :endDate",
                    { startDate: filter.startDate, endDate: filter.endDate });
            }
        }
        return query.getMany();*/
        return this.find();
    }

    async deleteCarrier(id: string) {
        let carrier: Carrier = await this.getCarrier(id);
        await this.remove(carrier);
        return carrier;
    }
}