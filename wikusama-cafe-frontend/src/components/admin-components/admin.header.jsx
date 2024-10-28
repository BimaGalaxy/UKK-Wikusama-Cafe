import React from 'react';
import { jwtDecode } from 'jwt-decode';

export default function AdminHeader() {
  const token = localStorage.getItem("accessToken");
  const decoded = token ? jwtDecode(token) : {};
  const nama_user = decoded.nama_user;

  return (
    <div className='bg-white h-16 px-4 flex items-center shadow-md'>
      <div className='font-bold text-lg'>Halo, {nama_user}</div>
    </div>
  );
}
