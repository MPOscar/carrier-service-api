import { IsString } from 'class-validator';

export class FilterOrderDto {

    @IsString()
    status: string;
}
