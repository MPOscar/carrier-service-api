import { Injectable } from '@nestjs/common';
import { ConfigService } from '../common/config/config.service';
import { Order } from '../order/order.entity';
import { User } from '../user/user.entity';
import { ShopifyOrderDto } from '../order/dto/shopify-order.dto';
import { InventoryItemDto } from '../order/dto/inventory-item.dto';
import { InventoryLvelsDto, InventoryLevel } from './dto/inventory-levels.dto';
import { LocationDto } from './dto/location.dto';
import Shopify = require('shopify-api-node');

let shopify = null;

@Injectable()
export class FulfillmentService {
    constructor() {}

    async createFulfillment(order: Order, user: User, trackingNumber: string) {
        shopify = new Shopify({
            shopName: user.shopUrl,
            accessToken: user.accessToken,
        });

        // Query the order to see its line items
        shopify.order
            .get(order.orderId)
            .then((orderShop: ShopifyOrderDto) => {
                let variantsId: number[] = orderShop.line_items.map(
                    item => item.variant_id,
                );

                // Query the variant for its inventory item
                let inventoryItems: InventoryItemDto[] = this.getInventoryItems(
                    variantsId,
                );

                let inventoryItemsId = inventoryItems.map(
                    item => item.inventory_item_id,
                );

                // Get the inventory levels
                shopify.inventoryLevel
                    .list({
                        inventory_item_ids: inventoryItemsId
                            .join(',')
                            .toString(),
                    })
                    .then((inventoryLevels: InventoryLvelsDto) => {
                        let locationId: number = this.getLocationActive(
                            inventoryLevels,
                        );

                        // TODO: test fulfillment
                        if (locationId != 0) {
                            let params = {
                                fulfillment: {
                                    location_id: locationId,
                                    tracking_number: '123456789',
                                    tracking_urls: [
                                        'https://www.correos.cl/web/guest/seguimiento-en-linea',
                                    ],
                                    notify_customer: true,
                                },
                            };
                            shopify.fulfillment.create(orderShop.id, params);
                        }
                    })
                    .cath(err => console.log(err));
            })
            .cath(err => console.log(err));
    }

    private getLocationActive(inventoryLevels: InventoryLvelsDto) {
        let locationsId: number[] = inventoryLevels.inventory_levels.map(
            (inventoryLvl: InventoryLevel) => inventoryLvl.location_id,
        );
        for (let i = 0; i < locationsId.length; i++) {
            const loctatId = locationsId[i];
            shopify.location
                .get(loctatId)
                .then((location: LocationDto) => {
                    if (location.active) {
                        return location.id;
                    }
                })
                .cath(err => console.log(err));
        }
        return 0;
    }

    private getInventoryItems(variantsId: number[]) {
        let inventoryItems: InventoryItemDto[] = [];
        for (let i = 0; i < variantsId.length; i++) {
            const variatId = variantsId[i];
            shopify.productVariant
                .get(variatId)
                .then((inventoryItem: InventoryItemDto) => {
                    inventoryItems.push(inventoryItem);
                })
                .cath(err => console.log(err));
        }
        return inventoryItems;
    }
}
