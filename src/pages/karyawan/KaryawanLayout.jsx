import { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Icon from "../../utils/icons";

const menuItemsByRole = {
  "Staff (Kasir)": [
    { path: "/karyawan/dashboard", icon: "dashboard", label: "Dashboard" },
    { path: "/karyawan/transaksi", icon: "creditCard", label: "Transaksi" },
    { path: "/karyawan/laporan", icon: "chartBar", label: "Laporan" },
    { path: "/karyawan/pengaturan", icon: "settings", label: "Pengaturan" },
  ],
  "Staff (Cuci)": [
    { path: "/karyawan/dashboard", icon: "dashboard", label: "Dashboard" },
    { path: "/karyawan/transaksi", icon: "creditCard", label: "Transaksi" },
    { path: "/karyawan/laporan", icon: "chartBar", label: "Laporan" },
    { path: "/karyawan/pengaturan", icon: "settings", label: "Pengaturan" },
  ],
  "Staff (Delivery)": [
    { path: "/karyawan/dashboard", icon: "dashboard", label: "Dashboard" },
    { path: "/karyawan/pengaturan", icon: "settings", label: "Pengaturan" },
  ],
};

export default function KaryawanLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const karyawan = JSON.parse(localStorage.getItem("karyawan") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("karyawan");
    navigate("/karyawan/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100dvh", fontFamily: "'Inter', sans-serif", background: "#f1f5f9" }}>
      {/* overlay */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 40 }} />}

      {/* SIDEBAR */}
      <aside style={{
        width: 260,
        background: "linear-gradient(180deg, #0f2b5e, #1e40af)",
        padding: "30px 24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
        transition: "transform 0.3s ease",
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 20 }}>🧺</div>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: 0 }}>Pinang Laundry</h1>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", margin: 0 }}>Bersih, Cepat, Terpercaya</p>
            </div>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {(menuItemsByRole[karyawan.role] || menuItemsByRole["Staff (Kasir)"]).map((item) => {
              const active = location.pathname === item.path;
              return (
                <div key={item.path} onClick={() => { navigate(item.path); setSidebarOpen(false); }} style={{ padding: "12px 16px", borderRadius: 12, fontSize: 14, fontWeight: active ? 700 : 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, color: active ? "#fff" : "rgba(255,255,255,0.75)", background: active ? "rgba(255,255,255,0.15)" : "transparent" }}>
                  <Icon name={item.icon} size={18} /> {item.label}
                </div>
              );
            })}
          </nav>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 14 }}>
          <div style={{ width: 40, height: 40, background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", color: "rgba(255,255,255,0.75)", flexShrink: 0 }}>
            <Icon name="user" size={18} />
          </div>
          <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#fff" }}>{karyawan.name || "Karyawan"}</div>
          <button onClick={handleLogout} style={{ background: "#ef4444", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#fff", padding: "10px 16px", borderRadius: 10 }}>Logout</button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", marginLeft: 0, minWidth: 0 }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", background: "#fff", borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, zIndex: 30 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* HAMBURGER BUTTON */}
            <div onClick={() => setSidebarOpen(!sidebarOpen)} style={{ width: 38, height: 38, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 5, background: "#f1f5f9", borderRadius: 10, cursor: "pointer", flexShrink: 0 }}>
              <span style={{ display: "block", width: 20, height: 2, background: "#475569", borderRadius: 2 }}></span>
              <span style={{ display: "block", width: 20, height: 2, background: "#475569", borderRadius: 2 }}></span>
              <span style={{ display: "block", width: 20, height: 2, background: "#475569", borderRadius: 2 }}></span>
            </div>
            <div>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>Halo, {karyawan.name || "Karyawan"} 👋 </span>
              <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, color: "#fff", background: { "Staff (Kasir)": "#10b981", "Staff (Cuci)": "#8b5cf6", "Staff (Delivery)": "#f59e0b" }[karyawan.role] || "#10b981" }}>{karyawan.role}</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative", width: 36, height: 36, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b" }}>
              <Icon name="bell" size={18} />
              <span style={{ position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }}></span>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb" }}>
              <Icon name="user" size={16} />
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: 24, overflow: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
