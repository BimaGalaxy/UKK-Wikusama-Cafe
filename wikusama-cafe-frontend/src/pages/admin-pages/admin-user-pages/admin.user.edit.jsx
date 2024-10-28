import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function AdminUserEdit() {
    const token = localStorage.getItem("accessToken");
    const { id_user } = useParams(); 
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        username: '',
        nama_user: '',
        role: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [roles] = useState(['admin', 'manajer', 'kasir']); // Daftar role tetap
    const [msg, setMsg] = useState('');

    useEffect(() => {
        getUserById();
    }, []);

    const getUserById = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/users/id/${id_user}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserData(response.data);
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    const updateUser = async (e) => {
        e.preventDefault();

        try {
            await axios.patch(`http://localhost:3000/user/update/${id_user}`, {
                username: userData.username,
                nama_user: userData.nama_user,
                role: userData.role,
                newPassword: userData.newPassword,
                confirmNewPassword: userData.confirmNewPassword
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            window.alert('User berhasil diupdate!');
            navigate('/admin/user');
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    return (
        <div>
            <div className="font-bold h-12 px-4 py-4 text-3xl">Edit User</div>
            <div className='p-4'>
                {msg && <div className="text-red-500 mb-4">{msg}</div>}
                <form className="flex flex-col w-96" onSubmit={updateUser}>
                    <div className='flex flex-col mb-4'>
                        <label htmlFor="username" className="text-sm">Username</label>
                        <input
                            required={true}
                            type="text"
                            name="username"
                            value={userData.username || ''}
                            onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                            placeholder='Masukkan username'
                            className="border rounded p-2 outline-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className='flex flex-col mb-4'>
                        <label htmlFor="nama_user" className="text-sm">Nama User</label>
                        <input
                            type="text"
                            name="nama_user"
                            value={userData.nama_user || ''}
                            onChange={(e) => setUserData({ ...userData, nama_user: e.target.value })}
                            placeholder='Masukkan nama user'
                            className="border rounded p-2 outline-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className='flex flex-col mb-4'>
                        <label htmlFor="role" className="text-sm">Role</label>
                        <select
                            name="role"
                            value={userData.role || ''}
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
                        <label htmlFor="nama_user" className="text-sm">Rubah Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            onChange={(e) => setUserData({ ...userData, newPassword: e.target.value })}
                            placeholder='Password baru'
                            className="border rounded p-2 outline-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className='flex flex-col mb-4'>
                        <input
                            type="password"
                            name="confNewPassword"
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
