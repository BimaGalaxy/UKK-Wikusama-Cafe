import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function KasirMeja() {
    const token = localStorage.getItem("accessToken");
    const [mejas, setMejas] = useState([]);
    const [selectedJenis, setSelectedJenis] = useState("");
    const [msg, setMsg] = useState('');

    useEffect(() => {
        getAllMeja();
    }, [])

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
        }
    }
    
    const handleJenisChange = async (e) => {
        setSelectedJenis(e.target.value);
    } 

    const filteredMejas = selectedJenis
        ? mejas.filter((meja) => meja.status_meja === selectedJenis)
        : mejas;
    
    return (
        <div>
            <div className="font-bold h-12 px-4 text-3xl content-center">Meja</div>
            <div className="p-4">

                <div className="flex flex-row justify-between items-center mb-4">
                    <select
                        className="border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:border-none focus:ring-2 focus:ring-blue-500"
                        value={selectedJenis}
                        onChange={handleJenisChange}
                    >
                        <option value="">Semua Meja</option>
                        <option value='digunakan'>Digunakan</option>
                        <option value='selesai'>Tidak Digunakan</option>
                    </select>
                </div>

                <p className="text-red-600">{msg}</p>
                <table className="w-9/12 bg-white borde">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="w-10 border border-gray-400">No</th>
                            <th className="w-10 border border-gray-400">Nomor Meja</th>
                            <th className="w-10 border border-gray-400">Status Meja</th>
                        </tr>
                    </thead>
                    <tbody> 
                        {filteredMejas.length > 0 ? (
                            filteredMejas.map((meja, index) => (
                                <tr key={meja.id_meja}>
                                    <td className="px-4 py-2 border border-gray-400">{index + 1}</td>
                                    <td className="px-4 py-2 border border-gray-400">{meja.nomor_meja}</td>
                                    <td className="px-4 py-2 border border-gray-400">{meja.status_meja}</td>
                                </tr>       
                            ))
                        ):(
                            <tr>
                                <td colSpan={3} className="text-center">Tidak ada meja</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
