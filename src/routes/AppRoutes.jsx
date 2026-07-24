import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import CustomerLoginPage from "../pages/auth/CustomerLoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import Dashboard from "../pages/admin/Dashboard";
import Orderan from "../pages/admin/Orderan";
import Transaksi from "../pages/admin/Transaksi";
import Pelanggan from "../pages/admin/Pelanggan";
import Karyawan from "../pages/admin/Karyawan";
import Laporan from "../pages/admin/Laporan";
import Pengaturan from "../pages/admin/Pengaturan";
import AdminLayanan from "../pages/admin/Layanan";
import CustomerDashboard from "../pages/customer/CustomerDashboard";
import KaryawanLoginPage from "../pages/karyawan/KaryawanLoginPage";
import KaryawanLayout from "../pages/karyawan/KaryawanLayout";
import KaryawanDashboard from "../pages/karyawan/KaryawanDashboard";
import KaryawanTransaksi from "../pages/karyawan/KaryawanTransaksi";
import KaryawanLaporan from "../pages/karyawan/KaryawanLaporan";
import KaryawanPengaturan from "../pages/karyawan/KaryawanPengaturan";
import LandingPage from "../pages/LandingPage";
import LayananPage from "../pages/LayananPage";
import TentangPage from "../pages/TentangPage";
import KontakPage from "../pages/KontakPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/layanan" element={<LayananPage />} />
        <Route path="/tentang" element={<TentangPage />} />
        <Route path="/kontak" element={<KontakPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/customer/login" element={<CustomerLoginPage />} />
        <Route path="/customer/register" element={<RegisterPage />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/layanan" element={<AdminLayanan />} />
        <Route path="/orderan" element={<Orderan />} />
        <Route path="/transaksi" element={<Transaksi />} />
        <Route path="/pelanggan" element={<Pelanggan />} />
        <Route path="/admin/karyawan" element={<Karyawan />} />
        <Route path="/laporan" element={<Laporan />} />
        <Route path="/pengaturan" element={<Pengaturan />} />
        <Route path="/karyawan/login" element={<KaryawanLoginPage />} />
        <Route path="/karyawan" element={<KaryawanLayout />}>
          <Route path="dashboard" element={<KaryawanDashboard />} />
          <Route path="transaksi" element={<KaryawanTransaksi />} />
          <Route path="laporan" element={<KaryawanLaporan />} />
          <Route path="pengaturan" element={<KaryawanPengaturan />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}