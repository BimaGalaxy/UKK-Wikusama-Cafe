import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ModalComponent from "../../../components/modal.component";

export default function AdminMejaEdit() {
    const token = localStorage.getItem("accessToken");
    const [msg, setMsg] = useState('');
    const { id_meja } = useParams();
    const [mejaData, setMejaData] = useState({
        nomor_meja: '',
        status_meja: ''
    });
    const [status_mejas] = useState(['digunakan', 'selesai']); 
    const navigate = useNavigate();

    useEffect(() => {
        getMejaById();
    }, [])

    const getMejaById = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/meja/id/${id_meja}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.success) {
                setMejaData(response.data.data);
            }

        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }

    const updateMeja = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(`http://localhost:3000/meja/update/${id_meja}`, {
                nomor_meja: mejaData.nomor_meja,
                status_meja: mejaData.status_meja
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            window.alert('Meja berhasil diupdate!');
            navigate('/admin/meja');

        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    }

    const closeModal = () => navigate('/admin/meja');


    return (
        <ModalComponent isOpen={true} onClose={closeModal} title="Edit Meja">
            <form className="space-y-4" onSubmit={updateMeja}> 
                <p className="text-red-500">{msg}</p>
                <div>
                    <label htmlFor="nomor_meja" className="block mb-2 text-sm font-medium text-gray-900">
                        Nomor Meja
                    </label>
                    <input
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm rounded-lg block w-full p-2.5"
                        placeholder="Nomor Meja"
                        value={mejaData.nomor_meja}
                        onChange={(e) => setMejaData({ ...mejaData, nomor_meja: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="status_meja" className="block mb-2 text-sm font-medium text-gray-900">
                        Status Meja
                    </label>
                    <select
                        name="status_meja"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                        value={mejaData.status_meja || ""}
                        onChange={(e) => setMejaData({ ...mejaData, status_meja: e.target.value })}
                        required
                    >
                        <option value="" disabled>Pilih status</option>
                        {status_mejas.map((status_meja) => (
                            <option key={status_meja} value={status_meja}>{status_meja}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5">
                    Simpan Perubahan
                </button>
            </form>
        </ModalComponent>

    )
}
