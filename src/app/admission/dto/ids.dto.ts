import { IsUUID, IsArray } from 'class-validator';

export class IdsDto {

    @IsArray()
    @IsUUID('4', { each: true })
    readonly ids: string[];
}
