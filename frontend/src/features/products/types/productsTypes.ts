export type Products = {
    products_id: number,
    name: string,
    price_cost: number,
    price_sale: number,
    price_wholesale?: number,
    inventory: number,
    inventory_min: number
}

export type CreateProducts = {
    name: string,
    price_cost: number,
    price_sale: number,
    price_wholesale?: number,
    inventory: number,
    inventory_min: number
}