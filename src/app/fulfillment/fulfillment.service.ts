import { Injectable } from '@nestjs/common';
import { ConfigService } from '../common/config/config.service';
import { Order } from '../order/order.entity';
import { User } from '../user/user.entity';
import { ShopifyOrderDto } from '../order/dto/shopify-order.dto';
import { InventoryItemDto } from '../order/dto/inventory-item.dto';
import { InventoryLvelsDto, InventoryLevel } from './dto/inventory-levels.dto';
import { LocationDto } from './dto/location.dto';
import Shopify = require('shopify-api-node');
import { ErrorResult } from '../common/error-manager/errors';

let shopify = null;

@Injectable()
export class FulfillmentService {
    constructor() {}

    async createFulfillment(order: Order, user: User, trackingNumber: string) {
        return new Promise(
            async (
                resolve: (result) => void,
                reject: (reason: ErrorResult) => void,
            ): Promise<void> => {
                shopify = new Shopify({
                    shopName: user.shopUrl,
                    accessToken: user.accessToken,
                });

                try {
                    // Query the order to see its line items
                    let orderShop: ShopifyOrderDto = await shopify.order.get(
                        order.orderId,
                    );

                    let variantsId: number[] = orderShop.line_items.map(
                        item => item.variant_id,
                    );

                    // Query the variant for its inventory item
                    let inventoryItems = await this.getInventoryItems(
                        variantsId,
                    );

                    let inventoryItemsId = inventoryItems.map(
                        item => item.inventory_item_id,
                    );

                    // Get the inventory levels
                    let inventoryLevels: InventoryLevel[] = await shopify.inventoryLevel.list(
                        {
                            inventory_item_ids: inventoryItemsId
                                .join(',')
                                .toString(),
                        },
                    );

                    let locations: LocationDto[] = await this.getLocations(
                        inventoryLevels,
                    );

                    let locationId: number = locations.find(
                        location => location.active == true,
                    ).id;

                    let params = {
                        location_id: locationId,
                        tracking_number: trackingNumber,
                        tracking_urls: [
                            'https://www.correos.cl/web/guest/seguimiento-en-linea',
                        ],
                        notify_customer: true,
                    };

                    let fulfilm = await shopify.fulfillment.create(
                        orderShop.id,
                        params,
                    );

                    resolve(fulfilm);
                } catch (error) {
                    reject(error);
                }
            },
        );
    }

    private async getLocations(
        inventoryLevels: InventoryLevel[],
    ): Promise<LocationDto[]> {
        let locationsId: number[] = inventoryLevels.map(
            (inventoryLvl: InventoryLevel) => inventoryLvl.location_id,
        );
        return Promise.all(
            locationsId.map(locationId => {
                return new Promise(
                    (
                        resolve: (result: LocationDto) => void,
                        reject: (reason: ErrorResult) => void,
                    ): void => {
                        shopify.location
                            .get(locationId)
                            .then((location: LocationDto) => {
                                resolve(location);
                            })
                            .catch(err => reject(err));
                    },
                );
            }),
        );
    }

    private async getInventoryItems(
        variantsId: number[],
    ): Promise<InventoryItemDto[]> {
        return Promise.all(
            variantsId.map(variantId => {
                return new Promise(
                    (
                        resolve: (result: InventoryItemDto) => void,
                        reject: (reason: ErrorResult) => void,
                    ): void => {
                        // let inventoryItems: InventoryItemDto[] = [];
                        // for (let i = 0; i < variantsId.length; i++) {
                        //     const variantId = variantsId[i];
                        shopify.productVariant
                            .get(variantId)
                            .then((inventoryItem: InventoryItemDto) => {
                                // inventoryItems.push(inventoryItem);
                                resolve(inventoryItem);
                            })
                            .catch(err => reject(err));
                        // }
                    },
                );
            }),
        );
    }
}
