import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function NotaTransaksi() {

    const { id_transaksi } = useParams();
    const [transaksi, setTransaksi] = useState(null);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("accessToken");
    const navigate = useNavigate();

    useEffect(() => {
        getTransaksi();
    }, [])

    const getTransaksi = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/transaksi/id/${id_transaksi}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.data.success) {
                setTransaksi(response.data.data);
            }
        } catch (error) {
            setError("Terjadi kesalahan saat mengambil data transaksi.");
            console.error(error);
        }
    }

    const aggregateDetails = () => {
        if (!transaksi || !transaksi.detail_transaksi) return [];

        const aggregated = transaksi.detail_transaksi.reduce((acc, detail) => {
            const { nama_menu, harga } = detail.menu;
            const existing = acc.find(item => item.nama_menu === nama_menu);

            if (existing) {
                existing.jumlah += detail.jumlah;
                existing.harga += detail.harga;
            } else {
                acc.push({
                    nama_menu,
                    jumlah: detail.jumlah,
                    harga: detail.harga,
                });
            }
            return acc;
        }, []);

        return aggregated;
    };

    const aggregatedDetails = aggregateDetails();

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!transaksi) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 ">WIKUSAMA CAFE</h1>
            <p><strong>Tanggal:</strong> {new Date(transaksi.tgl_transaksi).toLocaleString()}</p>
            <p><strong>Kasir:</strong> {transaksi.user.nama_user}</p>
            <p><strong>Pelanggan:</strong> {transaksi.nama_pelanggan}</p>
            <p><strong>Meja:</strong> {transaksi.meja.nomor_meja}</p>
            <p><strong>Status:</strong> {transaksi.status_transaksi}</p>
            <h2 className="text-2xl mt-4">Detail Pesanan:</h2>
            <table className="w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border px-4 py-2">Nama Menu</th>
                        <th className="border px-4 py-2">Jumlah</th>
                        <th className="border px-4 py-2">Harga</th>
                    </tr>
                </thead>
                <tbody>
                    {aggregatedDetails.map((detail, index) => (
                        <tr key={index}>
                            <td className="border px-4 py-2">{detail.nama_menu}</td>
                            <td className="border px-4 py-2">{detail.jumlah}</td>
                            <td className="border px-4 py-2">Rp {detail.harga.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h3 className="text-xl mt-4">
                <strong>Total Harga:</strong> Rp {transaksi.total_harga.toLocaleString()}
            </h3>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                onClick={() => window.print()}
            >
                Print Nota
            </button>
        </div>
    )
}
