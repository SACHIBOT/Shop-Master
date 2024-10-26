import ItemType from "./ItemType";

export interface SaleType {
    saleDate: string;
    userName: string;
}

export function saleCreation(userName: string, saleDate: string = new Date().toISOString()): SaleType {
    return {
        userName,
        saleDate,
    };
}

export interface SaleItemType {
    saleItemId: number;
    item: ItemType;
    quantity: number;
    price: number;
}

export interface SaleItemsType {
    saleId: number;
    saleDate: string;
    totalAmount: number;
    userId: number;
    saleItems: SaleItemType[];
}