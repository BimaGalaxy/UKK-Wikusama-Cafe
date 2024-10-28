import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function AdminMenuedit() {
    const token = localStorage.getItem("accessToken");
    const { id_menu } = useParams();
    const navigate = useNavigate();

    const [msg, setMsg] = useState('');
    const [menuData, setMenuData] = useState({
        nama_menu: '',
        harga: '',
        jenis: '',
        deskripsi: '',
        gambar: ''
    });
    const [jenisMenu] = useState(['makanan', 'minuman']);

    useEffect(() => {
        getMenuById();
    }, []);

    const getMenuById = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/menu/id/${id_menu}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            setMenuData(response.data.data);
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    const updateMenu = async (e) => {
        e.preventDefault();

        try {
            const request = await axios.patch(`http://localhost:3000/menu/update/${id_menu}`, {
                nama_menu: menuData.nama_menu,
                deskripsi: menuData.deskripsi,
                jenis: menuData.jenis,
                harga: menuData.harga
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            if (request.data.success) {
                 window.alert('Menu berhasil diupdate!');
                navigate('/admin/menu');
            }
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }

    return (
        <div>
            <div className='font-bold h-12 px-4 py-4 text-3xl'>Edit Menu</div>
            <div className='p-4'>
                {msg && <div className="text-red-500 mb-4">{msg}</div>}
                <form className="flex flex-col w-6/12" onSubmit={updateMenu}>

                    <div className='flex flex-col mb-4'>
                        <label htmlFor="nama_user" className="text-sm">Nama Menu</label>
                        <input
                            type="text"
                            name="nama_menu"
                            value={menuData.nama_menu || ''}
                            onChange={(e) => setMenuData({ ...menuData, nama_menu: e.target.value })}
                            placeholder='Nama menu'
                            className="border rounded shadow-md p-2 outline-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className='flex flex-col mb-4'>
                        <label htmlFor="deskripsi" className="text-sm">Deskripsi</label>
                        <textarea
                            name="deskripsi"
                            value={menuData.deskripsi || ''}
                            onChange={(e) => setMenuData({ ...menuData, deskripsi: e.target.value })}
                            className="border rounded shadow-md h-40 p-2 outline-none focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Masukkan deskripsi"
                        ></textarea>
                    </div>

                    <div className='flex flex-col mb-4'>
                        <label className="text-sm">Kategori</label>
                        <select
                            name="jenis"
                            value={menuData.jenis || ''}
                            onChange={(e) => setMenuData({ ...menuData, jenis: e.target.value })}
                            className="border rounded p-2 outline-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" disabled>Pilih kategori menu</option>
                            {jenisMenu.map((jenis) => (
                                <option key={jenis} value={jenis}>{jenis}</option>
                            ))}
                        </select>
                    </div>
                
                    <div className='flex flex-col mb-4'>
                        <label htmlFor="harga" className="text-sm">Harga</label>
                        <input
                            type="number"
                            name="harga"
                            value={menuData.harga || ''}
                            onChange={(e) => setMenuData({ ...menuData, harga: e.target.value })}
                            placeholder='Harga'
                            className="border rounded shadow-md p-2 outline-none focus:outline-none focus:ring-2 focus:ring-blue-500"
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
