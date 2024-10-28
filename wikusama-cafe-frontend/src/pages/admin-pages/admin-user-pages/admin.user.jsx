import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminUser() {
  const token = localStorage.getItem("accessToken");
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMsg, setSearchMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getUsers();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchMsg("");

    if (!searchQuery.trim()) {
      getUsers();
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/users/search/${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );

      if (response.data.success) {
        setUsers(response.data.data);
        setSearchMsg(''); // Kosongkan pesan error
      } else {
        setSearchMsg('User tidak ditemukan');
      }
    } catch (error) {
      console.error("Error searching for user:", error);
      if (error.response) {
        setSearchMsg(error.response.data.msg);
      } else {
        setSearchMsg("Terjadi kesalahan saat melakukan pencarian.");
      }
    }
  };

  const handleEdit = (id_user) => {
    navigate(`/admin/user/edit/${id_user}`);
  };

  const handleTambah = () => {
    navigate(`/admin/user/add`);
  };

  const handleDelete = async (id_user) => {
        const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus user ini?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:3000/user/delete/${id_user}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                window.alert('User berhasil dihapus!');
                getUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
  };

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const [userPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const indexOfLastUser = currentPage * userPerPage;
  const indexOfFirstUser = indexOfLastUser - userPerPage; 
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div>
      <div className="font-bold h-12 px-4 text-3xl content-center ">Users</div>
      <div className="p-4">
        <div className="flex flex-row justify-between items-center mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded h-12"
            onClick={() => handleTambah()}
          >
            Tambah User
          </button>

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
                placeholder="Cari user"
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
              <th className="px-4 py-2">Nama</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Role</th>
              <th colSpan={2} className="px-4 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((users, index) => (
              <tr key={users.id}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{users.nama_user}</td>
                <td className="border px-4 py-2">{users.username}</td>
                <td className="border px-4 py-2">{users.role}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleEdit(users.id_user)}
                  >
                    Edit
                  </button>
                </td>
                <td className="border px-4 py-2 text-center">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => handleDelete(users.id_user)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
