import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function KasirTransaksiEdit() {
    const token = localStorage.getItem("accessToken");
    const { id_transaksi } = useParams();
    const navigate = useNavigate();

    const [cartLama, setCartLama] = useState(JSON.parse(localStorage.getItem(`cart_${id_transaksi}`)) || []);
    const [cartBaru, setCartBaru] = useState([]);

    const [menus, setMenus] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchMsg, setSearchMsg] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [msg, setMsg] = useState('');
    const [cartMsg, setCartMsg] = useState('');

    useEffect(() => {
        getAllMenu();
    }, [])

    const cartLamaItems = cartLama.map(cartItem => {
        const menuItem = menus.find(menu => menu.id_menu === cartItem.id_menu);
        return {
            ...menuItem,
            jumlah: cartItem.jumlah
        };
    });
    const total_harga_lama = cartLamaItems.reduce((acc, item) => acc + item.harga * item.jumlah, 0);

    const cartBaruItems = cartBaru.map(cartItem => {
        const menuItem = menus.find(menu => menu.id_menu === cartItem.id_menu);
        return {
            ...menuItem,
            jumlah: cartItem.jumlah
        };
    })

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

    const addToCartBaru = (menu) => {
        const updatedCartBaru = [...cartBaru];
        const index = updatedCartBaru.findIndex(item => item.id_menu === menu.id_menu);

        if (index !== -1) {
            // Tambah jumlah jika item sudah ada
            updatedCartBaru[index].jumlah += 1;
        } else {
            // Tambah item baru jika belum ada
            updatedCartBaru.push({ id_menu: menu.id_menu, jumlah: 1 });
        }

        setCartBaru(updatedCartBaru);
        localStorage.setItem(`cart_${id_transaksi}_baru`, JSON.stringify(updatedCartBaru));
    };

    const deleteFromCartBaru = (id_menu) => {
        const updatedCartBaru = cartBaru.filter(item => item.id_menu !== id_menu);
        setCartBaru(updatedCartBaru);
        const localBaru = localStorage.setItem(`cart_${id_transaksi}_baru`, JSON.stringify(updatedCartBaru));
        if (updatedCartBaru.length === 0) {
            localStorage.removeItem(`cart_${id_transaksi}_baru`);
        }
    };

    const kurangJumlahBaru = (id_menu) => {
        const updatedCartBaru = [...cartBaru];
        const index = updatedCartBaru.findIndex(item => item.id_menu === id_menu);

        if (index !== -1) {
            // Kurangi jumlah jika item ada di keranjang
            updatedCartBaru[index].jumlah -= 1;

            // Hapus item jika jumlahnya 0
            if (updatedCartBaru[index].jumlah === 0) {
                deleteFromCartBaru(id_menu);
            } else {
                setCartBaru(updatedCartBaru);
                localStorage.setItem(`cart_${id_transaksi}_baru`, JSON.stringify(updatedCartBaru));
            }
        }
    };

    const handleUpdateTransaksi = async (event) => {
        event.preventDefault();
        const cartLama = JSON.parse(localStorage.getItem(`cart_${id_transaksi}`)) || [];
        console.log("cart baru", cartBaru);
        const combinedCart = [...cartLama];
        
        try {
            const response = await axios.patch(`http://localhost:3000/transaksi/add/${id_transaksi}`, {
                order_detail: cartBaru
            },{
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.data.success) {
                // gabungkan cart baru dan cart lamaa
                cartBaru.forEach(itemBaru => {
                    const index = combinedCart.findIndex(itemLama => itemLama.id_menu === itemBaru.id_menu);
                    if (index !== -1) {
                        // Jika id_menu sama, tambahkan jumlahnya
                        combinedCart[index].jumlah += itemBaru.jumlah;
                    } else {
                        // Jika id_menu tidak ada, tambahkan item baru
                        combinedCart.push({ id_menu: itemBaru.id_menu, jumlah: itemBaru.jumlah });
                    }
                });

                localStorage.setItem(`cart_${id_transaksi}`, JSON.stringify(combinedCart));
                localStorage.removeItem(`cart_${id_transaksi}_baru`);   
                window.alert('Update transaksi berhasil!');
                navigate('/kasir/transaksi');
            }
        } catch (error) {
            console.error("Error during transaction:", error);
            setMsg("Terjadi kesalahan saat membuat transaksi.");
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
                                        <button className="bg-blue-500 text-white px-2 py-1 rounded mt-2" onClick={() => addToCartBaru(menu)}>
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

            {/* Cart pesanan pertama */}
            <div className="col-span-1 p-4 border-l border-gray-900">
                <h2 className="font-bold text-2xl mb-4">Pesanan:</h2>
                <h4 className="font-bold mb-2">Pesanan lama:</h4>
                {cartLamaItems.length > 0 ? (
                    cartLamaItems.map(item => (
                        <div key={item.id_menu} className="flex justify-between items-center mb-4 border-b border-gray-900">
                            <div>
                                <p className="font-semibold">{item.nama_menu}</p>
                                <p>Jumlah: {item.jumlah}</p>
                                <p>Harga: Rp.{item.harga * item.jumlah}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Keranjang kosong</p>
                )}
                <h4 className="font-bold mb-2">Pesanan baru:</h4>
                {cartMsg && <div className="text-red-500 mb-4">{cartMsg}</div>}
                {cartBaruItems.length > 0 ? (
                    cartBaruItems.map(item => (
                        <div key={item.id_menu} className="flex justify-between items-center mb-4 border-b border-gray-900">
                            <div>
                                <p className="font-semibold">{item.nama_menu}</p>
                                <p>Jumlah: {item.jumlah}</p>
                                <p>Harga: Rp.{item.harga * item.jumlah}</p>
                            </div>
                            <div className="grid grid-rows-2 gap-4">
                                <button onClick={() => kurangJumlahBaru(item.id_menu)} className="text-red-500">kurang</button>
                                <button onClick={() => deleteFromCartBaru(item.id_menu)} className="text-red-500">Hapus</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Keranjang kosong</p>
                )}
                <p className="font-bold">Total: Rp.{total_harga_lama + cartBaruItems.reduce((acc, item) => acc + item.harga * item.jumlah, 0)}</p>
                <button className="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full" onClick={handleUpdateTransaksi}>
                    Simpan
                </button>
            </div>
        </div>
    )
}
