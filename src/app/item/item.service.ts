import { Injectable, HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';

import { InjectRepository } from '@nestjs/typeorm';

import { Item } from './item.entity';
import { ItemRepository } from './item.repository';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ErrorResult, NotFoundResult, BadRequestResult, InternalServerErrorResult } from '../common/error-manager/errors';
import { ErrorCode } from '../common/error-manager/error-codes';
import { User } from '../user/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class ItemService {
    constructor(
        //@InjectRepository(Item)  
        private readonly httpService: HttpService,
        private readonly ItemRepository: ItemRepository,
        private readonly userService: UserService,
    ) { }

    async create(ItemDto: CreateItemDto): Promise<Item> {
        return new Promise((resolve: (result: Item) => void, reject: (reason: ErrorResult) => void): void => {

            this.ItemRepository.createItem(ItemDto).then((Item: Item) => {
                resolve(Item);
                /*this.userService.create(Item.id).then((user: User) => {
                }).catch((error) => {
                    reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
                });*/
            }).catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });

        });
    }

    getQuotes() {
        return this.httpService.get('http://quotesondesign.com/wp-json/posts')
            .pipe(
                map(response => response.data)
            );
    }

    getAcccesToken(accessTokenRequestUrl: string, accessTokenPayload: any) {
        return this.httpService.post(accessTokenRequestUrl, accessTokenPayload)
            .pipe(
                map(response => response.data)
            );
    }

    update(id: string, ItemDto: UpdateItemDto): Promise<Item> {
        return new Promise((resolve: (result: Item) => void, reject: (reason: ErrorResult) => void): void => {
            this.ItemRepository.getItem(id).then((Item: Item) => {
                if (!Item) {
                    reject(new NotFoundResult(ErrorCode.UnknownEntity, 'There is no Item with the specified ID!'));
                    return;
                }
                this.ItemRepository.updateItem(id, ItemDto).then((Item: Item) => {
                    resolve(Item);
                }).catch((error) => {
                    reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
                });
            }).catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });
        });
    }

    async getItem(id: string): Promise<Item> {
        return new Promise((resolve: (result: Item) => void, reject: (reason: ErrorResult) => void): void => {
            this.ItemRepository.getItem(id).then((Item: Item) => {
                if (!Item) {
                    reject(new NotFoundResult(ErrorCode.UnknownEntity, 'There is no Item with the specified ID!'));
                    return;
                }
                resolve(Item);
            }).catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });
        });
    }
  
    delete(id: string): Promise<Item> {
        return new Promise((resolve: (result: Item) => void, reject: (reason: ErrorResult) => void): void => {
            this.ItemRepository.getItem(id).then((Item: Item) => {
                if (!Item) {
                    reject(new NotFoundResult(ErrorCode.UnknownEntity, 'There is no Item with the specified ID!'));
                    return;
                }
                this.ItemRepository.remove(Item).then((Item: Item) => {
                    if (!Item) {
                        reject(new BadRequestResult(ErrorCode.UnknownError, 'It can not be eliminated!'));
                        return;
                    }
                    resolve(Item);
                });
            }).catch((error) => {
                reject(new InternalServerErrorResult(ErrorCode.GeneralError, error));
            });
        });
    }
}
