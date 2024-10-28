import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminMenuAdd() {
    const token = localStorage.getItem("accessToken");
    const navigate = useNavigate();

    const [msg, setMsg] = useState('');
    const [preview, setPreview] = useState('')
    const [menuData, setMenuData] = useState({
        nama_menu: '',
        harga: '',
        jenis: '',
        deskripsi: '',
        gambar: ''
    });
    const [jenisMenu] = useState(['makanan', 'minuman']);

    const loadImage = (e) => {
        const image = e.target.files[0];
         if (image) {
            setMenuData({ ...menuData, gambar: image });
            setPreview(URL.createObjectURL(image));
        }
    };

    const addMenu = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nama_menu', menuData.nama_menu);
        formData.append('deskripsi', menuData.deskripsi);
        formData.append('jenis', menuData.jenis);
        formData.append('harga', menuData.harga);
        formData.append('gambar', menuData.gambar);

        try {
            const response = await axios.post('http://localhost:3000/menu', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                window.alert('Menu berhasil ditambahkan!');
                navigate('/admin/menu');  
            }
        } catch (error) {
            setMsg(error.response.data.msg);
        }
    }

    return (
        <div>
            <div className="font-bold h-12 px-4 py-4 text-3xl">Tambah Menu</div>
            <div className='p-4'>
                {msg && <div className="text-red-500 mb-4">{msg}</div>}
                <form className='flex flex-col w-6/12' onSubmit={addMenu}>

                    <div className='flex flex-col mb-4'>
                        <label htmlFor="nama_user" className="text-sm">Nama Menu</label>
                        <input
                            type="text"
                            name="nama_menu"
                            onChange={(e) => setMenuData({ ...menuData, nama_menu: e.target.value })}
                            placeholder='Nama menu'
                            className="border rounded shadow-md p-2 outline-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className='flex flex-col mb-4'>
                        <label htmlFor="deskripsi" className="text-sm">Deskripsi</label>
                        <textarea
                            name="deskripsi"
                            onChange={(e) => setMenuData({ ...menuData, deskripsi: e.target.value })}
                            className="border rounded shadow-md h-40 p-2 outline-none focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Masukkan deskripsi"
                        ></textarea>
                    </div>

                    <div className='flex flex-col mb-4'>
                        <label className="text-sm">Kategori</label>
                        <select
                            name="jenis"
                            value={menuData.jenis}
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
                            onChange={(e) => setMenuData({ ...menuData, harga: e.target.value })}
                            placeholder='Harga'
                            className="border rounded shadow-md p-2 outline-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    
                    <div className='flex flex-col mb-4'>
                        <label htmlFor="gambar" className="text-sm">Gambar Menu</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={loadImage}
                            className="border rounded shadow-md p-2 outline-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />

                        {preview && (
                            <div className="mt-4 ">
                                <img src={preview} alt="Preview" className="w-full h-full object-cover rounded shadow-md" />
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}
