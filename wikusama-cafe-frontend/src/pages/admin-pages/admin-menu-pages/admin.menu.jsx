import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminFood() {
  const token = localStorage.getItem("accessToken");
  const [menus, setMenus] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMsg, setSearchMsg] = useState("");
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getAllMenu();
  }, [])

  const getAllMenu = async () => {
    try {
      const response = await axios.get('http://localhost:3000/menu', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMenus(response.data)
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  const handleEdit = (id_menu) => {
    navigate(`/admin/menu/edit/${id_menu}`);
  }

  const handleDelete = async (id_menu) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus menu ini?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:3000/menu/delete/${id_menu}`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          window.alert('Menu berhasil dihapus!');
          getAllMenu();
        }
      } catch (error) {
          if (error.response) {
                setMsg(error.response.data.msg);
          }
      }
    }
  }

  const handleAddMenu = () => {
    navigate('/admin/menu/add');
  }

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchMsg("");

    if (!searchQuery.trim()) {
      getAllMenu();
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/menu/search/${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data.success) {
        setMenus(response.data.data);
        setSearchMsg(''); 
      } else {
        setSearchMsg('Menu tidak ditemukan');
      }
    } catch (error) {
      if (error.response) {
        setSearchMsg(error.response.data.msg);
      } else {
        setSearchMsg("Terjadi kesalahan saat melakukan pencarian.");
      }
    }
  }

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
  
  const filteredMenus = selectedCategory
    ? menus.filter((menu) => menu.jenis === selectedCategory)
    : menus;

  return (
    <div>
      <div className="font-bold h-12 px-4 text-3xl content-center ">Menu</div>
      <div className='p-4'>
        <div className="flex flex-row justify-between items-center mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded h-12"
            onClick={() => handleAddMenu()}
          >
            Tambah Menu
          </button>

          <select
              className="border ml-4 border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 border-none focus:border-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">Semua Kategori</option>
              <option value="makanan">Makanan</option>
              <option value="minuman">Minuman</option>
            </select>

          {/* search bar */}
          <div className="max-w-md ml-auto ">
            <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden">
              <div className="grid place-items-center h-full w-12 text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <input
                className="h-full w-full outline-none text-sm text-gray-700 pl-12 pr-2 "
                type="text"
                id="search"
                placeholder="Cari menu"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e);
                  }
                }}
              />
            </div>
          </div>


        </div>
        
        <p className="text-red-600">{searchMsg}</p>
        {msg && <div className="text-red-500 mb-4">{msg}</div>}
        {/* card */}
        <div className="grid grid-cols-4 mb-4 justify gap-4">
          {filteredMenus.length > 0 ? (
            filteredMenus.map((menu, index) => (
              <div key={menu.id_menu} className="group flex w-full max-w-xs flex-col overflow-hidden border border-gray-100 bg-white shadow-md">
                <div className="relative flex h-60 overflow-hidden" href="#">
                  <img className="absolute top-0 right-0 h-full w-full object-cover" src={menu.url_gambar} alt={menu.nama_menu} />
                </div>
                <div className="mt-4 px-5 pb-5">
                  <h5 className="text-lg font-semibold">{menu.nama_menu}</h5>
                  <h5 className="tracking-tight text-slate-900 mt-2">{menu.jenis}</h5>
                  <h5 className="tracking-tight text-slate-900 mt-2">{menu.deskripsi}</h5>
                  <div className="mt-2 mb-5 flex items-center justify-between">
                    <p>
                      <span className="text-xl font-bold text-slate-900">Rp.{menu.harga}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleEdit(menu.id_menu)}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  > 
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(menu.id_menu)}
                    className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))
           ):(
            <p>Tidak ada menu tersedia.</p>
           )}
        </div>

      </div>
    </div>
  )
}
