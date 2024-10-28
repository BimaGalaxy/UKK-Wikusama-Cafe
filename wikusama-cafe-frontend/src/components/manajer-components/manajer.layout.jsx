import React from 'react';
import { Outlet } from 'react-router-dom';
import ManajerHeader from './manajer.header';
import ManajerSidebar from './manajer.sidebar';

export default function ManajerLayout() {
    return (
        <div className='flex flex-row bg-neutral-100 h-screen w-screen overflow-hidden'>
            <ManajerSidebar />
            <div className='flex flex-col flex-1'>
                <ManajerHeader />
                <div className='flex-1 overflow-auto'>{<Outlet />}</div>
            </div>
        </div>
    )
}
