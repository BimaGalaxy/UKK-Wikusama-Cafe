import { HiOutlineLogout } from "react-icons/hi";
import { TbTransactionDollar } from "react-icons/tb";

export const ManajerSidebarNavigation = [
    {
        key: 'transaksi',
        name: 'Transaksi',
        path: '/manajer/transaksi',
        icon: <TbTransactionDollar />
    }
]

export const ManajerSidebarBottomLinks = [
    {
        key: 'logout',
        name: 'Logout',
        path: '/logout',
        icon: <HiOutlineLogout />
    }
]