import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminUserAdd() {
    const token = localStorage.getItem("accessToken");
    const navigate = useNavigate();

    const [msg, setMsg] = useState('');
    const [userData, setUserData] = useState({
        username: '',
        nama_user: '',
        role: '',
        password: '',
        confPassword: ''
    });
    const [roles] = useState(['admin', 'manajer', 'kasir']);

    const addUser = async (e) => {
        e.preventDefault();

        try {
            await axios.post(`http://localhost:3000/user/add`, {
                username: userData.username,
                nama_user: userData.nama_user,
                role: userData.role,
                password: userData.password,
                confPassword: userData.confPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            window.alert('User berhasil ditambahkan!');
            navigate('/admin/user');
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }
    
  return (
    <div>
        <div className="font-bold h-12 px-4 py-4 text-3xl">Tambah User</div>
        <div className='p-4'>
                {msg && <div className="text-red-500 mb-4">{msg}</div>}
                <form className="flex flex-col w-96" onSubmit={addUser}>
                    <div className='flex flex-col mb-4'>
                        <label htmlFor="nama_user" className="text-sm">Nama User</label>
                        <input
                            type="text"
                            name="nama_user"
                            onChange={(e) => setUserData({ ...userData, nama_user: e.target.value })}
                            placeholder='Masukkan nama user'
                            className="border rounded p-2 outline-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className='flex flex-col mb-4'>
                        <label htmlFor="username" className="text-sm">Username</label>
                        <input
                            required={true}
                            type="text"
                            name="username"
                            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                            placeholder='Masukkan username'
                            className="border rounded p-2 outline-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className='flex flex-col mb-4'>
                        <label htmlFor="role" className="text-sm">Role</label>
                        <select
                            name="role"
                            onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                            className="border rounded p-2 outline-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" disabled>Pilih Role</option>
                            {roles.map((role) => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex flex-col mb-4'>
                        <label htmlFor="nama_user" className="text-sm">Password</label>
                        <input
                            type="password"
                            name="password"
                            onChange={(e) => setUserData({ ...userData, newPassword: e.target.value })}
                            placeholder='Password'
                            className="border rounded p-2 outline-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className='flex flex-col mb-4'>
                        <input
                            type="password"
                            name="confPassword"
                            onChange={(e) => setUserData({ ...userData, confirmNewPassword: e.target.value })}
                            placeholder='Konfirmasi password'
                            className="border rounded p-2 outline-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Simpan
                    </button>
                </form>
            </div>
    </div>
  )
}
