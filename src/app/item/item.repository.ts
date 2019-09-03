import { EntityRepository, Repository } from "typeorm";

import { CreateItemDto } from "./dto/create-item.dto";
import { UpdateItemDto } from "./dto/update-item.dto";
import { Item } from "./item.entity";
import { User } from "../user/user.entity";

@EntityRepository(Item)
export class ItemRepository extends Repository<Item> {

    async createItem(ItemDto: CreateItemDto) {
        let Item: Item = this.create();
        Item.name = ItemDto.name;
        /*Item.phone = ItemDto.phone;
        Item.email = ItemDto.email;
        Item.address = ItemDto.address;
        Item.city = ItemDto.city;
        Item.state = ItemDto.state;
        Item.zip = ItemDto.zip;
        Item.language = ItemDto.language;
        Item.driverAssignRadius = ItemDto.driverAssignRadius;*/
        Item.updatedAt = new Date();
        Item.createdAt = new Date();
        Item = await this.save(Item);
        return this.getItem(Item.id);
    }

    async updateItem(id: string, ItemDto: UpdateItemDto) {
        let Item: Item = await this.getItem(id);
        Item.name = ItemDto.name ? ItemDto.name : Item.name;
        /*Item.phone = ItemDto.phone ? ItemDto.phone : Item.phone;
        Item.email = ItemDto.email ? ItemDto.email : Item.email;
        Item.address = ItemDto.address ? ItemDto.address : Item.address;
        Item.city = ItemDto.city ? ItemDto.city : Item.city;
        Item.state = ItemDto.state ? ItemDto.state : Item.state;
        Item.zip = ItemDto.zip ? ItemDto.zip : Item.zip;*/
        Item.updatedAt = new Date();
        Item = await this.save(Item);
        return this.getItem(Item.id);
    }

    getItem(id: string) {
        return this.createQueryBuilder("Item")
            .select()
            .where("Item.id = :ItemId", { ItemId: id })
            .getOne();
    }
   
    async deleteItem(id: string) {
        let Item: Item = await this.getItem(id);
        await this.remove(Item);
        return Item;
    }
}