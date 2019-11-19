import { Order } from 'src/app/order/order.entity';

export interface IWithdrawal {
    readonly id: string;
    readonly admissionCode: string;
    readonly withdrawalCode: number;
    readonly orders: Order[];
}