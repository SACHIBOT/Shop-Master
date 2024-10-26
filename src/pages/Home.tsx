import { useEffect, useState } from "react";
import Nav from "../components/SideBarNav";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ItemType from "../types/ItemType";
import axios, { AxiosError } from "axios";
import { saleCreation, SaleItemsType, SaleItemType } from "../types/SaleType";
import Bill from "../components/Bill";


export default function Home() {
    const [error, setError] = useState<string>("")
    const [itemIderror, setItemIderror] = useState<string>("")
    const [itemActionError, setItemActionError] = useState<string>("")

    const [saleItems, setSaleItems] = useState<SaleItemType[]>([])

    const [itemId, setItemId] = useState<number>(0)
    const [quantity, setQuantity] = useState<number>(0)
    const [item, setItem] = useState<ItemType>()

    const [saleId, setSaleId] = useState<number>(0)

    const [total, setTotal] = useState<number>(0)
    const [cash, setCash] = useState<number>(0)
    const [balance, setBalance] = useState<number>(0)

    const [showBill, setShowBill] = useState(false);

    const handlePlaceOrder = () => {
        setShowBill(true);
    };

    const navigate = useNavigate();
    const { isAuthenticated, jwtToken, isAdmin, isManager, username } = useAuth();
    if (!isAuthenticated) {
        navigate("/")
    }


    const config = {
        headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        }
    }
    function clearAll() {
        createNewSale()
        setItemId(0)
        setQuantity(0)
        setItem(undefined)
        setError("")
        setSaleId(0)
        setTotal(0)
        setCash(0)
        setBalance(0)
        setShowBill(false)
        setItemIderror("")
        setItemActionError("")
        setSaleItems([])
    }
    async function loadItem() {
        try {
            const response = await axios.get(`http://localhost:8080/items/${itemId}`, config);
            setItem(response.data);
            setItemIderror("")
        } catch (error) {
            if (error instanceof AxiosError) {
                setItemIderror(error.response?.data || 'Error adding item. Try again later.');
            } else {
                setItemIderror((error as Error).message);
            }
        }
    }

    async function loadSaleItems() {
        try {
            const response = await axios.get(`http://localhost:8080/sale/${saleId}`, config);
            setSaleItems(response.data?.saleItems);
            setTotal(response.data?.totalAmount);
        } catch (error) {
        }
    }
    const handleItemId = (event: any) => {
        setItemId(Number(event.target.value))
    }

    const handleQuantity = (event: any) => {
        const inputQuantity = Number(event.target.value);
        if (item) {
            if (item.stock.quantity as number < inputQuantity) {
                setItemIderror("You don't have enough stock for this");
            } else {
                setItemIderror("");
                setQuantity(inputQuantity);
            }
        }
    }

    const handleCash = (event: any) => {
        const newCash = Number(event.target.value);
        setCash(newCash);
        setBalance(newCash - total);
    }

    const createNewSale = async () => {
        const sale = saleCreation(username)
        const response = await axios.post("http://localhost:8080/sale", sale, config);
        setSaleId(response.data?.saleId)
    }


    const addItemToSale = async () => {

        try {
            await axios.post(`http://localhost:8080/sale/${saleId}`,
                {
                    itemId: itemId,
                    quantity: quantity
                }, config);
            loadSaleItems();
            setItemId(0);
            setItem(undefined)
            setItemIderror("")
        } catch (error) {
            if (error instanceof AxiosError) {
                setItemIderror(error.response?.data || 'Error adding item. Try again later.');
            } else {
                setItemIderror((error as Error).message);
            }
        }


    }

    async function deleteSaleItem(saleItemId: Number) {
        try {

            await axios.delete(`http://localhost:8080/sale/${saleId}/saleitem/${saleItemId}`, config);
            loadSaleItems()
            setItemActionError("")
        } catch (error) {
            if (error instanceof AxiosError) {
                setItemActionError(error.response?.data || 'Error deleting saleitem. Try again later.');
            } else {
                setItemActionError((error as Error).message);
            }
        }
    }

    useEffect(function () {
        if (itemId > 0) {
            loadItem()
        }
    }, [itemId])




    useEffect(function () {
        createNewSale()
    }, [])
    return (
        <>
            <Nav />
            <div className="p-4 dark:bg-slate-800  sm:ml-64">
                <div className="p-4  rounded-lg dark:border-gray-700 mt-14">


                    {showBill ? (
                        <Bill saleItems={saleItems} total={total} cash={cash} balance={balance} />
                    ) : (

                        <div>
                            <div className="flex items-center justify-center p-5 mb-5">
                                <form className="w-[650px] border border border-slate-200 dark:border-slate-700  px-4 py-3 rounded-lg">
                                    <div className="relative"> <h2 className="text-xl font-medium mb-4">Sale</h2>
                                        <button
                                            type="button"
                                            className="py-2 px-3 rounded-lg flex items-center justify-center absolute inset-y-0 right-0 bg-sky-950 text-sm text-white hover:bg-sky-850 dark:text-sky-950 dark:bg-slate-200 dark:hover:bg-slate-400"
                                            onClick={clearAll}
                                        >
                                            New sale
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 ml-2"   >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div>
                                        {itemIderror && <p className="text-center text-red-500 text-sm b-4">{itemIderror}</p>}
                                        <div>
                                            <label className="text-sm text-slate-600 dark:text-slate-100 block mb-3 ">Enter item code</label>
                                            <input type="number" min="0" className="block w-full p-2 border bg-slate-200 dark:border-slate-600   dark:bg-slate-700 border-slate-300 rounded-lg text-slate-600 dark:text-slate-200 text-sm mb-4" onChange={handleItemId} required />
                                        </div><div>
                                            <label className="text-sm text-slate-600 dark:text-slate-100 block mb-3 ">Enter quantity buy</label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 pr-7 right-0 flex items-center  text-slate-600 dark:text-slate-200">{item && item.stock && item.stock.unit ? item.stock.unit : ''}</span>
                                                <input type="number" min="0" className="block w-full p-2 border bg-slate-200 dark:border-slate-600   dark:bg-slate-700 border-slate-300 rounded-lg text-slate-600 dark:text-slate-200 text-sm mb-4 " onChange={handleQuantity} required />
                                            </div>
                                        </div>
                                        <div> <label className="text-sm text-slate-600  dark:text-slate-100 block mb-3 ">Item name</label>
                                            <input type="text" className="block w-full p-2 border bg-slate-200 dark:border-slate-600  dark:bg-slate-700 border-slate-300 rounded-lg text-slate-600 dark:text-slate-200 text-sm mb-4" value={item && item.itemName} disabled />
                                        </div>
                                        <div>
                                            <label className="text-sm text-slate-600 dark:text-slate-100 block mb-3 ">Item description</label>
                                            <input type="text" className="block w-full p-2 border bg-slate-200 dark:border-slate-600   dark:bg-slate-700 border-slate-300 rounded-lg text-slate-600 dark:text-slate-200 text-sm mb-4" value={item && item.description} disabled />
                                        </div>
                                        <div>
                                            <label className="text-sm text-slate-600  dark:text-slate-100 block mb-3 ">Item price</label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-600 dark:text-slate-200">LKR</span>
                                                <input type="number" className="block pl-12  w-full p-2 border bg-slate-200 dark:border-slate-600  dark:bg-slate-700 border-slate-300 rounded-lg text-slate-600 dark:text-slate-200 text-sm mb-4" value={item && item.price} disabled />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm text-slate-600  dark:text-slate-100 block mb-3 ">Item total</label>
                                            <input type="number" className="block w-full p-2 border bg-slate-200 dark:border-slate-600  dark:bg-slate-700 border-slate-300 rounded-lg text-slate-600 dark:text-slate-200 text-sm mb-4" value={item && (item.price * quantity)} disabled />
                                        </div>
                                    </div>
                                    <button type="button" className="py-2 px-3 rounded-lg bg-sky-950 text-sm text-white hover:bg-sky-850  dark:text-sky-950 dark:bg-slate-200 dark:hover:bg-slate-400" onClick={addItemToSale}>Place Item</button>

                                </form>
                            </div>

                            {
                                saleItems && saleItems.length > 0 && <div>
                                    <div className="flex p-5">
                                        <span className="self-center text-2xl font-bold sm:text-2xl  whitespace-nowrap  text-sky-900 dark:text-white">Sale Items</span>
                                    </div>
                                    <div className="flex items-center justify-center p-5 mb-5 rounded-lg bg-blue-100 dark:bg-slate-900 relative">
                                        <div className="relative overflow-x-auto">

                                            <table className="table-auto w-full  rounded-lg ">
                                                <thead>
                                                    <tr className="text-sm font-medium   border-b border-sky-900 dark:border-sky-100  text-sky-900 dark:text-slate-50">
                                                        <th className="p-2   dark:border-sky-100 text-center">Item Code</th>
                                                        <th className="p-2   dark:border-sky-100 text-center">Item Name</th>
                                                        <th className="p-2   dark:border-sky-100 text-center">Item Price</th>
                                                        <th className="p-2  dark:border-sky-100 text-center">Quantity</th>
                                                        <th className="p-2   dark:border-sky-100 text-center">Item Total</th>
                                                        <th className="p-2 text-center">Action</th>
                                                    </tr>

                                                </thead>
                                                <tbody>
                                                    {saleItems.map((saleItem, index) => (
                                                        <tr key={index} className=" border-b border-sky-900  dark:border-sky-100">
                                                            <td className="p-2 text-slate-700 dark:text-slate-100   dark:border-sky-100  text-center">
                                                                {saleItem.item.itemId}
                                                            </td>

                                                            <td className="p-2 text-slate-700  dark:text-slate-100   dark:border-sky-100 text-center">
                                                                {saleItem.item.itemName}
                                                            </td>
                                                            <td className="p-2 text-slate-700  dark:text-slate-100  dark:border-sky-100 text-center">
                                                                {saleItem.price}
                                                            </td>

                                                            <td className="p-2 text-slate-700 dark:text-slate-100   dark:border-sky-100 text-center">
                                                                <div className="relative">
                                                                    <div className="flex items-center justify-center">
                                                                        <span className="absolute inset-y-0 right-1 right-0 text-slate-600 dark:text-slate-200">
                                                                            {saleItem.item?.stock?.unit ? saleItem.item.stock.unit : ''}
                                                                        </span>
                                                                        <div>{saleItem.quantity}</div>
                                                                    </div>
                                                                </div>
                                                            </td>


                                                            <td className="p-2 text-slate-700  dark:text-slate-100    dark:border-sky-100 text-center"> {saleItem.quantity * saleItem.price}</td>
                                                            <td className="p-2 text-slate-700  dark:text-slate-100   dark:border-sky-100 text-center">

                                                                <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                                                    onClick={() => deleteSaleItem(saleItem.saleItemId)}
                                                                >Delete</button>

                                                            </td>

                                                        </tr>
                                                    ))
                                                    }

                                                </tbody>
                                            </table>

                                            {itemActionError &&
                                                <p className="text-center text-red-500 mt-3 text-sm p-4">{itemActionError}</p>}

                                            <div className="grid mt-3 items-center  grid-cols-2 gap-4 border-b border-sky-900  dark:border-sky-100">
                                                <label className="text-sm text-slate-600 dark:text-slate-100 block mb-3 ">Total  LKR.</label>
                                                <input type="number" className="block pl-3  w-full p-2 border bg-slate-200 dark:border-slate-600   dark:bg-slate-700 border-slate-300 rounded-lg text-slate-600 dark:text-slate-200 text-sm mb-3" disabled value={total} />

                                            </div>
                                            <div className="grid mt-3 items-center grid-cols-2 gap-4 border-b border-sky-900  dark:border-sky-100">
                                                <label className="text-sm text-slate-600  dark:text-slate-100 block mb-3 ">Cash  LKR.</label>
                                                <input type="number" className="block pl-3  w-full p-2 border bg-slate-200 dark:border-slate-600   dark:bg-slate-700 border-slate-300 rounded-lg text-slate-600 dark:text-slate-200 text-sm mb-3" required onChange={handleCash} />

                                            </div>
                                            <div className="grid mt-3 items-center grid-cols-2 gap-4 border-b border-sky-900  dark:border-sky-100">
                                                <label className="text-sm text-slate-600  dark:text-slate-100 block mb-3 ">Balance  LKR.</label>
                                                <input
                                                    type="number"
                                                    className="block pl-3 w-full p-2 border bg-slate-200 dark:border-slate-600 dark:bg-slate-700 border-slate-300 rounded-lg text-slate-600 dark:text-slate-200 text-sm mb-3"
                                                    disabled
                                                    value={balance}
                                                />
                                            </div>
                                            <button type="button" className="py-2 px-3 my-4  rounded-lg bg-sky-950 text-sm text-white hover:bg-sky-850  dark:text-sky-950 dark:bg-slate-200 dark:hover:bg-slate-400" onClick={handlePlaceOrder}>Place Order</button>


                                        </div>

                                    </div>
                                </div>
                            }

                        </div >

                    )}
                    {
                        showBill && <button type="button" className="py-2 px-3 m-4  rounded-lg bg-sky-950 text-sm text-white hover:bg-sky-850  dark:text-sky-950 dark:bg-slate-200 dark:hover:bg-slate-400" onClick={() => setShowBill(false)}>Close bill</button>
                    }
                </div >  </div >
        </>
    )
}