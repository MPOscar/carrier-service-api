import { Order } from 'src/app/order/order.entity';

export interface IWithdrawal {
    readonly id: string;
    readonly admissionCode: string;
    readonly withdrawalCode: number;
    readonly contact: String;
    readonly contactPhone: string;
    readonly date: Date;
    readonly horaDesde: Date;
    readonly horaHasta: Date;
    readonly rut?: string;
    readonly address?: string;
    readonly comuna?: string;
    readonly region?: string;
    readonly zip?: string;
    readonly orders: Order[];
}