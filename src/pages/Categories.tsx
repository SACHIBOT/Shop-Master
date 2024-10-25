
import { useEffect, useRef, useState } from 'react';
import '../App.css'
import Nav from '../components/SideBarNav';
import axios, { AxiosError } from 'axios';
import CategoryType from '../types/CategoryType';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ItemType from '../types/ItemType';
function Categories() {
    const [categoriess, setCategories] = useState<CategoryType[]>([])
    const [categoryItems, setCategoryItems] = useState<ItemType[]>([])
    const [categoryName, setCategoryName] = useState<string>("")
    const [categorydescription, setCategoryDescription] = useState<string>("")

    const [categoryToUpdate, setCategoryToUpdate] = useState<CategoryType>();
    const [categoryNameToUpdate, setCategoryNameToUpdate] = useState<string>("")
    const [categorydescriptionToUpdate, setCategoryDescriptionToUpdate] = useState<string>("")
    const [categoryIdToUpdate, setCategoryIdToUpdate] = useState<number>(0)

    const [error, setError] = useState<string>("")
    const [updateError, setUpdateError] = useState<string>("")
    const [itemsError, setItemsError] = useState<string>("")


    const navigate = useNavigate();
    const { isAuthenticated, jwtToken, isAdmin, isManager } = useAuth();
    if (!isAuthenticated) {
        navigate("/")
    }
    const updateFormRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<HTMLDivElement>(null);

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

    async function loadCategoriesById(id: number) {
        const response = await axios.get(`http://localhost:8080/items/category/${id}`, config);
        setCategoryItems(response.data);
        if (response.data.length === 0) {
            setItemsError("No items found for this category")
        }
    }
    async function addCategory(event: any) {
        event.preventDefault();
        try {

            await axios.post("http://localhost:8080/manager/categories", { categoryName: categoryName, description: categorydescription }, config);
            loadCategories()
            setCategoryName("")
            setCategoryDescription("")
        } catch (error) {
            if (error instanceof AxiosError) {
                setError(error.response?.data?.message || 'Error adding category. Try again later.');
            } else {
                setError((error as Error).message);
            }
        }
    }

    async function updateCategory(event: any) {
        event.preventDefault();
        try {

            await axios.put(`http://localhost:8080/manager/categories/${categoryIdToUpdate}`, { categoryName: categoryNameToUpdate, description: categorydescriptionToUpdate }, config);
            loadCategories()
            setCategoryIdToUpdate(0)
            setCategoryNameToUpdate("")
            setCategoryDescriptionToUpdate("")
            setCategoryToUpdate(undefined)
        } catch (error) {
            if (error instanceof AxiosError) {
                setUpdateError(error.response?.data?.message || 'Error updating category. Try again later.');
            } else {
                setUpdateError((error as Error).message);
            }
        }
    }

    async function deleteCategory(id: Number) {
        try {

            await axios.delete(`http://localhost:8080/manager/categories/${id}`, config);
            loadCategories()
        } catch (error) {
            if (error instanceof AxiosError) {
                setError(error.response?.data?.message || 'Error deleting category. Try again later.');
            } else {
                setError((error as Error).message);
            }
        }
    }

    function handleCategoryName(event: any) {
        setCategoryName(event.target.value)
    }
    function handleCategoryDescription(event: any) {
        setCategoryDescription(event.target.value)
    }
    function handleCategoryNameToUpdate(event: any) {
        setCategoryNameToUpdate(event.target.value)
    }
    function handleCategoryDescriptionToUpdate(event: any) {
        setCategoryDescriptionToUpdate(event.target.value)
    }
    function handleCategoryToUpdate(category: CategoryType) {
        setCategoryToUpdate(category)
        setCategoryNameToUpdate(category?.categoryName);
        setCategoryDescriptionToUpdate(category?.description)
        setCategoryIdToUpdate(category?.itemCategoryId)

    }
    function handleUpdateCategoryClose() {
        setCategoryToUpdate(undefined)
        setCategoryDescriptionToUpdate("")
        setCategoryNameToUpdate("")
        setCategoryIdToUpdate(0)
    }
    function handleItemsByCategoryClose() {
        setCategoryItems([])
    }

    useEffect(function () {
        categoryIdToUpdate &&
            updateFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [categoryIdToUpdate])

    useEffect(function () {
        categoryItems &&
            itemsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [categoryItems])




    useEffect(function () {
        loadCategories()
    }, [])

    return (
        <>
            <Nav />


            <div className="p-4 dark:bg-slate-800  sm:ml-64">
                <div className="p-4  rounded-lg dark:border-gray-700 mt-14">


                    {
                        (isManager || isAdmin) && <div className="flex items-center justify-center p-5 mb-5">
                            <form className="w-[650px] border border border-slate-200 dark:border-slate-700  px-4 py-3 rounded-lg">
                                <h2 className="text-xl font-medium mb-4">Add Category</h2>
                                <label className="text-sm text-slate-600 dark:text-slate-100 block mb-3 ">Enter Category Name</label>
                                <input type="text" className="block w-full p-2 border bg-slate-200 dark:border-slate-600   dark:bg-slate-700 border-slate-300 rounded-lg text-slate-600 dark:text-slate-200 text-sm mb-4" onChange={handleCategoryName} required />
                                <label className="text-sm text-slate-600  dark:text-slate-100 block mb-3 ">Enter Category Description</label>
                                <input type="text" className="block w-full p-2 border bg-slate-200 dark:border-slate-600  dark:bg-slate-700 border-slate-300 rounded-lg text-slate-600 dark:text-slate-200 text-sm mb-4" onChange={handleCategoryDescription} />
                                <button type="submit" className="py-2 px-3 rounded-lg bg-sky-950 text-sm text-white hover:bg-sky-850  dark:text-sky-950 dark:bg-slate-200 dark:hover:bg-slate-400" onClick={addCategory}>Add Category</button>
                                {error && <p className="text-center text-red-500 text-sm b-4">{error}</p>}

                            </form>
                        </div>
                    }
                    <div className="flex p-5">
                        <span className="self-center text-2xl font-bold sm:text-2xl  whitespace-nowrap  text-sky-900 dark:text-white">Categories</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        {categoriess.map(function (category) {
                            return (
                                <div className=" items-center justify-center p-5 rounded-lg bg-gray-50 bg-sky-50 dark:bg-slate-900" key={`${category.itemCategoryId}`}>
                                    <div className="mx-4 text-sky-800 dark:text-sky-300 text-center font-semibold">{category.categoryName}</div>
                                    <div className=" text-slate-600 dark:text-white text-left">{category.description}</div>
                                    <div className=" grid  grid-cols-1 md:grid-cols-3 gap-4 items-center justify-center mt-5">
                                        {(isAdmin || isManager) && <button className="flex  p-2 text-center space-x-4 rounded-lg text-sky-950 text-sm   hover:text-sky-850   dark:text-slate-200 dark:hover:text-slate-400"
                                            onClick={() => deleteCategory(category.itemCategoryId)}>Delete<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg></button>}
                                        {(isAdmin || isManager) && <button className="flex  p-2 text-center space-x-4 rounded-lg text-sky-950 text-sm   hover:text-sky-850   dark:text-slate-200 dark:hover:text-slate-400"
                                            onClick={() => handleCategoryToUpdate(category)}>Edit<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                            </svg>
                                        </button>

                                        }  <button className="flex  p-2 text-center space-x-4 rounded-lg text-sky-950 text-sm   hover:text-sky-850   dark:text-slate-200 dark:hover:text-slate-400"
                                            onClick={() => loadCategoriesById(category.itemCategoryId)}>Items <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )
                        })}

                    </div>

                    {
                        categoryToUpdate && (isManager || isAdmin) && (
                            <div ref={updateFormRef} className="flex items-center justify-center p-5 mb-5">
                                <form className="w-[650px] border border-slate-200 dark:border-slate-600 px-4 py-3 rounded-lg relative">
                                    <button type="button" className="absolute top-2 right-2 p-1 text-slate-600 hover:text-red-600" onClick={handleUpdateCategoryClose}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6" >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <h2 className="text-xl font-medium mb-4">Update Category</h2>
                                    <label className="text-sm text-slate-600 dark:text-slate-100 block mb-3 ">Enter Category Name</label>
                                    <input type="text" className="block w-full p-2 border bg-slate-200 dark:border-slate-600   dark:bg-slate-700 border-slate-300 rounded-lg text-slate-600 dark:text-slate-200 text-sm mb-4" value={categoryNameToUpdate} onChange={handleCategoryNameToUpdate} required />
                                    <label className="text-sm text-slate-600 dark:text-slate-100 block mb-3 ">Enter Category Description</label>
                                    <input type="text" className="block w-full p-2 border bg-slate-200 dark:border-slate-600   dark:bg-slate-700 border-slate-300 rounded-lg text-slate-600 dark:text-slate-200 text-sm mb-4" value={categorydescriptionToUpdate} onChange={handleCategoryDescriptionToUpdate} />
                                    <button type="submit" className="py-2 px-3 rounded-lg bg-sky-950 text-sm text-white hover:bg-sky-850  dark:text-sky-950 dark:bg-slate-200 dark:hover:bg-slate-400" onClick={updateCategory} >
                                        Update Category
                                    </button>
                                    {updateError && <p className="text-center text-red-500 text-sm m-4">{updateError}</p>}

                                </form>
                            </div>
                        )
                    }

                    <div ref={itemsRef} >{itemsError && <p className="text-center text-red-500 text-sm m-4">{itemsError}</p>}

                        {
                            categoryItems.length !== 0 && (
                                <div className="flex items-center justify-center p-5 mb-5 rounded-lg bg-blue-100 dark:bg-slate-900 relative">
                                    <button type="button" className="absolute top-2 right-2 p-1 text-slate-600 hover:text-red-600" onClick={handleItemsByCategoryClose}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6" >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>

                                    <div className="relative overflow-x-auto">

                                        <table className="table-auto w-full  rounded-lg ">
                                            <thead>
                                                <tr className="text-sm font-medium   border-b border-sky-900 dark:border-sky-100  text-sky-900 dark:text-slate-50">
                                                    <th className="p-2 border-r border-sky-900  dark:border-sky-100 text-center">Item</th>
                                                    <th className="p-2 border-r border-sky-900  dark:border-sky-100 text-center">Description</th>
                                                    <th className="p-2 border-r border-sky-900  dark:border-sky-100 text-center">Category</th>
                                                    <th className="p-2 border-r border-sky-900  dark:border-sky-100 text-center">Price</th>
                                                    <th className="p-2 border-r border-sky-900  dark:border-sky-100 text-center">Quantity on hand</th>
                                                    <th className="p-2 text-center">Action</th>
                                                </tr>

                                            </thead>
                                            <tbody>
                                                {categoryItems.map((item, index) => (
                                                    <tr key={index} className={` ${index !== categoryItems.length - 1 ? ' border-b border-sky-900  dark:border-sky-100 ' : ''}`}>
                                                        <td className="p-2 text-slate-700 dark:text-slate-100 border-r border-sky-900  dark:border-sky-100  text-center">{item.itemName}</td>
                                                        <td className="p-2 text-slate-700  dark:text-slate-100 border-r border-sky-900  dark:border-sky-100 text-center">{item.description}</td>
                                                        <td className="p-2 text-slate-700   dark:text-slate-100 border-r border-sky-900  dark:border-sky-100 text-center">{item.itemCategory.categoryName}</td>
                                                        <td className="p-2 text-slate-700  dark:text-slate-100  border-r border-sky-900  dark:border-sky-100 text-center">{item.price}</td>
                                                        <td className="p-2 text-slate-700  dark:text-slate-100  border-r border-sky-900 dark:border-sky-100  text-center">{`${item.stock.quantity}`}</td>

                                                    </tr>
                                                ))
                                                }

                                            </tbody>
                                        </table> </div>

                                </div>
                            )
                        }
                    </div>
                </div>
            </div>

        </>
    )
}

export default Categories;

