import React from 'react';
import { Outlet } from 'react-router-dom';
import KasirHeader from './kasir.header.jsx';
import KasirSidebar from './kasir.sidebar.jsx';


export default function KasirLayout() {
    return (
        <div className='flex flex-row bg-neutral-100 h-screen w-screen overflow-hidden'>
            <KasirSidebar />
            <div className='flex flex-col flex-1'>
                <KasirHeader />
                <div className='flex-1 overflow-auto'>{<Outlet />}</div>
            </div>
        </div>
    )
}
