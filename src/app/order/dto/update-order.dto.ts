import { IsString, IsInt, IsEmail, IsUUID } from 'class-validator';

export class UpdateOrderDto {

    readonly orderId?: bigint;

    readonly email: string;

    readonly number: number;

    readonly note: null;

    readonly token: string;

    readonly gateway: string;

    readonly test: boolean;

    readonly totalPrice: string;

    readonly subtotalPrice: string;

    readonly totalWeight: number;

    readonly totalTax: string;

    readonly taxesIncluded: boolean;

    readonly currency: string;

    readonly financialStatus: string;

    readonly confirmed: boolean;

    readonly totalDiscounts: string;

    readonly totalLineItemsPrice: string;

    readonly cartToken: string;

    readonly buyerAcceptsMarketing: boolean;

    readonly name: string;

    readonly referringSite: string;

    readonly closedAt: Date;
}