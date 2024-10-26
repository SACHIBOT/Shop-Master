import { createContext, useContext, useEffect, useState } from "react";
import AuthContxtType from "../types/AuthContextType";
import AuthProviderPropsType from "../types/AuthProviderPropsType";
import axios from "axios";

export const AuthContxt = createContext<AuthContxtType>({
    isAuthenticated: false,
    jwtToken: null,
    loading: true,
    login: () => { },
    logout: () => { },
    isAdmin: false,
    isManager: false,
    isCashier: false,
    username: ""
})

export function AuthProvider({ children }: AuthProviderPropsType) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [jwtToken, setJwtToken] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true);
    const [isAdmin, setIsAdmin] = useState<boolean>(false)
    const [isManager, setIsManager] = useState<boolean>(false)
    const [isCashier, setIsCashier] = useState<boolean>(false)
    const [username, setUsername] = useState<string>("")



    async function getUserInfo(token: string) {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }

            const response = await axios.get('http://localhost:8080/user', config)
            const roleName = response.data.role.roleName
            setIsAdmin(roleName && roleName.toUpperCase() === "ADMIN")
            setIsManager(roleName && roleName.toUpperCase() === "MANAGER")
            setIsCashier(roleName && roleName.toUpperCase() === "CASHIER")
            setUsername(response.data.username)
            setIsAuthenticated(true)
            setJwtToken(token)
            setLoading(false)
        }
        catch (error) {
            setLoading(false)
        }
    }
    function login(jwtToken: string) {
        getUserInfo(jwtToken)
        localStorage.setItem('jwtToken', jwtToken)
    }

    function logout() {
        setIsAuthenticated(false)
        setJwtToken(null)
        localStorage.removeItem('jwtToken')
    }

    useEffect(() => {
        const storedToken = localStorage.getItem('jwtToken')
        if (storedToken) {
            getUserInfo(storedToken)
        } else {
            setLoading(false)
        }
    }, [])

    return (
        <AuthContxt.Provider value={{ isAuthenticated, jwtToken, loading, login, logout, isAdmin, isManager, isCashier, username }}>
            {children}
        </AuthContxt.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContxt)
}