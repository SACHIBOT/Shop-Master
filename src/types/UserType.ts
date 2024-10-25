import RoleType from "./RoleTypes";


interface AuthorityType {
    authority: string;
}

interface UserType {
    userId: number;
    username: string;
    password: string;
    role: RoleType;
    sales: any[];
    authorities: AuthorityType[];
}

export default UserType;
