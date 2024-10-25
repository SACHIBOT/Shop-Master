
import { useEffect, useRef, useState } from 'react';
import '../App.css'
import Nav from '../components/SideBarNav';
import axios, { AxiosError } from 'axios';
import ItemType from '../types/ItemType';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CategoryType from '../types/CategoryType';


function Items() {
    const [items, setItems] = useState<ItemType[]>([])
    const [itemName, setItemName] = useState<string>("")
    const [itemdescription, setItemDescription] = useState<string>("")
    const [itemPrice, setItemPrice] = useState<number>(0)
    const [itemCategoryId, setItemCategoryId] = useState<number>(0)
    const [itemNewQty, setItemNewQty] = useState<number>(0)

    const [itemToEdit, setItemToEdit] = useState<ItemType>()
    const [itemNameToEdit, setItemNameToEdit] = useState<string>("")
    const [itemdescriptionToEdit, setItemDescriptionToEdit] = useState<string>("")
    const [itemPriceToEdit, setItemPriceToEdit] = useState<number>(0)
    const [itemCategoryIdToEdit, setItemCategoryIdToEdit] = useState<number>(0)
    const [itemNewQtyToEdit, setItemNewQtyToEdit] = useState<number>(0)

    const [error, setError] = useState<string>("")
    const [updateError, setUpdateError] = useState<string>("")
    const [itemActionError, setItemActionError] = useState<string>("")

    const [categories, setCategories] = useState<CategoryType[]>([])

    const navigate = useNavigate();
    const { isAuthenticated, jwtToken, isAdmin, isManager } = useAuth();
    if (!isAuthenticated) {
        navigate("/")
    }

    const handleQuantityChange = (change: number) => {
        setItemNewQty((prevQuantity) => Math.max(0, prevQuantity + change));
    };

    const handleQuantityInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Math.max(0, Number(e.target.value));
        setItemNewQty(value);
    };

    const handlePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        setItemPrice(Number(e.target.value));
    };

    const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemCategoryId(parseInt(e.target.value));
    };


    const clearNewItemInfo = () => {
        setItemName("");
        setItemDescription("");
        setItemPrice(0);
        setItemCategoryId(0);
        setItemNewQty(0);
    }

    const clearItemUpdateInfo = () => {
        setItemNameToEdit("")
        setItemDescriptionToEdit("")
        setItemCategoryIdToEdit(0)
        setItemNewQtyToEdit(0)
        setItemPriceToEdit(0)
    }

    const updateFormRef = useRef<HTMLDivElement>(null);

    const config = {
        headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        }
    }


    async function loadCategories() {
        const response = await axios.get("http://localhost:8080/categories", config);
        setCategories(response.data);
    }



    async function loadItems() {
        const response = await axios.get("http://localhost:8080/items", config);
        setItems(response.data);
    }

    async function addItem(event: any) {
        event.preventDefault();
        try {
            const data = {
                itemName: itemName,
                description: itemdescription,
                price: itemPrice,
                itemCategoryId: itemCategoryId
            }
            const newItem = await axios.post("http://localhost:8080/manager/items", data, config);
            if (itemNewQty > 0 && newItem.data?.itemId) {
                const data2 = {
                    itemId: newItem.data.itemId,
                    quantity: itemNewQty
                }
                await axios.put("http://localhost:8080/manager/stocks", data2, config)
            }
            loadItems()
            clearNewItemInfo()
        } catch (error) {
            if (error instanceof AxiosError) {
                setError(error.response?.data?.message || 'Error adding item. Try again later.');
            } else {
                setError((error as Error).message);
            }
        }
    }


    async function deleteItem(id: Number) {
        try {

            await axios.delete(`http://localhost:8080/manager/items/${id}`, config);
            loadItems()
        } catch (error) {
            if (error instanceof AxiosError) {
                setItemActionError(error.response?.data?.message || 'Error deleting item. Try again later.');
            } else {
                setItemActionError((error as Error).message);
            }
        }
    }

    async function updateItem(event: any) {
        event.preventDefault();
        try {
            const data = {
                itemName: itemNameToEdit,
                description: itemdescriptionToEdit,
                price: itemPriceToEdit,
                itemCategoryId: itemCategoryIdToEdit
            }
            const updatedItem = await axios.put(`http://localhost:8080/manager/items/${itemToEdit?.itemId}`, data, config);
            if (itemNewQtyToEdit > 0 && updatedItem.data?.itemId) {
                const data2 = {
                    itemId: updatedItem.data.itemId,
                    quantity: itemNewQtyToEdit
                }
                await axios.put("http://localhost:8080/manager/stocks", data2, config)
            }
            loadItems()
            clearItemUpdateInfo()
        } catch (error) {
            if (error instanceof AxiosError) {
                setUpdateError(error.response?.data?.message || 'Error updating item. Try again later.');
            } else {
                setUpdateError((error as Error).message);
            }
        }
    }

    function handleItemName(event: any) {
        setItemName(event.target.value)
    }
    function handleItemDescription(event: any) {
        setItemDescription(event.target.value)
    }

    const handleItemNameToEdit = (event: any) => {
        setItemNameToEdit(event.target.value)
    }
    const handleItemDescriptionToEdit = (event: any) => {
        setItemDescriptionToEdit(event.target.value)
    }
    const handleItemQuantityToEdit = (event: any) => {
        setItemNewQtyToEdit(event.target.value)
    }
    const handleItemPriceToEdit = (event: any) => {
        const price = Number(event.target.value);
        setItemPriceToEdit(price)
    }
    const handleItemCategoryToEdit = (event: any) => {
        setItemCategoryIdToEdit(event.target.value)
    }


    const handleItemToEdit = (item: ItemType) => {
        setItemToEdit(item)

        setItemNameToEdit(item.itemName)
        setItemDescriptionToEdit(item.description)
        setItemCategoryIdToEdit(item.itemCategory.itemCategoryId)
        setItemNewQtyToEdit(0)
        setItemPriceToEdit(item.price)
    }

    function handleUpdateItemClose() {
        setItemToEdit(undefined)
        clearItemUpdateInfo()
    }
    useEffect(function () {
        itemToEdit &&
            updateFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [itemToEdit])


    useEffect(function () {
        loadItems()
        loadCategories()
    }, [])

    return (
        <>
            <Nav />


            <div className="p-4 dark:bg-slate-800  sm:ml-64">
                <div className="p-4  rounded-lg dark:border-gray-700 mt-14">


                    {
                        (isManager || isAdmin) &&
                        <div className="flex items-center justify-center p-5 mb-5">
                            <form className="w-[650px] border border border-slate-200 dark:border-slate-700  px-4 py-3 rounded-lg">
                                <h2 className="text-xl font-medium mb-4">Add Item</h2>

                                <div className="grid  grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-slate-600 dark:text-slate-100 block mb-3 ">Enter item name</label>
                                        <input type="text" className="block w-full p-2 border bg-slate-200 dark:border-slate-600   dark:bg-slate-700 border-slate-300 rounded-lg text-slate-600 dark:text-slate-200 text-sm mb-4" onChange={handleItemName} required />
                                    </div>
                                    <div> <label className="text-sm text-slate-600  dark:text-slate-100 block mb-3 ">Enter item description</label>
                                        <input type="text" className="block w-full p-2 border bg-slate-200 dark:border-slate-600  dark:bg-slate-700 border-slate-300 rounded-lg text-slate-600 dark:text-slate-200 text-sm mb-4" onChange={handleItemDescription} required />
                                    </div>
                                </div>
                                <div className="grid  grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm text-slate-600 dark:text-slate-100 block mb-3">Select item category</label>
                                        <select
                                            className="block w-full p-2 border bg-slate-200 dark:border-slate-600 dark:bg-slate-700 border-slate-300 rounded-lg text-slate-600 dark:text-slate-200 text-sm mb-4"
                                            onChange={handleCategorySelect}
                                            required
                                        >
                                            {
                                                categories.map((category) => (<option key={category.itemCategoryId} value={category.itemCategoryId}>{category.categoryName}</option>))
                                            }
                                        </select>
                                    </div>

                                    <div>
                                        <label className="text-sm text-slate-600 dark:text-slate-100 block mb-3">Enter item price (LKR)</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-600 dark:text-slate-200">LKR</span>
                                            <input
                                                type="number"
                                                className="block w-full pl-12 p-2 border bg-slate-200 dark:border-slate-600 dark:bg-slate-700 border-slate-300 rounded-lg text-slate-600 dark:text-slate-200 text-sm mb-4"
                                                onChange={handlePrice}
                                                min="0"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm text-slate-600 dark:text-slate-100 block mb-3">Enter Quantity you add</label>
                                        <input
                                            type="number"
                                            className="block w-full  p-2 border bg-slate-200 dark:border-slate-600 dark:bg-slate-700 border-slate-300 rounded-lg text-slate-600 dark:text-slate-200 text-sm mb-4"
                                            onChange={handleQuantityInput}
                                            min="0"
                                            required
                                        />
                                        {/* <div className="flex items-center">
                                                <button
                                                    type="button"
                                                    className="bg-slate-200 border-y   dark:border-slate-600 dark:bg-slate-700 border-slate-300  text-slate-600 dark:text-slate-200 rounded-l-lg px-3 h-9"
                                                    onClick={() => handleQuantityChange(-1)}
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    className="block w-16 h-9 px-3 bg-slate-200 border   dark:border-slate-600 dark:bg-slate-700 border-slate-300 text-center text-slate-600 dark:text-slate-200 text-sm"
                                                    value={itemNewQty}
                                                    onChange={handleQuantityInput}
                                                    min="0"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    className="bg-slate-200 border-y   dark:border-slate-600 dark:bg-slate-700 border-slate-300  text-slate-600 dark:text-slate-200  rounded-r-lg px-3 h-9"
                                                    onClick={() => handleQuantityChange(1)}
                                                >
                                                    +
                                                </button>
                                            </div> */}
                                    </div>
                                </div>

                                <button type="submit" className="py-2 px-3 mt-5 rounded-lg bg-sky-950 text-sm text-white hover:bg-sky-850  dark:text-sky-950 dark:bg-slate-200 dark:hover:bg-slate-400" onClick={addItem}>Add Item</button>
                                {error && <p className="text-center text-red-500 mt-3 text-sm b-4">{error}</p>}
                            </form>
                        </div>
                    }
                    <div className="flex p-5">
                        <span className="self-center text-2xl font-bold sm:text-2xl  whitespace-nowrap  text-sky-900 dark:text-white">Items</span>
                    </div>

                    <div className="flex items-center justify-center p-5 mb-5 rounded-lg bg-blue-100 dark:bg-slate-900">


                        <div className="relative overflow-x-auto">

                            <table className="table-auto w-full  rounded-lg ">
                                <thead>
                                    <tr className="text-sm font-medium   border-b border-sky-900 dark:border-sky-100  text-sky-900 dark:text-slate-50">
                                        <th className="p-2 border-r border-sky-900  dark:border-sky-100 text-center">Item</th>
                                        <th className="p-2 border-r border-sky-900  dark:border-sky-100 text-center">Description</th>
                                        <th className="p-2 border-r border-sky-900  dark:border-sky-100 text-center">Category</th>
                                        <th className="p-2 border-r border-sky-900  dark:border-sky-100 text-center">Price</th>
                                        <th className="p-2 border-r border-sky-900  dark:border-sky-100 text-center">Quantity on hand</th>
                                        {(isManager || isAdmin) && (<th className="p-2 text-center">Action</th>)}
                                    </tr>

                                </thead>
                                <tbody>
                                    {items.map((item, index) => (
                                        <tr key={index} className={` ${index !== items.length - 1 ? ' border-b border-sky-900  dark:border-sky-100 ' : ''}`}>
                                            <td className="p-2 text-slate-700 dark:text-slate-100 border-r border-sky-900  dark:border-sky-100  text-center">{item.itemName}</td>
                                            <td className="p-2 text-slate-700  dark:text-slate-100 border-r border-sky-900  dark:border-sky-100 text-center">{item.description}</td>
                                            <td className="p-2 text-slate-700   dark:text-slate-100 border-r border-sky-900  dark:border-sky-100 text-center">{item.itemCategory.categoryName}</td>
                                            <td className="p-2 text-slate-700  dark:text-slate-100  border-r border-sky-900  dark:border-sky-100 text-center">{item.price}</td>
                                            <td className="p-2 text-slate-700  dark:text-slate-100  border-r border-sky-900 dark:border-sky-100  text-center">{`${item.stock.quantity}`}</td>
                                            {(isManager || isAdmin) && <td className="p-2 text-slate-700  dark:text-slate-100 text-center">
                                                <button type="button" className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
                                                    onClick={() => handleItemToEdit(item)}
                                                >Edit</button>
                                                <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                                    onClick={() => deleteItem(item.itemId)}
                                                >Delete</button>
                                                {itemActionError && <p className="text-center text-red-500 mt-3 text-sm b-4">{itemActionError}</p>}

                                            </td>}
                                        </tr>
                                    ))
                                    }

                                </tbody>
                            </table> </div>

                    </div>

                    {
                        itemToEdit && (isManager || isAdmin) && (
                            <div ref={updateFormRef} className="flex items-center justify-center p-5 mb-5">
                                <form className="w-[650px] border border-slate-200 dark:border-slate-600 px-4 py-3 rounded-lg relative">
                                    <button type="button" className="absolute top-2 right-2 p-1 text-slate-600 hover:text-red-600" onClick={handleUpdateItemClose}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6" >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <h2 className="text-xl font-medium mb-4">Update Item</h2>

                                    <div className="grid  grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-slate-600 dark:text-slate-100 block mb-3 ">Enter item name</label>
                                            <input type="text" className="block w-full p-2 border bg-slate-200 dark:border-slate-600   dark:bg-slate-700 border-slate-300 rounded-lg text-slate-600 dark:text-slate-200 text-sm mb-4" value={itemNameToEdit} onChange={handleItemNameToEdit} required />
                                        </div>
                                        <div> <label className="text-sm text-slate-600  dark:text-slate-100 block mb-3 ">Enter item description</label>
                                            <input type="text" className="block w-full p-2 border bg-slate-200 dark:border-slate-600  dark:bg-slate-700 border-slate-300 rounded-lg text-slate-600 dark:text-slate-200 text-sm mb-4" value={itemdescriptionToEdit} onChange={handleItemDescriptionToEdit} required />
                                        </div>
                                    </div>
                                    <div className="grid  grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-sm text-slate-600 dark:text-slate-100 block mb-3">Select item category</label>
                                            <select
                                                className="block w-full p-2 border bg-slate-200 dark:border-slate-600 dark:bg-slate-700 border-slate-300 rounded-lg text-slate-600 dark:text-slate-200 text-sm mb-4"
                                                value={itemCategoryIdToEdit}
                                                onChange={handleItemCategoryToEdit}
                                                required
                                            >
                                                {
                                                    categories.map((category) => (<option key={category.itemCategoryId} value={category.itemCategoryId}>{category.categoryName}</option>))
                                                }
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-sm text-slate-600 dark:text-slate-100 block mb-3">Enter item price (LKR)</label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-600 dark:text-slate-200">LKR</span>
                                                <input
                                                    type="number"
                                                    className="block w-full pl-12 p-2 border bg-slate-200 dark:border-slate-600 dark:bg-slate-700 border-slate-300 rounded-lg text-slate-600 dark:text-slate-200 text-sm mb-4"
                                                    value={itemPriceToEdit}
                                                    onChange={handleItemPriceToEdit}
                                                    min="0"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm text-slate-600 dark:text-slate-100 block mb-3">Enter quantity you add now</label>
                                            <input
                                                type="number"
                                                className="block w-full  p-2 border bg-slate-200 dark:border-slate-600 dark:bg-slate-700 border-slate-300 rounded-lg text-slate-600 dark:text-slate-200 text-sm mb-4"
                                                value={itemNewQtyToEdit}
                                                onChange={handleItemQuantityToEdit}
                                                min="0"
                                                required
                                            />
                                            {/* <div className="flex items-center">
                                                <button
                                                    type="button"
                                                    className="bg-slate-200 border-y   dark:border-slate-600 dark:bg-slate-700 border-slate-300  text-slate-600 dark:text-slate-200 rounded-l-lg px-3 h-9"
                                                    onClick={() => handleQuantityChange(-1)}
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    className="block w-16 h-9 px-3 bg-slate-200 border   dark:border-slate-600 dark:bg-slate-700 border-slate-300 text-center text-slate-600 dark:text-slate-200 text-sm"
                                                    value={itemNewQty}
                                                    onChange={handleQuantityInput}
                                                    min="0"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    className="bg-slate-200 border-y   dark:border-slate-600 dark:bg-slate-700 border-slate-300  text-slate-600 dark:text-slate-200  rounded-r-lg px-3 h-9"
                                                    onClick={() => handleQuantityChange(1)}
                                                >
                                                    +
                                                </button>
                                            </div>*/}
                                        </div>
                                    </div>

                                    <button type="submit" className="py-2 px-3 mt-5 rounded-lg bg-sky-950 text-sm text-white hover:bg-sky-850  dark:text-sky-950 dark:bg-slate-200 dark:hover:bg-slate-400" onClick={updateItem}>Update Item</button>
                                    {updateError && <p className="text-center text-red-500 mt-3 text-sm b-4">{updateError}</p>}
                                </form>
                            </div>
                        )
                    }

                </div>
            </div>

        </>
    )
}

export default Items;

