import {BrowserRouter, Route, Routes} from "react-router-dom"
import Login from "./pages/login.page"
import Logout from "./pages/logout.jsx"

import AdminLayout from "./components/admin-components/admin.layout.jsx"
import AdminUser from "./pages/admin-pages/admin-user-pages/admin.user.jsx"
import AdminFood from "./pages/admin-pages/admin-menu-pages/admin.menu.jsx"
import UnauthorizedPage from "./pages/unauthorized-page/unauthorized.page.jsx"
import ProtectedRoute from "./components/protected.route.jsx"
import AdminUserEdit from "./pages/admin-pages/admin-user-pages/admin.user.edit.jsx"
import AdminUserAdd from "./pages/admin-pages/admin-user-pages/admin.user.add.jsx"
import AdminMenuAdd from "./pages/admin-pages/admin-menu-pages/admin.menu.add.jsx"
import AdminMenuedit from "./pages/admin-pages/admin-menu-pages/admin.menu.edit.jsx"
import AdminMeja from "./pages/admin-pages/admin-meja-pages/admin.meja.jsx"
import AdminMejaEdit from "./pages/admin-pages/admin-meja-pages/admin.meja.edit.jsx"

import KasirLayout from "./components/kasir-components/kasir.layout.jsx"
import KasirMenu from "./pages/kasir-pages/kasir-menu-pages/kasir.menu.jsx"
import KasirMeja from "./pages/kasir-pages/kasir-meja-pages/kasir.meja.jsx"
import KasirTransaksiCheckout from "./pages/kasir-pages/kasir-transaksi-pages/kasir.transaksi.checkout.jsx"
import KasirTransaksi from "./pages/kasir-pages/kasir-transaksi-pages/kasir.transaksi.jsx"
import KasirTransaksiEdit from "./pages/kasir-pages/kasir-transaksi-pages/kasir.transaksi.edit.jsx"
import KasirTransaksiConfirmEnd from "./pages/kasir-pages/kasir-transaksi-pages/kasir.transaksi.confirm.end.jsx"

import ManajerLayout from "./components/manajer-components/manajer.layout.jsx"

import NotaTransaksi from "./pages/nota.transaksi.jsx"
import ManajerTransaksi from "./pages/manajer-pages/manajer.transaksi.jsx"


export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login/>}/>

        <Route path="/logout" element={<Logout/>}/>
        
        <Route path="/unauthorized" element={<UnauthorizedPage/>}/>

        <Route
          path="/transaksi/detail/:id_transaksi"
          element={<ProtectedRoute element={<NotaTransaksi />} allowedRoles={['kasir', 'manajer']}/>}
        />

        <Route element={<AdminLayout/>}>
          <Route
            path="/admin/user"
            element={<ProtectedRoute element={<AdminUser />} allowedRoles={['admin']} />}
          />
          <Route
            path="/admin/user/add"
            element={<ProtectedRoute element={<AdminUserAdd />} allowedRoles={['admin']} />}
          />
          <Route
            path="/admin/user/edit/:id_user"
            element={<ProtectedRoute element={<AdminUserEdit />} allowedRoles={['admin']} />}
          />

          <Route 
            path="/admin/menu" 
            element={<ProtectedRoute element={<AdminFood/>} allowedRoles={['admin']}/>}
          />
          <Route 
            path="/admin/menu/add" 
            element={<ProtectedRoute element={<AdminMenuAdd/>} allowedRoles={['admin']}/>}
          />
          <Route
            path="/admin/menu/edit/:id_menu"
            element={<ProtectedRoute element={<AdminMenuedit />} allowedRoles={['admin']} />}
          />

          <Route 
            path="/admin/meja" 
            element={<ProtectedRoute element={<AdminMeja/>} allowedRoles={['admin']}/>}
          />
          <Route 
            path="/admin/meja/edit/:id_meja" 
            element={<ProtectedRoute element={<AdminMejaEdit/>} allowedRoles={['admin']}/>}
          />
        </Route>

        <Route element={<KasirLayout/>}>
          <Route
            path="/kasir/menu"
            element={<ProtectedRoute element={<KasirMenu />} allowedRoles={['kasir']} />}
          />

          <Route
            path="/kasir/meja"
            element={<ProtectedRoute element={<KasirMeja />} allowedRoles={['kasir']} />}
          />

          <Route
            path="/kasir/transaksi"
            element={<ProtectedRoute element={<KasirTransaksi />} allowedRoles={['kasir']} />}
          />
          <Route
            path="/kasir/transaksi/checkout"
            element={<ProtectedRoute element={<KasirTransaksiCheckout />} allowedRoles={['kasir']} />}
          />
          <Route
            path="/kasir/transaksi/edit/:id_transaksi"
            element={<ProtectedRoute element={<KasirTransaksiEdit />} allowedRoles={['kasir']} />}
          />
          <Route
            path="/kasir/transaksi/end/:id_transaksi"
            element={<ProtectedRoute element={<KasirTransaksiConfirmEnd />} allowedRoles={['kasir']} />}
          />
        </Route>

        <Route element={<ManajerLayout />}>
          <Route
            path="/manajer/transaksi"
            element={<ProtectedRoute element={<ManajerTransaksi />} allowedRoles={['manajer']} />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}