import { EntityRepository, Repository } from "typeorm";

import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { Order } from "./order.entity";
import { User } from "../user/user.entity";

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {

    async createOrder(orderDto: CreateOrderDto) {
        let order: Order = this.create();
        order.name = orderDto.name;
        order.email = orderDto.email;
        order.order_id = orderDto.order_id;
        order.email = orderDto.email;
        order.number = orderDto.order_id;
        order.note = orderDto.note;
        order.token = orderDto.token;
        order.gateway = orderDto.gateway;
        order.test = orderDto.test;
        order.total_price = orderDto.total_price;
        order.subtotal_price = orderDto.subtotal_price;
        order.total_weight = orderDto.total_weight;
        order.total_tax = orderDto.total_tax;
        order.taxes_included = orderDto.taxes_included;
        order.currency = orderDto.currency;
        order.financial_status = orderDto.financial_status;
        order.confirmed = orderDto.confirmed;
        order.total_discounts = orderDto.total_discounts;
        order.total_line_items_price = orderDto.total_line_items_price;
        order.cart_token = orderDto.cart_token;
        order.buyer_accepts_marketing = orderDto.buyer_accepts_marketing;
        order.name = orderDto.name;
        order.referring_site = orderDto.referring_site;
        order.closed_at = orderDto.closed_at;
        /*order.status = orderDto.status;
        order.service = orderDto.service;
        order.tracking_company = orderDto.tracking_company;
        order.shipment_status = orderDto.shipment_status;
        order.location_id = orderDto.location_id;
        order.tracking_number = orderDto.tracking_number;
        order.tracking_url = orderDto.tracking_url;   
        order.updatedAt = new Date();
        order.createdAt = new Date();*/
        order = await this.save(order);
        return this.getOrder(order.id);
    }

    async updateOrder(id: string, orderDto: UpdateOrderDto) {
        let order: Order = await this.getOrder(id);
        order.name = orderDto.name ? orderDto.name : Order.name;
        order.email = orderDto.email ? orderDto.email : order.email;
        order.order_id = orderDto.order_id ? orderDto.order_id : order.order_id;
        /*order.status = orderDto.status ? orderDto.status : order.status;
        order.service = orderDto.service ? orderDto.service : order.service;
        order.tracking_company = orderDto.tracking_company ? orderDto.tracking_company : order.tracking_company;
        order.shipment_status = orderDto.shipment_status ? orderDto.shipment_status : order.shipment_status;
        order.location_id = orderDto.location_id ? orderDto.location_id : order.location_id;
        order.tracking_number = orderDto.tracking_number ? orderDto.tracking_number : order.tracking_number;
        order.tracking_url = orderDto.tracking_url ? orderDto.tracking_url : order.tracking_url;
        order.updatedAt = new Date();*/
        order = await this.save(order);
        return this.getOrder(order.id);
    }

    getOrder(id: string) {
        return this.createQueryBuilder("Order")
            .select()
            .where("Order.id = :OrderId", { OrderId: id })
            .getOne();
    }

    getOrders(user: User) {
        /* let query = this.createQueryBuilder("company")
             .select()
             .leftJoinAndSelect("company.activitySector", "activitySector");
 
         if (user.role === UserRole.ADVISER) {
             query = query.where("ownerUser.id = :userId", { userId: user.id });
         }
 
         if (filter) {
             if (filter.name) {
                 query = query.andWhere("LOWER(company.name) LIKE LOWER(:name)", { name: '%' + filter.name + '%' });
             }
             if (filter.startDate && filter.endDate) {
                 query = query.andWhere("company.updatedAt BETWEEN :startDate AND :endDate",
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