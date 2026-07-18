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

const NavItem = ({ icon, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
    <Icon name={icon} size={18} /> {label}
  </div>
);

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
    <div style={styles.layout}>
      {sidebarOpen && <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* SIDEBAR - persis seperti admin */}
      <aside style={{ ...styles.sidebar, ...(sidebarOpen ? { transform: "translateX(0)" } : {}) }}>
        <div style={styles.sidebarTop}>
          <div style={styles.logoSection}>
            <div style={styles.logoIcon}>🧺</div>
            <div>
              <h1 style={styles.logoText}>Pinang Laundry</h1>
              <p style={styles.logoSub}>Bersih, Cepat, Terpercaya</p>
            </div>
          </div>

          <nav style={styles.nav}>
            {(menuItemsByRole[karyawan.role] || menuItemsByRole["Staff (Kasir)"]).map((item) => {
              const active = location.pathname === item.path;
              return (
                <div
                  key={item.path}
                  onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                  style={{ ...styles.navItem, ...(active ? styles.navActive : {}) }}
                >
                  <NavItem icon={item.icon} label={item.label} />
                </div>
              );
            })}
          </nav>
        </div>

        {/* Profile Widget - bawah sidebar */}
        <div style={styles.profileWidget}>
          <div style={styles.avatarCircle}><Icon name="user" size={18} /></div>
          <div style={{ flex: 1 }}>
            <div style={styles.profName}>{karyawan.name || "Karyawan"}</div>
            <div style={styles.profRole}>{karyawan.role}</div>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </aside>

      {/* Main */}
      <div style={styles.main}>
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={styles.menuBtn}>
              <Icon name="menu2" size={20} />
            </button>
            <div>
              <span style={styles.greeting}>Halo, {karyawan.name || "Karyawan"} 👋 </span>
              <span style={{ ...styles.roleBadge, background: {"Staff (Kasir)": "#10b981", "Staff (Cuci)": "#8b5cf6", "Staff (Delivery)": "#f59e0b"}[karyawan.role] || "#10b981" }}>{karyawan.role}</span>
            </div>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.notifBtn}>
              <Icon name="bell" size={18} />
              <span style={styles.notifDot}></span>
            </div>
            <div style={styles.avatarHeader}>
              <Icon name="user" size={16} />
            </div>
          </div>
        </header>

        <main style={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

const styles = {
  layout: { display: "flex", minHeight: "100dvh", fontFamily: "'Inter', sans-serif", background: "#f1f5f9" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 40 },

  sidebar: {
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
    transition: "transform 0.3s",
  },
  sidebarTop: { display: "flex", flexDirection: "column", gap: 40 },
  logoSection: { display: "flex", alignItems: "center", gap: 12 },
  logoIcon: {
    width: 40, height: 40, background: "rgba(255,255,255,0.2)", borderRadius: "50%",
    display: "flex", justifyContent: "center", alignItems: "center", fontSize: 20,
    backdropFilter: "blur(4px)",
  },
  logoText: { fontSize: 18, fontWeight: 700, color: "#fff", margin: 0 },
  logoSub: { fontSize: 10, color: "rgba(255,255,255,0.6)", margin: 0 },
  nav: { display: "flex", flexDirection: "column", gap: 6 },
  navItem: {
    padding: "12px 16px", borderRadius: 12, color: "rgba(255,255,255,0.75)",
    fontSize: 14, fontWeight: 500, cursor: "pointer", display: "flex", transition: "all 0.2s",
  },
  navActive: { background: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 700 },

  profileWidget: { display: "flex", alignItems: "center", gap: 12, padding: 14 },
  avatarCircle: {
    width: 40, height: 40, background: "rgba(255,255,255,0.2)", borderRadius: "50%",
    display: "flex", justifyContent: "center", alignItems: "center",
    color: "rgba(255,255,255,0.75)",
  },
  profName: { fontSize: 14, fontWeight: 600, color: "#fff" },
  profRole: { fontSize: 10, color: "rgba(255,255,255,0.6)" },
  logoutBtn: { background: "#ef4444", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#fff", padding: "10px 16px", borderRadius: 10 },

  main: { flex: 1, marginLeft: 260, display: "flex", flexDirection: "column" },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 24px", background: "#fff", borderBottom: "1px solid #e2e8f0",
    position: "sticky", top: 0, zIndex: 30,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 12 },
  menuBtn: { display: "none", background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: 8, color: "#475569" },
  greeting: { fontSize: 15, fontWeight: 600, color: "#0f172a", display: "inline" },
  roleBadge: {
    display: "inline-block", padding: "2px 10px", borderRadius: 20,
    fontSize: 11, fontWeight: 600, color: "#fff",
  },
  headerRight: { display: "flex", alignItems: "center", gap: 12 },
  notifBtn: {
    position: "relative", width: 36, height: 36, borderRadius: "50%", background: "#f1f5f9",
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b",
  },
  notifDot: { position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: "50%", background: "#ef4444" },
  avatarHeader: {
    width: 36, height: 36, borderRadius: "50%", background: "#e0e7ff",
    display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb",
  },
  content: { flex: 1, padding: 24 },
};
