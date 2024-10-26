import { useNavigate } from "react-router-dom";
import Nav from "../components/SideBarNav";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { SaleItemsType } from "../types/SaleType";
import UserType from "../types/UserType";

export default function Sales() {
    const [sales, setSales] = useState<SaleItemsType[]>([])
    const [users, setUsers] = useState<UserType[]>([])

    const navigate = useNavigate();
    const { isAuthenticated, jwtToken, isAdmin, isManager } = useAuth();
    if (!isAuthenticated) {
        navigate("/")
    }

    const config = {
        headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json'
        }
    }

    const loadSales = async () => {
        try {
            const response = await axios.get("http://localhost:8080/manager/sales", config);
            setSales(response.data);
        } catch (err) {

        }
    }

    const getUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/admin/allusers', config);
            setUsers(response.data);
        } catch (err) {

        }
    };

    useEffect(function () {
        loadSales()
        getUsers()
    }, [])

    return (
        <>
            <Nav />

            <div className="p-4 dark:bg-slate-800 sm:ml-64">
                <div className="p-4 rounded-lg dark:border-gray-700 mt-14">
                    <div className="flex items-center justify-center p-5 mb-5 rounded-lg bg-blue-100 dark:bg-slate-900">
                        {
                            (isAdmin || isManager) && <div className="relative overflow-x-auto">
                                <table className="table-auto w-full rounded-lg">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left">Sale ID</th>
                                            <th className="px-4 py-2 text-left">Date</th>
                                            <th className="px-4 py-2 text-left">Total Amount</th>
                                            <th className="px-4 py-2 text-left">Placed By</th>
                                            <th className="px-4 py-2 text-left">Item</th>
                                            <th className="px-4 py-2 text-left">Item Price</th>
                                            <th className="px-4 py-2 text-left">Qty</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sales.map((sale, index) => (
                                            <tr
                                                key={index}
                                                className={`${index !== sales.length - 1 ? 'border-b border-sky-900 dark:border-sky-100' : ''}`}
                                            >
                                                <td className="px-4 py-2">{sale.saleId}</td>
                                                <td className="px-4 py-2">{new Date(sale.saleDate).toLocaleDateString()}</td>
                                                <td className="px-4 py-2">LKR {sale.totalAmount.toFixed(2)}</td>
                                                <td className="px-4 py-2">{users.find((user) => user.userId === sale.userId)?.username || 'User not found'}</td>

                                                <td className="py-2">
                                                    {sale.saleItems.map((item, i) => (
                                                        <tr key={i} className={`${i !== sale.saleItems.length - 1 ? 'border-b border-slate-600 dark:border-slate-300' : ''}`}>
                                                            <div key={i} className="px-4  py-2">
                                                                {item.item.itemName}
                                                            </div>
                                                        </tr>
                                                    ))}
                                                </td>
                                                <td className="py-2">
                                                    {sale.saleItems.map((item, i) => (
                                                        <tr key={i} className={`${i !== sale.saleItems.length - 1 ? 'border-b border-slate-600 dark:border-slate-300' : ''}`}>
                                                            <div key={i} className="px-4 py-2">

                                                                LKR. {item.price.toFixed(2)}
                                                            </div>
                                                        </tr>
                                                    ))}
                                                </td>
                                                <td className="py-2">
                                                    {sale.saleItems.map((item, i) => (
                                                        <tr key={i} className={`${i !== sale.saleItems.length - 1 ? 'border-b border-slate-600 dark:border-slate-300' : ''}`}>
                                                            <div key={i} className="px-4  py-2">
                                                                {item.quantity}
                                                            </div>
                                                        </tr>
                                                    ))}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    );

}