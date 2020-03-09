import { IsUUID } from 'class-validator';

export class OrderIdDto {
    @IsUUID()
    readonly orderId: string;
}
