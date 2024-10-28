import React, {useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import {useNavigate, Link} from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [reqUsername, setUsername] = useState("");
    const [reqPassword, setPassword] = useState("");
    const [msg, setMsg] = useState("");

    const Auth = async (e) => {
        e.preventDefault();
    
        if (reqUsername === '' || reqPassword === '') {
          setMsg('username dan password tidak boleh kosong');
          return;   
        }
    
        try {
            const response = await axios.post('http://localhost:3000/login', {
                reqUsername: reqUsername,
                reqPassword: reqPassword
            }, {
                withCredentials: true
            });

            const { accessToken } = response.data;

            // Simpan token dan role di localStorage
            localStorage.setItem('accessToken', accessToken);
            const decoded = jwtDecode(localStorage.getItem('accessToken'));

            if (decoded.role === 'admin') {
                navigate('/admin/user');
            } else if (decoded.role === 'kasir') {
                navigate('/kasir/menu');
            } else if (decoded.role === 'manajer') {
                navigate('/manajer/transaksi');
            } else {
                navigate('/');
            }
    
        } catch (error) {
          if(error.response) {
            setMsg(error.response.data.msg)
          }
        }
    }
    
    return (
        <section className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className='mb-8 text-center font-semibold text-3xl antialiased text-neutral-800'>
                    <h1>WIKUSAMA CAFE</h1>
                </div>
                <div className="w-full bg-gray-200 rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-200">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-semibold leading-tight tracking-tight md:text-2xl text-neutral-800 dark:text-neutral-800">
                            Masuk ke akun
                        </h1>
                        <p className='text-center text-red-600'>{msg}</p>
                        <form onSubmit={Auth} className="space-y-4 md:space-y-6">
                            <div>
                                <label htmlFor="username" className="block mb-2 text-sm font-medium text-neutral-800 dark:text-neutral-800">Username</label>
                                <input type="username" 
                                    name="username" 
                                    id="username" 
                                    className="text-gray-900 rounded-lg focus:ring-2 outline-none focus:ring-blue-500 block w-full p-2.5" 
                                    value={reqUsername}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="username" 
                                    required 
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-neutral-800 dark:text-neutral-800">Password</label>
                                <input type="password" 
                                    name="password" 
                                    id="password" 
                                    placeholder="••••••••" 
                                    className="text-gray-900 rounded-lg focus:ring-2 outline-none focus:ring-blue-500 block w-full p-2.5" 
                                    value={reqPassword}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                    />
                            </div>
                            <button 
                                type="submit" 
                                className="w-full text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-700 dark:hover:bg-red-900">
                                Sign in
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;