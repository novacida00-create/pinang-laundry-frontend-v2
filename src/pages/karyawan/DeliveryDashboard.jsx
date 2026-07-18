import { useState, useEffect } from "react";
import Icon from "../../utils/icons";

export default function DeliveryDashboard() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ siap_diambil: 0, diambil: 0, total_pengiriman: 0 });
  const karyawan = JSON.parse(localStorage.getItem("karyawan") || "{}");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();

      const siapDiambil = data.filter((o) => o.status === "Selesai").length;
      const diambil = data.filter((o) => o.status === "Diambil").length;

      setStats({ siap_diambil: siapDiambil, diambil: diambil, total_pengiriman: siapDiambil + diambil });
      setOrders(data.filter((o) => o.status === "Selesai" || o.status === "Diambil"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchOrders();
    } catch (err) {
      alert("Gagal update status");
    }
  };

  const formatRp = (n) => "Rp " + (n || 0).toLocaleString("id-ID");

  const statusColor = (s) => {
    switch (s) {
      case "Selesai": return { bg: "#dcfce7", color: "#166534" };
      case "Diambil": return { bg: "#e0e7ff", color: "#3730a3" };
      default: return { bg: "#f1f5f9", color: "#475569" };
    }
  };

  return (
    <div>
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>Dashboard Delivery</h2>
        <p style={styles.pageSub}>Selamat datang, {karyawan.name}</p>
      </div>

      {/* Stat Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: "#fef3c7", color: "#d97706" }}>
            <Icon name="shoppingCart" size={24} />
          </div>
          <div>
            <div style={styles.statLabel}>Siap Diambil</div>
            <div style={styles.statNum}>{stats.siap_diambil}</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: "#e0e7ff", color: "#3730a3" }}>
            <Icon name="car" size={24} />
          </div>
          <div>
            <div style={styles.statLabel}>Sedang Dikirim</div>
            <div style={styles.statNum}>{stats.diambil}</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: "#dcfce7", color: "#16a34a" }}>
            <Icon name="check" size={24} />
          </div>
          <div>
            <div style={styles.statLabel}>Total Pengiriman</div>
            <div style={styles.statNum}>{stats.total_pengiriman}</div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div style={styles.tableCard}>
        <h3 style={styles.tableTitle}>Pesanan Untuk Diambil</h3>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>No. Nota</th>
                <th style={styles.th}>Pelanggan</th>
                <th style={styles.th}>Layanan</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const sc = statusColor(o.status);
                return (
                  <tr key={o.id}>
                    <td style={styles.td}>{o.order_code}</td>
                    <td style={styles.td}>{o.customer_name}</td>
                    <td style={styles.td}>{o.service_name}</td>
                    <td style={styles.td}>{formatRp(o.total)}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: sc.bg, color: sc.color }}>{o.status}</span>
                    </td>
                    <td style={styles.td}>
                      {o.status === "Selesai" && (
                        <button style={styles.pickupBtn} onClick={() => handleStatusChange(o.id, "Diambil")}>
                          <Icon name="car" size={14} /> Ambil
                        </button>
                      )}
                      {o.status === "Diambil" && (
                        <span style={{ fontSize: 12, color: "#64748b" }}>Dalam pengiriman</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr><td colSpan={6} style={{ ...styles.td, textAlign: "center", color: "#94a3b8" }}>Tidak ada pesanan</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageHeader: { marginBottom: 20 },
  pageTitle: { fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0 },
  pageSub: { fontSize: 13, color: "#64748b", margin: "4px 0 0" },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginBottom: 20,
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    background: "#fff",
    borderRadius: 14,
    padding: "20px 24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: { fontSize: 12, color: "#64748b", marginBottom: 2 },
  statNum: { fontSize: 20, fontWeight: 700, color: "#0f172a" },

  tableCard: {
    background: "#fff",
    borderRadius: 14,
    padding: 24,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  tableTitle: { fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 16px" },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left",
    padding: "10px 12px",
    fontSize: 12,
    fontWeight: 600,
    color: "#64748b",
    borderBottom: "2px solid #e2e8f0",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "10px 12px",
    fontSize: 13,
    color: "#334155",
    borderBottom: "1px solid #f1f5f9",
  },
  badge: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  pickupBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "6px 14px",
    borderRadius: 8,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
};
