export class InventoryLvelsDto {
    inventory_levels: InventoryLevel[];
}

export class InventoryLevel {
    inventory_item_id: number;
    location_id: number;
    available: number;
    updated_at: Date;
    admin_graphql_api_id: string;
}
