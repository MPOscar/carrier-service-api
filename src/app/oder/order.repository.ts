import { EntityRepository, Repository } from "typeorm";

import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { Order } from "./order.entity";
import { User, UserRole } from "../user/user.entity";
import { FilterOrderDto } from "./dto/filter-carrier-service.dto";

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {

    async createOrder(OrderDto: CreateOrderDto) {
        let Order: Order = this.create();
        Order.name = OrderDto.name;
        Order.phone = OrderDto.phone;
        Order.email = OrderDto.email;
        Order.address = OrderDto.address;
        Order.city = OrderDto.city;
        Order.state = OrderDto.state;
        Order.zip = OrderDto.zip;
        Order.language = OrderDto.language;
        Order.driverAssignRadius = OrderDto.driverAssignRadius;
        Order.updatedAt = new Date();
        Order.createdAt = new Date();
        Order = await this.save(Order);
        return this.getOrder(Order.id);
    }

    async updateOrder(id: string, OrderDto: UpdateOrderDto) {
        let Order: Order = await this.getOrder(id);
        Order.name = OrderDto.name ? OrderDto.name : Order.name;
        Order.phone = OrderDto.phone ? OrderDto.phone : Order.phone;
        Order.email = OrderDto.email ? OrderDto.email : Order.email;
        Order.address = OrderDto.address ? OrderDto.address : Order.address;
        Order.city = OrderDto.city ? OrderDto.city : Order.city;
        Order.state = OrderDto.state ? OrderDto.state : Order.state;
        Order.zip = OrderDto.zip ? OrderDto.zip : Order.zip;
        Order.updatedAt = new Date();
        Order = await this.save(Order);
        return this.getOrder(Order.id);
    }

    getOrder(id: string) {
        return this.createQueryBuilder("Order")
            .select()
            .where("Order.id = :OrderId", { OrderId: id })
            .getOne();
    }

    getCompanies(user: User, filter: FilterOrderDto) {
       /* let query = this.createQueryBuilder("Order")
            .select()
            .leftJoinAndSelect("Order.activitySector", "activitySector");

        if (user.role === UserRole.ADVISER) {
            query = query.where("ownerUser.id = :userId", { userId: user.id });
        }

        if (filter) {
            if (filter.name) {
                query = query.andWhere("LOWER(Order.name) LIKE LOWER(:name)", { name: '%' + filter.name + '%' });
            }
            if (filter.startDate && filter.endDate) {
                query = query.andWhere("Order.updatedAt BETWEEN :startDate AND :endDate",
                    { startDate: filter.startDate, endDate: filter.endDate });
            }
        }
        return query.getMany();*/
        return this.find();
    }

    async deleteOrder(id: string) {
        let Order: Order = await this.getOrder(id);
        await this.remove(Order);
        return Order;
    }
}