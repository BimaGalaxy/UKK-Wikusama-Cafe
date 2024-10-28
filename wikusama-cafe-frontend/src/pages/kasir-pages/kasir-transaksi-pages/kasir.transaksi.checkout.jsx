import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function KasirTransaksiCheckout() {
    const token = localStorage.getItem("accessToken");
    const navigate = useNavigate();

    const [msg, setMsg] = useState('');
    const [mejas, setMejas] = useState([]);
    const [transaksiData, setTransaksiData] = useState({
        nama_pelanggan: "",
        nomor_meja: "",    
    });
    
    const [selectedStatus, setSelectedStatus] = useState("selesai"); // Mengatur status meja ke 'selesai'
    const filteredMejas = mejas.filter((meja) => meja.status_meja === selectedStatus);

    const location = useLocation();
    const cartItems = location.state?.cartItems || [];

    useEffect(() => {
        getAllMeja();
    }, []);


    const getAllMeja = async () => {
        try {
            const response = await axios.get('http://localhost:3000/meja', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMejas(response.data);    
        } catch (error) {
            console.error("Error fetching meja:", error);
            setMsg("Gagal mengambil data meja.");
        }
    };

    const handleSubmitTransaksi = async (event) => {
        event.preventDefault(); // Mencegah default form submission
        console.log("data dikirim :", transaksiData);
        
        const order_detail = cartItems.map(item => ({
            id_menu: item.id_menu,
            jumlah: item.jumlah
        }));

        const requestData = {
            nama_pelanggan: transaksiData.nama_pelanggan,
            nomor_meja: transaksiData.nomor_meja,
            order_detail: order_detail
        };

        try {
            const response = await axios.post('http://localhost:3000/transaksi', requestData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });
            
            if (response.data.success) {
                const idTransaksi = response.data.data.id_transaksi;
                // menghapus cart sebelumnya
                localStorage.removeItem("cart");
                // menambah cart baru berdasarkan id transaksi
                localStorage.setItem(`cart_${idTransaksi}`, JSON.stringify(order_detail));
                window.alert('Transaksi berhasil!');
                navigate("/kasir/transaksi");
            } else {
                setMsg("Transaksi gagal. Silakan coba lagi.");
            }
        } catch (error) {
            console.error("Error during transaction:", error);
            setMsg("Terjadi kesalahan saat membuat transaksi.");
        }
    };
    

    return (
        <div>
            <div className="font-bold h-12 px-4 py-4 text-3xl">Checkout</div>
            <div className='p-4'>
                {msg && <div className="text-red-500 mb-4">{msg}</div>}
                <form className='flex flex-col w-6/12' onSubmit={handleSubmitTransaksi}>
                    <div className='flex flex-col mb-4'>
                        <label htmlFor="nama_user" className="text-sm mb-2">Nama Pelanggan:</label>
                        <input
                            type="text"
                            name="nama_pelanggan"
                            placeholder='Nama pelanggan'
                            onChange={(e) => setTransaksiData({ ...transaksiData, nama_pelanggan: e.target.value })}
                            className="border rounded shadow-md p-2 outline-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className='flex flex-col mb-4'>
                        <label className="text-sm mb-2 ">Pilih meja:</label>
                        <select
                            name="nomor_meja"
                            value={transaksiData.nomor_meja}  // Set value untuk mengontrol nilai yang dipilih
                            onChange={(e) => {
                                setTransaksiData({ ...transaksiData, nomor_meja: e.target.value });
                            }}
                            className="border rounded p-2 outline-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" disabled>Pilih meja:</option>
                            {filteredMejas.length > 0 ? (
                                filteredMejas.map((meja) => (
                                    <option key={meja.id_meja} value={meja.nomor_meja}>{meja.nomor_meja}</option>
                                ))
                            ) : (
                                <option value="">Tidak ada meja yang tersedia</option>
                            )}
                        </select>

                    </div>
                    <h2 className="font-bold text-2xl mb-4">Pesanan:</h2>
                    {cartItems.length > 0 ? (
                        cartItems.map(item => (
                            <div key={item.id_menu} className="flex justify-between items-center mb-4 border-b border-gray-900 w-72">
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
                    <p className="font-bold">Total: Rp.{cartItems.reduce((acc, item) => acc + item.harga * item.jumlah, 0)}</p>
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full">
                        Checkout
                    </button>
                </form>
            </div>
        </div>
    );
}
