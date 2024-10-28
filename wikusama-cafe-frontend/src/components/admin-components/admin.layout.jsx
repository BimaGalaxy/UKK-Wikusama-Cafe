import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './admin.sidebar.jsx';
import AdminHeader from './admin.header.jsx';

export default function AdminLayout() {
  return (
    <div className='flex flex-row bg-neutral-100 h-screen w-screen overflow-hidden'>
      <AdminSidebar />
      <div className='flex flex-col flex-1'>
        <AdminHeader />
        <div className='flex-1 overflow-auto'>{<Outlet />}</div>
      </div>
    </div>
  );
}
