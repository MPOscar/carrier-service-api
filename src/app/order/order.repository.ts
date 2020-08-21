import { EntityRepository, Repository, FindManyOptions } from 'typeorm';

import { CreateOrderDto, LineItems } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, FinancialStatus } from './order.entity';
import { User } from '../user/user.entity';
import dataSucursales from '../soap/sucursales.json';
import { FilterOrderDto } from './dto/filter-order.dto';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {
    async createOrder(user: User, orderDto: CreateOrderDto) {
        const sucursal = dataSucursales
            .find(suc => orderDto.shipping_lines[0].title.toUpperCase().includes(suc.SUCURSAL) || {})
            .SUCURSAL || null;

        let order: Order = this.create();
        order.name = orderDto.name;
        order.email = orderDto.email;
        order.orderId = orderDto.id;
        order.number = orderDto.order_number;
        order.note = orderDto.note;
        order.token = orderDto.token;
        order.gateway = orderDto.gateway;
        order.test = orderDto.test;
        order.totalPrice = orderDto.total_price;
        order.subtotalPrice = orderDto.subtotal_price;
        order.totalWeight = orderDto.total_weight;
        order.totalTax = orderDto.total_tax;
        order.taxesIncluded = orderDto.taxes_included;
        order.currency = orderDto.currency;
        order.financialStatus = FinancialStatus[String(orderDto.financial_status).toUpperCase()];
        order.confirmed = orderDto.confirmed;
        order.totalDiscounts = orderDto.total_discounts;
        order.totalLineItemsPrice = orderDto.total_line_items_price;
        order.cartToken = orderDto.cart_token;
        order.buyerAcceptsMarketing = orderDto.buyer_accepts_marketing;
        order.referringSite = orderDto.referring_site;
        order.receiverName = orderDto.shipping_address.name;
        order.receiverAddress = orderDto.shipping_address.address1;
        order.receiverContactName = orderDto.shipping_address.name;
        order.receiverContactPhone = orderDto.shipping_address.phone;
        order.receiverCity = orderDto.shipping_address.city;
        order.receiverCityCode = orderDto.shipping_address.province_code;
        order.serviceCode = orderDto.shipping_lines[0].title.includes(
            'SUCURSAL',
        )
            ? '07'
            : '24';
        order.totalPieces = this.getTotalPieces(orderDto.line_items);
        order.kg = orderDto.total_weight / 1000;
        order.volumen = 0.000001;
        order.receiverCountry = orderDto.shipping_address.country;
        order.closedAt = orderDto.closed_at;
        order.sucursal = sucursal;
        order.user = { id: user.id } as any;
        // order.status = orderDto.status;
        // order.service = orderDto.service;
        // order.tracking_company = orderDto.tracking_company;
        // order.shipment_status = orderDto.shipment_status;
        // order.location_id = orderDto.location_id;
        // order.tracking_number = orderDto.tracking_number;
        // order.tracking_url = orderDto.tracking_url;
        order.updatedAt = new Date();
        order.createdAt = new Date();
        order = await this.save(order);
        return this.getOrder(order.id);
    }

    async updateOrder(id: string, orderDto: UpdateOrderDto) {
        let order: Order = await this.getOrder(id);
        order.name = orderDto.name ? orderDto.name : Order.name;
        order.email = orderDto.email ? orderDto.email : order.email;
        order.orderId = orderDto.orderId ? orderDto.orderId : order.orderId;
        order.number = orderDto.number ? orderDto.number : order.number;
        order.note = orderDto.note ? orderDto.note : order.note;
        order.token = orderDto.token ? orderDto.token : order.token;
        order.gateway = orderDto.gateway ? orderDto.gateway : order.gateway;
        order.test = orderDto.test ? orderDto.test : order.test;
        order.totalPrice = orderDto.totalPrice
            ? orderDto.totalPrice
            : order.totalPrice;
        order.subtotalPrice = orderDto.subtotalPrice
            ? orderDto.subtotalPrice
            : order.subtotalPrice;
        order.totalWeight = orderDto.totalWeight
            ? orderDto.totalWeight
            : order.totalWeight;
        order.totalTax = orderDto.totalTax ? orderDto.totalTax : order.totalTax;
        order.taxesIncluded = orderDto.taxesIncluded
            ? orderDto.taxesIncluded
            : order.taxesIncluded;
        order.currency = orderDto.currency ? orderDto.currency : order.currency;
        order.financialStatus = orderDto.financialStatus
            ? FinancialStatus[String(orderDto.financialStatus).toUpperCase()]
            : order.financialStatus;
        order.confirmed = orderDto.confirmed
            ? orderDto.confirmed
            : order.confirmed;
        order.totalDiscounts = orderDto.totalDiscounts
            ? orderDto.totalDiscounts
            : order.totalDiscounts;
        order.totalLineItemsPrice = orderDto.totalLineItemsPrice
            ? orderDto.totalLineItemsPrice
            : order.totalLineItemsPrice;
        order.cartToken = orderDto.cartToken
            ? orderDto.cartToken
            : order.cartToken;
        order.buyerAcceptsMarketing = orderDto.buyerAcceptsMarketing
            ? orderDto.buyerAcceptsMarketing
            : order.buyerAcceptsMarketing;
        order.referringSite = orderDto.referringSite
            ? orderDto.referringSite
            : order.referringSite;
        order.closedAt = orderDto.closedAt ? orderDto.closedAt : order.closedAt;
        order.updatedAt = new Date();
        order = await this.save(order);
        return this.getOrder(order.id);
    }

    getOrder(id: string) {
        return this.createQueryBuilder('Order')
            .select('Order')
            .where('Order.id = :OrderId', { OrderId: id })
            .leftJoinAndSelect('Order.admission', 'admission')
            .getOne();
    }

    getOrderByNumber(orderNumber: number, user: User) {
        return this.createQueryBuilder('Order')
            .select('Order')
            .where('Order.number = :orderNumber', { orderNumber })
            .andWhere('Order.user_id = :userId', { userId: user.id })
            .getOne();
    }

    async markOrderAsPaid(order: Order) {
        order.financialStatus = FinancialStatus.PAID;
        return this.save(order);
    }

    async markOrderAsCancelled(order: Order) {
        order.financialStatus = FinancialStatus.VOIDED;
        return this.save(order);
    }

    async markOrderGeneratedLabel(order: Order) {
        order.generatedLabel = true;
        return this.save(order);
    }

    getOrders() {
        return this.createQueryBuilder('Order')
            .select('Order')
            .leftJoinAndSelect('Order.admission', 'admission')
            .getMany();
    }

    async getOrdersByIds(ids: string[]) {
        const options: FindManyOptions = {
            relations: ['admission'],
        };
        return this.findByIds(ids, options);
    }

    async getOrdersNoWithdrawal(user: User, filter?: FilterOrderDto) {
        let query = this.createQueryBuilder('Order')
            .select()
            .where('Order.withdrawal_id is null')
            .andWhere('Order.user_id = :userId', { userId: user.id })
            .leftJoinAndSelect('Order.admission', 'admission');

        if (filter) {
            if (filter.status) {
                const fStatus = this.getStatus(filter.status);
                query = query.andWhere(`Order.financialStatus = :status`, { status: fStatus });
            }
        }
        return query
            .addOrderBy('Order.createdAt', 'DESC')
            .getMany();
    }

    getStatus(status: string) {
        switch (status) {
            case 'paid':
                return FinancialStatus.PAID;
                break;

            case 'authorized':
                return FinancialStatus.AUTHORIZED;
                break;

            case 'pending':
                return FinancialStatus.PENDING;
                break;

            case 'voided':
                return FinancialStatus.VOIDED;
                break;

            default:
                break;
        }
    }

    async deleteOrder(id: string) {
        const order: Order = await this.getOrder(id);
        await this.remove(order);
        return order;
    }

    getTotalPieces(items: LineItems[]): number {
        let totalPieces = 0;

        items.forEach(element => {
            totalPieces += element.quantity;
        });

        return totalPieces;
    }
}
