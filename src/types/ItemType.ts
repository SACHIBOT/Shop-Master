import CategoryType from "./CategoryType"
import StockType from "./StockType"

interface ItemType {
    itemId: number,
    itemName: string,
    description: string,
    price: number,
    itemCategory: CategoryType,
    stock: StockType
}


export default ItemType;