import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ModalComponent from "../../../components/modal.component";

export default function KasirTransaksiConfirmEnd() {
    const token = localStorage.getItem("accessToken");
    const navigate = useNavigate();
    const { id_transaksi } = useParams();

    const [msg, setMsg] = useState('');
    
    const updateEndTransaksi = async () => {
        try {
            console.log(id_transaksi);
            console.log(token);
            
            const response = await axios.patch(`http://localhost:3000/transaksi/end/${id_transaksi}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (response.data.success) {
                localStorage.removeItem(`cart_${id_transaksi}`);
                window.alert("Transaksi berhasil diakhiri");
                navigate(`/transaksi/detail/${id_transaksi}`);
            }
        } catch (error) {
            console.error("Error during transaction:", error);
            setMsg("Terjadi kesalahan saat mengakhiri transaksi.");
        }
    }

     const closeModal = () => navigate('/kasir/transaksi');

    return (
        <ModalComponent isOpen={true} onClose={closeModal} title="Akhiri Transaksi?">
            {msg && <p className="text-red-500">{msg}</p>}
            <div className="flex flex-row gap-4">
                <button 
                    className="w-1/2 text-white bg-green-500 hover:bg-green-600 font-medium rounded-lg text-sm px-5 py-2.5"
                    onClick={updateEndTransaksi}
                >
                    Iya
                </button>

                <button type="submit" className="w-1/2 text-white bg-red-500 hover:bg-red-600 font-medium rounded-lg text-sm px-5 py-2.5"
                    onClick={closeModal}
                >
                    Tidak
                </button>
            </div>
        </ModalComponent>
    )
}
