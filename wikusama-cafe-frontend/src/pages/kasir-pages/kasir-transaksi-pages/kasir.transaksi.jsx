import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function KasirTransaksi() {
    const token = localStorage.getItem("accessToken");
    const navigate = useNavigate();

    const [transaksis, setTransaksis] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchMsg, setSearchMsg] = useState("");

    useEffect(() => {
        getAllTransaksi();
    }, [])

    const getAllTransaksi = async () => {
        try {
            const response = await axios.get('http://localhost:3000/transaksi/me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.data.success) {
                setTransaksis(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        setSearchMsg("");

        if (!searchQuery.trim()) {
            getAllTransaksi();
            return;
        }

        try {
            const response = await axios.get(`http://localhost:3000/transaksi/search/${searchQuery}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setTransaksis(response.data.data);
                setSearchMsg("");
            } else {
                setSearchMsg('Transaksi tidak ditemukan');
            }
        } catch (error) {
            setSearchMsg("Terjadi kesalahan saat melakukan pencarian.");
        }
    }

    const handleEditTransaksi = async (id_transaksi) => {
        navigate(`/kasir/transaksi/edit/${id_transaksi}`)
    }

    const handleEndTransaksi = async (id_transaksi) => {
        navigate(`/kasir/transaksi/end/${id_transaksi}`)
    }

    return (
        <div>
            <div className="font-bold h-12 px-4 text-3xl content-center">Daftar Transaksi</div>
            <div className="p-4">
                <div className="flex flex-row justify-between items-center mb-4">
                    {/* search bar */}
                    <div className="max-w-md">
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
                                placeholder="Cari pelanggan"
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
                <table className="w-full bg-white">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="w-10">No</th>
                            <th className="px-4 py-2">Nama Pelanggan</th>
                            <th className="px-4 py-2">Total Harga</th>
                            <th className="px-4 py-2">Status</th>
                            <th colSpan={2} className="px-4 py-2 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transaksis.length > 0 ? (
                            transaksis.map((transaksi, index) => (
                                <tr key={transaksi.id_transaksi}>
                                    <td className="border px-4 py-2">{index + 1}</td>
                                    <td className="border px-4 py-2">{transaksi.nama_pelanggan}</td>
                                    <td className="border px-4 py-2">{transaksi.total_harga}</td>
                                    <td className="border px-4 py-2">{transaksi.status_transaksi}</td>
                                    {transaksi.status_transaksi === "lunas" ? (
                                        <td className="border px-4 py-2 text-center" colSpan={2}>
                                            <button
                                                className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                                onClick={() => navigate(`/transaksi/detail/${transaksi.id_transaksi}`)}
                                            >
                                                Nota transaksi
                                            </button>
                                        </td>
                                    ) : (
                                        <>
                                            <td className="border px-4 py-2 text-center">
                                                <button
                                                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                                                    onClick={() => handleEditTransaksi(transaksi.id_transaksi)}
                                                >
                                                    Tambah
                                                </button>
                                            </td>
                                            <td className="border px-4 py-2 text-center">
                                                <button
                                                    className="bg-green-400 text-white px-2 py-1 rounded mr-2"
                                                    onClick={() => handleEndTransaksi(transaksi.id_transaksi)}
                                                >
                                                    Selesai
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center">Tidak ada transaksi</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
