import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function KasirMenu() {
  const [masukKeranjang, setMasukKeranjang] = useState(JSON.parse(localStorage.getItem("cart")) || []);

  const token = localStorage.getItem("accessToken");
  const [menus, setMenus] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMsg, setSearchMsg] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [msg, setMsg] = useState('');
  const [cartMsg, setCartMsg] = useState('');
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
  
  const addToCart = (menu) => {
    const updatedCart = [...masukKeranjang];
    const index = updatedCart.findIndex(item => item.id_menu === menu.id_menu);

    if (index !== -1) {
      updatedCart[index].jumlah += 1;
    } else {
      updatedCart.push({ id_menu: menu.id_menu, jumlah: 1 });
    }

    setMasukKeranjang(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const deleteFromCart = (id_menu) => {
    const updatedCart = masukKeranjang.filter(item => item.id_menu !== id_menu);
    setMasukKeranjang(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const kurangJumlah = (id_menu) => {
    const updatedCart = [...masukKeranjang];
    const index = updatedCart.findIndex(item => item.id_menu === id_menu);

    if (index !== -1) {
      updatedCart[index].jumlah -= 1;
    }

    setMasukKeranjang(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    if (updatedCart[index].jumlah === 0) {
      deleteFromCart(id_menu);
    }
  }

  const cartItems = masukKeranjang.map(cartItem => {
    const menuItem = menus.find(menu => menu.id_menu === cartItem.id_menu);
    return {
      ...menuItem,
      jumlah: cartItem.jumlah
    };
  });
  
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setCartMsg("Tidak ada pesanan");
      return;
    };

    try {
      // Arahkan ke halaman transaksi setelah memeriksa cart items
      navigate("/kasir/transaksi/checkout", { state: { cartItems } });
    } catch (error) {
      console.error("Terjadi kesalahan saat checkout:", error);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {/* Menu Section */}
      <div className="col-span-3">
        <div className="font-bold h-12 px-4 text-3xl content-center ">Menu</div>
        <div className="p-4">
          <div className="flex flex-row justify-between items-center mb-4">
            <div className="max-w-md">
              <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden">
                <input
                  className="h-full w-full outline-none text-sm text-gray-700 pl-12 pr-2 "
                  type="text"
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

            <select
              className="border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 border-none focus:border-none focus:ring-2 focus:ring-blue-500"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">Semua Kategori</option>
              <option value="makanan">Makanan</option>
              <option value="minuman">Minuman</option>
            </select>
          </div>

          <p className="text-red-600">{searchMsg}</p>
          {msg && <div className="text-red-500 mb-4">{msg}</div>}

          <div className="grid grid-cols-3 gap-4 mb-4">
            {filteredMenus.length > 0 ? (
              filteredMenus.map((menu) => (
                <div key={menu.id_menu} className="group flex flex-col border border-gray-100 bg-white shadow-md">
                  <img className="h-40 w-full object-cover" src={menu.url_gambar} alt={menu.nama_menu} />
                  <div className="p-4">
                    <h5 className="text-lg font-semibold">{menu.nama_menu}</h5>
                    <p>{menu.jenis}</p>
                    <p>{menu.deskripsi}</p>
                    <p className="text-xl font-bold">Rp.{menu.harga}</p>
                    <button className="bg-blue-500 text-white px-2 py-1 rounded mt-2" onClick={() => addToCart(menu)}>
                      Tambah
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>Tidak ada menu tersedia.</p>
            )}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="col-span-1 p-4 border-l border-gray-900">
        <h2 className="font-bold text-2xl mb-4">Pesanan:</h2>
        {cartMsg && <div className="text-red-500 mb-4">{cartMsg}</div>}
        {cartItems.length > 0 ? (
          cartItems.map(item => (
            <div key={item.id_menu} className="flex justify-between items-center mb-4 border-b border-gray-900">
              <div>
                <p className="font-semibold">{item.nama_menu}</p>
                <p>Jumlah: {item.jumlah}</p>
                <p>Harga: Rp.{item.harga * item.jumlah}</p>
              </div>
              <div className="grid grid-rows-2 gap-4">
                <button onClick={() => kurangJumlah(item.id_menu)} className="text-red-500">kurang</button>
                <button onClick={() => deleteFromCart(item.id_menu)} className="text-red-500">Hapus</button>
              </div>
            </div>
          ))
        ) : (
          <p>Keranjang kosong</p>
        )}
        <p className="font-bold">Total: Rp.{cartItems.reduce((acc, item) => acc + item.harga * item.jumlah, 0)}</p>
         <button className="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full" onClick={handleCheckout}>
          Kirim
        </button>
      </div>
    </div>
  )
}
