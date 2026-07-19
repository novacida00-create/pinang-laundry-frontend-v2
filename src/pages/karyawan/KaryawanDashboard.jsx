import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../utils/icons";

export default function KaryawanDashboard() {
  const navigate = useNavigate();
  const karyawan = JSON.parse(localStorage.getItem("karyawan") || "{}");
  const isDelivery = karyawan.role === "Staff (Delivery)";

  const [stats, setStats] = useState({ total_transaksi: 0, order_baru: 0, siap_diambil: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [deliveryStats, setDeliveryStats] = useState({ siap_diambil: 0, diambil: 0, total_pengiriman: 0 });
  const [deliveryOrders, setDeliveryOrders] = useState([]);

  // load data waktu pertama kali buka halaman
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/orders");
      const orders = await res.json();
      // console.log('orders:', orders)

      if (isDelivery) {
        // kalo role delivery, hitung yg delivery_mode kurir aja
        const deliveryOrders = orders.filter((o) => o.delivery_mode === "kurir");
        const siapDiambil = deliveryOrders.filter((o) => o.status === "Selesai").length;
        const diambil = deliveryOrders.filter((o) => o.status === "Diambil").length;
        setDeliveryStats({ siap_diambil: siapDiambil, diambil: diambil, total_pengiriman: siapDiambil + diambil });
        setDeliveryOrders(deliveryOrders.filter((o) => o.status === "Selesai" || o.status === "Diambil"));
      } else {
        const totalTransaksi = orders.reduce((sum, o) => sum + (o.total || 0), 0);
        const orderBaru = orders.filter((o) => o.status === "Menunggu").length;
        const siapDiambil = orders.filter((o) => o.status === "Selesai").length;
        setStats({ total_transaksi: totalTransaksi, order_baru: orderBaru, siap_diambil: siapDiambil });
        setRecentOrders(orders.slice(0, 10));
      }
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
      fetchData();
    } catch (err) {
      alert("Gagal update status");
    }
  };

  // format angka jadi rupiah
  const formatRp = (n) => "Rp " + (n || 0).toLocaleString("id-ID");

  const statusColor = (s) => {
    switch (s) {
      case "Selesai": return { bg: "#dcfce7", color: "#166534" };
      case "Dikerjakan": return { bg: "#dbeafe", color: "#1e40af" };
      case "Menunggu": return { bg: "#fef3c7", color: "#92400e" };
      case "Diambil": return { bg: "#e0e7ff", color: "#3730a3" };
      default: return { bg: "#f1f5f9", color: "#475569" };
    }
  };

  if (isDelivery) {
    return (
      <div>
        <div style={styles.pageHeader}>
          <h2 style={styles.pageTitle}>Dashboard Delivery</h2>
          <p style={styles.pageSub}>Selamat datang, {karyawan.name}</p>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: "#fef3c7", color: "#d97706" }}>
              <Icon name="shoppingCart" size={24} />
            </div>
            <div>
              <div style={styles.statLabel}>Siap Diambil</div>
              <div style={styles.statNum}>{deliveryStats.siap_diambil}</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: "#e0e7ff", color: "#3730a3" }}>
              <Icon name="car" size={24} />
            </div>
            <div>
              <div style={styles.statLabel}>Sedang Dikirim</div>
              <div style={styles.statNum}>{deliveryStats.diambil}</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: "#dcfce7", color: "#16a34a" }}>
              <Icon name="check" size={24} />
            </div>
            <div>
              <div style={styles.statLabel}>Total Pengiriman</div>
              <div style={styles.statNum}>{deliveryStats.total_pengiriman}</div>
            </div>
          </div>
        </div>

        <div style={styles.tableCard}>
          <h3 style={styles.tableTitle}>Pesanan Untuk Diambil</h3>
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>No. Nota</th>
                  <th style={styles.th}>Pelanggan</th>
                  <th style={styles.th}>Telepon</th>
                  <th style={styles.th}>Alamat</th>
                  <th style={styles.th}>Layanan</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {deliveryOrders.map((o) => {
                  const sc = statusColor(o.status);
                  return (
                    <tr key={o.id}>
                      <td style={styles.td}>{o.order_code}</td>
                      <td style={styles.td}>{o.customer_name}</td>
                      <td style={styles.td}>{o.phone || "-"}</td>
                      <td style={styles.td}>{o.address || "-"}</td>
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
                {deliveryOrders.length === 0 && (
                  <tr><td colSpan={8} style={{ ...styles.td, textAlign: "center", color: "#94a3b8" }}>Tidak ada pesanan</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Stat Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: "#eff6ff", color: "#2563eb" }}>
            <Icon name="cash" size={24} />
          </div>
          <div>
            <div style={styles.statLabel}>Total Transaksi</div>
            <div style={styles.statNum}>{formatRp(stats.total_transaksi)}</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: "#fef3c7", color: "#d97706" }}>
            <Icon name="shoppingCart" size={24} />
          </div>
          <div>
            <div style={styles.statLabel}>Order Baru</div>
            <div style={styles.statNum}>{stats.order_baru} Order</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, background: "#dcfce7", color: "#16a34a" }}>
            <Icon name="check" size={24} />
          </div>
          <div>
            <div style={styles.statLabel}>Siap Diambil</div>
            <div style={styles.statNum}>{stats.siap_diambil} Nota</div>
          </div>
        </div>
      </div>

      {/* Input Order Baru */}
      <div style={styles.inputOrderBtn} onClick={() => navigate("/karyawan/transaksi")}>
        <Icon name="plus" size={18} />
        <span>INPUT ORDER BARU</span>
      </div>

      {/* Recent Orders Table */}
      <div style={styles.tableCard}>
        <h3 style={styles.tableTitle}>Pesanan Terbaru</h3>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>No. Nota</th>
                <th style={styles.th}>Pelanggan</th>
                <th style={styles.th}>Layanan</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => {
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
                  </tr>
                );
              })}
              {recentOrders.length === 0 && (
                <tr><td colSpan={5} style={{ ...styles.td, textAlign: "center", color: "#94a3b8" }}>Belum ada pesanan</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
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

  inputOrderBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#fff",
    padding: "14px 24px",
    borderRadius: 14,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: 20,
    boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
    letterSpacing: 0.5,
  },

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
  pageHeader: { marginBottom: 20 },
  pageSub: { fontSize: 13, color: "#64748b", margin: "4px 0 0" },
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
