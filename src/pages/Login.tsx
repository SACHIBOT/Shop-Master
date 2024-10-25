import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

const Login = () => {
    const [usernameoremail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (isAuthenticated) {
        navigate('/')
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password.trim() === "" || usernameoremail.trim() === "") {
            setError('Please fill all feilds!');
        } else {
            setError('');
            setIsLoading(true);
            try {
                const response = await axios.post('http://localhost:8080/auth/login', {
                    username: usernameoremail,
                    password: password
                });

                login(response.data);
                navigate("/")

            } catch (err) {
                if (err instanceof AxiosError) {


                    setError(err.response?.data?.message || 'Login failed. Try again later.');
                } else {
                    setError((err as Error).message);
                }
            } finally {
                setIsLoading(false);
            }

        }
    };

    return (
        <div className="flex h-screen">
            <div className="hidden md:flex md:w-1/2 lg:w-1/2 xl:w-1/2 2xl:w-1/2 bg-cover bg-slate-100 dark:bg-cyan-900 bg-center" style={{ backgroundImage: 'url(/pos.png)' }}></div>
            <div className="flex flex-col w-full md:w-1/2 lg:w-1/2 xl:w-1/2 2xl:w-1/2 bg-indigo-200 dark:bg-slate-900 justify-center items-center p-4" >

                <h1 className="text-4xl font-bold text-sky-950 dark:text-slate-200 mb-4">ShopMaster</h1>

                <form onSubmit={handleSubmit} className="w-full max-w-md">
                    <h1 className="text-4xl font-bold text-center text-sky-800 dark:text-slate-200 mb-4">LOGIN</h1>
                    <div className="mb-4  mx-4 md:mx-0">
                        <label className="block text-sky-900 dark:text-slate-200  text-sm font-bold mb-2" htmlFor="usernameoremail">Username or Email</label>
                        <input className="shadow appearance-none border bg-slate-200 dark:border-slate-600   dark:bg-slate-700 border-slate-300  rounded-xl w-full py-2 px-3 text-sky-900 dark:text-slate-200  leading-tight focus:outline-none focus:shadow-outline" id="usernameoremail" type="text" value={usernameoremail} onChange={(e) => setUsernameOrEmail(e.target.value)} />
                    </div>
                    <div className="mb-4 mx-4 md:mx-0">
                        <label className="block text-sky-900 dark:text-slate-200  text-sm font-bold mb-2" htmlFor="password">Password</label>
                        <input className="shadow appearance-none border  bg-slate-200 dark:border-slate-600   dark:bg-slate-700 border-slate-300 rounded-xl w-full py-2 px-3 text-sky-900 dark:text-slate-200  leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {error && <p className="text-center text-red-500 text-sm mb-4">{error}</p>}

                    <div className="mb-4 mt-7 mx-4 md:mx-0 text-center">
                        <button className="text-slate-100 dark:text-sky-900 dark:bg-sky-200 bg-sky-950  w-full sm:w-1/4 font-bold py-2 px-4 rounded-xl focus:outline-none focus:shadow-outline"
                            type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <div className="flex justify-center items-center">
                                    <svg height="24px" width="24px" className="animate-spin  mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                    Login
                                </div>
                            ) : "Login"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;