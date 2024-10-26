interface AuthContxtType {
    isAuthenticated: boolean
    jwtToken: string | null;
    loading: boolean;
    login: (jwtToken: string) => void;
    logout: () => void;
    isAdmin: boolean;
    isManager: boolean;
    isCashier: boolean;
    username: string;
}

export default AuthContxtType;