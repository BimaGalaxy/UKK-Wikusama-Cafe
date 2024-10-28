import React, { useEffect } from 'react'
import { useNavigate, useLocation  } from "react-router-dom";

export default function logout() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(()=> {
        logout()   
    }, [])

    const logout = () => {
        const confirmLogout = window.confirm("Apakah Anda yakin ingin keluar?");
        if (confirmLogout) {
            localStorage.removeItem('accessToken')
            navigate('/')   
        } else {
            navigate(location.pathname);
        }
    }

  return (
    <div></div>
  )
}
