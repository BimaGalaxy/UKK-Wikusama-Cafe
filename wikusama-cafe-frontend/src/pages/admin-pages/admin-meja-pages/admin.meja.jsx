import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ModalComponent from "../../../components/modal.component";

export default function AdminMenu() {
  const token = localStorage.getItem("accessToken");
  const [mejas, setMejas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMsg, setSearchMsg] = useState("");
  const navigate = useNavigate();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [mejaData, setMejaData] = useState({
    nomor_meja: '',
    status_meja: ''
  });

  // Modal 
  const openAddModal = () => {
    setMejaData({ nomor_meja: "" });
    setIsAddModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    getMeja();
  }, [])

  const getMeja = async () => {
    try {
      const response = await axios.get('http://localhost:3000/meja', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setMejas(response.data)
    } catch (error) {
      setSearchMsg("Terjadi kesalahan saat mengambil data meja.")
    }
  }

  const addMeja = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/meja', {
        nomor_meja: mejaData.nomor_meja,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.alert('Meja berhasil ditambahkan!');
      closeModal();
      getMeja();
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  }

  const handleEdit = (id_meja) => {
    navigate(`/admin/meja/edit/${id_meja}`);
  };

  const handleDelete = async (id_meja) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus meja ini?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:3000/meja/delete/${id_meja}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        window.alert('Meja berhasil dihapus!');
        getMeja();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  }

  return (
    <div>
      <div className="font-bold h-12 px-4 text-3xl content-center">Meja</div>
      <div className="p-4">
        <div className="flex flex-row justify-between items-center mb-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={openAddModal}>
            Tambah Meja
          </button>
        </div>

        <p className="text-red-600">{searchMsg}</p>
        <table className="w-9/12 bg-white borde">
          <thead className="bg-gray-200">
            <tr>
              <th className="w-10 border border-gray-400">No</th>
              <th className="px-4 py-2 border border-gray-400">Nomor Meja</th>
              <th className="px-4 py-2 border border-gray-400">Status Meja</th>
              <th colSpan={2} className="px-4 py-2 text-center border border-gray-400">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {mejas.map((meja, index) => (
              <tr key={meja.id_meja}>
                <td className="=px-4 py-2 border border-gray-400">{index + 1}</td>
                <td className="=px-4 py-2 border border-gray-400">{meja.nomor_meja}</td>
                <td className="=px-4 py-2 border border-gray-400">{meja.status_meja}</td>
                <td className="=px-4 py-2 border text-center border-gray-400">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleEdit(meja.id_meja)}>Edit</button>
                </td>
                <td className="border px-4 py-2 text-center border-gray-400">
                  <button className="bg-red-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleDelete(meja.id_meja)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ModalComponent isOpen={isAddModalOpen} onClose={closeModal} title="Tambah Meja">
          <form className="space-y-4" onSubmit={addMeja}>
            <p className="text-red-500">{msg}</p>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                Meja
              </label>
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm rounded-lg block w-full p-2.5"
                placeholder="Meja"
                onChange={(e) => setMejaData({ ...mejaData, nomor_meja: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5">
              Tambah
            </button>
          </form>
        </ModalComponent>
        
      </div>
    </div>
  )
}
