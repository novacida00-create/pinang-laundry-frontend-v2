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

const NavItem = ({ icon, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <Icon name={icon} size={18} /> {label}
  </div>
);

export default function KaryawanLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const karyawan = JSON.parse(localStorage.getItem("karyawan") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("karyawan");
    navigate("/karyawan/login");
  };

  return (
    <div className="main-layout" style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      <input type="checkbox" id="mt" className="mt-i" />

      {/* SIDEBAR */}
      <div className="main-sidebar-wrap" style={{ width: 260, flexShrink: 0 }}>
        <aside style={styles.sidebar}>
          <div>
            <div style={styles.logo}>🧺 <b>Pinang Laundry</b></div>
            <nav style={styles.nav}>
              {(menuItemsByRole[karyawan.role] || menuItemsByRole["Staff (Kasir)"]).map((item) => {
                const active = location.pathname === item.path;
                return (
                  <div key={item.path} onClick={() => navigate(item.path)} style={{ ...styles.link, ...(active ? { background: "#2563eb" } : {}) }}>
                    <NavItem icon={item.icon} label={item.label} />
                  </div>
                );
              })}
            </nav>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: 16, marginTop: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", flexShrink: 0 }}>
                <Icon name="user" size={18} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{karyawan.name || "Karyawan"}</div>
            </div>
            <button onClick={handleLogout} style={{ width: "100%", padding: "10px", background: "#ef4444", border: "none", borderRadius: 8, color: "#fff", fontWeight: 600, cursor: "pointer" }}>Logout</button>
          </div>
        </aside>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content" style={{ flex: 1, padding: 20, background: "#f0f7ff", position: "relative" }}>
        <label htmlFor="mt" className="mt-l">
          <span style={{ display: "block", width: 20, height: 2, background: "#fff", borderRadius: 2 }}></span>
          <span style={{ display: "block", width: 20, height: 2, background: "#fff", borderRadius: 2 }}></span>
          <span style={{ display: "block", width: 20, height: 2, background: "#fff", borderRadius: 2 }}></span>
        </label>
        <Outlet />
      </div>
    </div>
  );
}

const styles = {
  sidebar: {
    width: 260,
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
    background: "#1e40af",
    color: "white",
    padding: 20,
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  logo: { fontSize: 18, marginBottom: 20 },
  nav: { display: "flex", flexDirection: "column", gap: 8 },
  link: {
    padding: "10px",
    borderRadius: 8,
    textDecoration: "none",
    color: "white",
    display: "block",
    cursor: "pointer",
  },
};
