import React from 'react'
import { IoIosContacts } from "react-icons/io";
import { KasirSidebarNavigation, KasirSidebarBottomLinks } from '../../lib/consts/kasir.sidebar.navigation';
import { NavLink, useNavigate } from 'react-router-dom';

const LinkClasses = 'flex items-center gap2 font-light px-3 py-2 hover:bg-red-600 hover:no-underline rounded-sm text-white';

export default function KasirSidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/logout');
    }

    return (
        <div className='flex flex-col bg-red-800 w-60 p-3'>
            <div className='flex items-center gap-2 px-1 py-2'>
                <IoIosContacts fontSize={28} color="white"/>
                <span className='text-neutral-100 text-lg'>Kasir</span>
            </div>
            <div className='flex-1 py-8 flex flex-col gap-1'>
                {KasirSidebarNavigation.map((item) => (
                    <SidebarLink key={item.key} item={item} />
                ))}
            </div>
            <div className='flex flex-col gap-0.5 pt-2 border-t border-white' onClick={handleLogout}>
                {KasirSidebarBottomLinks.map((item) => (
                    <SidebarLink key={item.key} item={item} />
                ))}
            </div>
        </div>
    )
}

function SidebarLink({ item }) {
    return (
        <NavLink
            to={item.path}
            className={({ isActive }) => `${LinkClasses} ${isActive ? 'bg-red-700' : ''}`}>
            <span className='text-xl'>{item.icon}</span>
            <span className='ml-2'>{item.name}</span>
        </NavLink>
    )
}
