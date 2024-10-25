
import { useEffect, useState } from 'react';
import '../App.css'
import Nav from '../components/SideBarNav';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserType from '../types/UserType';
import RoleType from '../types/RoleTypes';
import axios, { AxiosError } from 'axios';

function Users() {

    const [error, setError] = useState<string>("")
    const [actionError, setActionError] = useState<string>("")

    const [users, setUsers] = useState<UserType[]>([])
    const [roles, setRoles] = useState<RoleType[]>([])

    const [userName, setUserName] = useState<string>("")
    const [userPassword, setUserPassword] = useState<string>("")
    const [userRole, setUserRole] = useState<number>(0)

    const [updatedRole, setUpdatedRole] = useState<number>(0)

    const navigate = useNavigate();
    const { isAuthenticated, jwtToken, isAdmin } = useAuth();
    if (!isAuthenticated) {
        navigate("/")
    }
    if (!isAdmin) {
        navigate("/")
    }
    const config = {
        headers: {
            Authorization: `Bearer ${jwtToken}`,
        },
    }
    const handleUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(event.target.value);
    };

    const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserPassword(event.target.value);
    };

    const handleRole = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setUserRole(Number(event.target.value));
    };

    const handleUpdatedRole = (event: any) => {
        setUpdatedRole(Number(event.target.value))
    }

    const getUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/admin/allusers', config);
            setUsers(response.data);
        } catch (err) {

        }
    };

    const getRoles = async () => {
        try {
            const response = await axios.get('http://localhost:8080/roles', config);

            setRoles(response.data);

        } catch (err) {
        }
    };

    const updateRole = async (userId: number, roleId: number) => {
        try {
            if (userId !== 0 && roleId !== 0) {
                await axios.put(`http://localhost:8080/admin/users/${userId}/role/${roleId}`, config);
                setUpdatedRole(0)
                getUsers()
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                setActionError(error.response?.data || 'Error updating user. Try again later.');
            } else {
                setActionError((error as Error).message);
            }
        }
    };



    const deleteUser = async (username: string) => {
        try {
            await axios.delete(`http://localhost:8080/admin/users/${username}`, config);
            getUsers()
            setActionError("")
        } catch (error) {
            if (error instanceof AxiosError) {
                setActionError(error.response?.data || 'Error deleting user. Try again later.');
            } else {
                setActionError((error as Error).message);
            }
        }
    };


    const addUser = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        try {
            await axios.post(
                'http://localhost:8080/admin/users',
                {
                    username: userName,
                    password: userPassword,
                    roleId: userRole
                },
                config
            );
            setUserName("");
            setUserPassword("");
            setUserRole(0);
            getUsers();
            setError("")
        } catch (error) {
            if (error instanceof AxiosError) {
                setError(error.response?.data?.message || 'Error adding user. Try again later.');
            } else {
                setError((error as Error).message);
            }
        }
    };

    useEffect(() => {
        getRoles();
        getUsers();

    }, []);

    return (
        <>
            <Nav />


            <div className=" dark:bg-slate-800  sm:ml-64">
                <div className=" rounded-lg dark:border-gray-700 mt-14">

                    {
                        isAdmin &&
                        <div className="flex flex-col md:flex-row h-screen">

                            <div className="flex items-center justify-center p-5 mb-5">
                                <form className="border border border-slate-200 dark:border-slate-700  px-4 py-3 rounded-lg">
                                    <h2 className="text-xl font-medium mb-4">Add User</h2>
                                    <label className="text-sm text-slate-600 dark:text-slate-100 block mb-3 ">Enter user name</label>
                                    <input type="text" className="block w-full p-2 border bg-slate-200 dark:border-slate-600   dark:bg-slate-700 border-slate-300 rounded-lg text-slate-600 dark:text-slate-200 text-sm mb-4" onChange={handleUserName} required />
                                    <label className="text-sm text-slate-600  dark:text-slate-100 block mb-3 ">Enter user password</label>
                                    <input type="text" className="block w-full p-2 border bg-slate-200 dark:border-slate-600  dark:bg-slate-700 border-slate-300 rounded-lg text-slate-600 dark:text-slate-200 text-sm mb-4" onChange={handlePassword} required />
                                    <label className="text-sm text-slate-600  dark:text-slate-100 block mb-3 ">Enter user password</label>
                                    <select className="block w-full p-2 border bg-slate-200 dark:border-slate-600  dark:bg-slate-700 border-slate-300 rounded-lg text-slate-600 dark:text-slate-200 text-sm mb-4" onChange={handleRole} required >
                                        {
                                            roles.map((role) => (<option key={role.roleId} value={role.roleId}>{role.roleName}</option>))
                                        }
                                    </select>
                                    <button type="submit" className="py-2 px-3 rounded-lg bg-sky-950 text-sm text-white hover:bg-sky-850  dark:text-sky-950 dark:bg-slate-200 dark:hover:bg-slate-400" onClick={addUser}>Add User</button>
                                    {error && <p className="text-center text-red-500 text-sm p-4">{error}</p>}

                                </form>
                            </div>

                            <div className="flex-none md:w-2/3 w-full p-4">

                                <div className="flex p-5">
                                    <span className="self-center text-2xl font-bold sm:text-2xl  whitespace-nowrap  text-sky-900 dark:text-white">Users</span>
                                </div>



                                <div className="flex items-center justify-center p-5 mb-5 rounded-lg bg-blue-100 dark:bg-slate-900 relative">
                                    <div className="relative overflow-x-auto">

                                        <table className="table-auto w-full  rounded-lg ">
                                            <thead>
                                                <tr className="text-sm font-medium   border-b border-sky-900 dark:border-sky-100  text-sky-900 dark:text-slate-50">
                                                    <th className="p-2 border-r border-sky-900  dark:border-sky-100 text-center">Username</th>
                                                    <th className="p-2 border-r border-sky-900  dark:border-sky-100 text-center">Role</th>
                                                    <th className="p-2 border-r border-sky-900  dark:border-sky-100 text-center">Action</th>
                                                    <th className="p-2 text-center">Promote</th>
                                                </tr>

                                            </thead>
                                            <tbody>
                                                {users.map((user, index) => (
                                                    <tr key={index} className={` ${index !== users.length - 1 ? ' border-b border-sky-900  dark:border-sky-100 ' : ''}`}>
                                                        <td className="p-2 text-slate-700 dark:text-slate-100 border-r border-sky-900  dark:border-sky-100  text-center">{user.username}</td>

                                                        <td className="p-2 text-slate-700  dark:text-slate-100 border-r border-sky-900  dark:border-sky-100 text-center"> {user.role.roleName}</td>
                                                        <td className="p-2 text-slate-700  dark:text-slate-100 border-r border-sky-900  dark:border-sky-100 text-center">

                                                            <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                                                onClick={() => deleteUser(user.username)}
                                                            >Delete</button>

                                                        </td>
                                                        <td className="p-2 text-slate-700  dark:text-slate-100 text-center">

                                                            <div className="flex items-center overflow-hidden">
                                                                <select
                                                                    className="px-3 py-2 flex-1 appearance-none outline-none bg-transparent border-0  "
                                                                    onChange={(e) => handleUpdatedRole(e.target.value,)}
                                                                >
                                                                    {roles.map((role) => (
                                                                        <option key={role.roleId} value={role.roleId}>
                                                                            {role.roleName}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                <button
                                                                    onClick={() => updateRole(user.userId, updatedRole)}
                                                                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg  hover:bg-yellow-600 "
                                                                >
                                                                    Promote
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                                }

                                            </tbody>
                                        </table>
                                        {actionError && <p className="text-center text-red-500 mt-3 text-sm p-4">{actionError}</p>}
                                    </div>

                                </div>
                            </div>
                        </div>}
                </div>
            </div >

        </>
    )
}

export default Users;