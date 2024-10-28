import { HiOutlineLogout } from "react-icons/hi";
import { TbTransactionDollar } from "react-icons/tb";
import { MdOutlineTableBar } from "react-icons/md";
import { IoFastFoodOutline } from "react-icons/io5";


export const KasirSidebarNavigation = [
    {
        key: 'menu',
        name: 'Menu',
        path: '/kasir/menu',
        icon: <IoFastFoodOutline />
    },
    {
        key: 'meja',
        name: 'Meja',
        path: '/kasir/meja',
        icon: <MdOutlineTableBar />
    },
    {
        key: 'transaksi',
        name: 'Transaksi',
        path: '/kasir/transaksi',
        icon: <TbTransactionDollar />
    }
]

export const KasirSidebarBottomLinks = [
    {
        key: 'logout',
        name: 'Logout',
        path: '/logout',
        icon: <HiOutlineLogout />
    }
]