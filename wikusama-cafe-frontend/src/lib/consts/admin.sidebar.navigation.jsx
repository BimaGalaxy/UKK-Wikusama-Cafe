import { 
HiOutlineUsers,
HiOutlineLogout
} from "react-icons/hi";
import { MdOutlineTableBar } from "react-icons/md";
import { IoFastFoodOutline } from "react-icons/io5";


export const AdminSidebarNavigation = [
    {
        key: 'user',
        name: 'User',
        path: '/admin/user',
        icon: <HiOutlineUsers />
    },
    {
        key: 'menu',
        name: 'Menu',
        path: '/admin/menu',
        icon: <IoFastFoodOutline />
    },
    {
        key: 'meja',
        name: 'Meja',
        path: '/admin/meja',
        icon: <MdOutlineTableBar />
    }
]

export const AdminSidebarBottomLinks = [
    {
        key: 'logout',
        name: 'Logout',
        path: '/logout',
        icon: <HiOutlineLogout />
    }
]