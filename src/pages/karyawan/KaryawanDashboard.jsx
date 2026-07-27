import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../utils/icons";

export default function KaryawanDashboard() {
  const navigate = useNavigate();
  const karyawan = JSON.parse(localStorage.getItem("karyawan") || "{}");
  const isDelivery = karyawan.role === "Staff (Delivery)";
  const isCuci = karyawan.role === "Staff (Cuci)";

  const [stats, setStats] = useState({ total_transaksi: 0, order_baru: 0, siap_diambil: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [deliveryStats, setDeliveryStats] = useState({ siap_diambil: 0, diambil: 0, total_pengiriman: 0 });
  const [deliveryOrders, setDeliveryOrders] = useState([]);
  const [cuciOrders, setCuciOrders] = useState([]);
  const [cuciStats, setCuciStats] = useState({ dikerjakan: 0, selesai: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/orders");
      const orders = await res.json();

      if (isDelivery) {
        const dOrders = orders.filter((o) => o.delivery_mode === "kurir");
        const siapDiambil = dOrders.filter((o) => o.status === "Selesai").length;
        const diambil = dOrders.filter((o) => o.status === "Diambil").length;
        setDeliveryStats({ siap_diambil: siapDiambil, diambil: diambil, total_pengiriman: siapDiambil + diambil });
        setDeliveryOrders(dOrders.filter((o) => o.status === "Selesai" || o.status === "Diambil"));
      } else if (isCuci) {
        const dikerjakan = orders.filter((o) => o.status === "Dikerjakan").length;
        const selesaiHariIni = orders.filter((o) => o.status === "Selesai").length;
        setCuciStats({ dikerjakan: dikerjakan, selesai: selesaiHariIni });
        setCuciOrders(orders.filter((o) => o.status === "Dikerjakan" || o.status === "Menunggu"));
      } else {
        const totalTransaksi = orders.reduce((sum, o) => sum + (o.total || 0), 0);
        const orderBaru = orders.filter((o) => o.status === "Menunggu").length;
        const siapDiambil = orders.filter((o) => o.status === "Selesai").length;
        setStats({ total_transaksi: totalTransaksi, order_baru: orderBaru, siap_diambil: siapDiambil });
        setRecentOrders(orders);
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

  const goToPage = (page, totalPages) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const Pagination = ({ totalPages }) => {
    if (totalPages <= 1) return null;
    return (
      <div style={styles.pagination}>
        <span onClick={() => goToPage(currentPage - 1, totalPages)} style={{ cursor: currentPage > 1 ? "pointer" : "default", opacity: currentPage > 1 ? 1 : 0.5 }}>&#8249;</span>
        {(() => {
          let start = Math.max(1, currentPage - 2);
          let end = Math.min(totalPages, start + 4);
          if (end - start < 4) start = Math.max(1, end - 4);
          return Array.from({ length: end - start + 1 }, (_, i) => {
            const page = start + i;
            return (
              <span key={page} onClick={() => goToPage(page, totalPages)} style={page === currentPage ? styles.pageActive : { cursor: "pointer" }}>{page}</span>
            );
          });
        })()}
        <span onClick={() => goToPage(currentPage + 1, totalPages)} style={{ cursor: currentPage < totalPages ? "pointer" : "default", opacity: currentPage < totalPages ? 1 : 0.5 }}>&#8250;</span>
      </div>
    );
  };

  // === STAFF CUCI ===
  if (isCuci) {
    const totalPages = Math.ceil(cuciOrders.length / itemsPerPage);
    const paginated = cuciOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    return (
      <div>
        <div style={styles.pageHeader}>
          <h2 style={styles.pageTitle}>Dashboard Cuci</h2>
          <p style={styles.pageSub}>Selamat datang, {karyawan.name}</p>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: "#dbeafe", color: "#1e40af" }}>
              <Icon name="wash" size={24} />
            </div>
            <div>
              <div style={styles.statLabel}>Sedang Dikerjakan</div>
              <div style={styles.statNum}>{cuciStats.dikerjakan}</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: "#dcfce7", color: "#16a34a" }}>
              <Icon name="check" size={24} />
            </div>
            <div>
              <div style={styles.statLabel}>Selesai Hari Ini</div>
              <div style={styles.statNum}>{cuciStats.selesai}</div>
            </div>
          </div>
        </div>

        <div style={styles.tableCard}>
          <h3 style={styles.tableTitle}>Pesanan Masuk</h3>
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
                {paginated.map((o) => {
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
                        {o.status === "Menunggu" && (
                          <button style={styles.processBtn} onClick={() => handleStatusChange(o.id, "Dikerjakan")}>
                            Mulai Kerjakan
                          </button>
                        )}
                        {o.status === "Dikerjakan" && (
                          <button style={styles.doneBtn} onClick={() => handleStatusChange(o.id, "Selesai")}>
                            Selesai
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {paginated.length === 0 && (
                  <tr><td colSpan={6} style={{ ...styles.td, textAlign: "center", color: "#94a3b8" }}>Tidak ada pesanan</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    );
  }

  // === STAFF DELIVERY ===
  if (isDelivery) {
    const totalPages = Math.ceil(deliveryOrders.length / itemsPerPage);
    const paginated = deliveryOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
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
                {paginated.map((o) => {
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
                {paginated.length === 0 && (
                  <tr><td colSpan={8} style={{ ...styles.td, textAlign: "center", color: "#94a3b8" }}>Tidak ada pesanan</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    );
  }

  // === STAFF KASIR (default) ===
  const totalPages = Math.ceil(recentOrders.length / itemsPerPage);
  const paginated = recentOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  return (
    <div>
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

      <div style={styles.inputOrderBtn} onClick={() => navigate("/karyawan/transaksi")}>
        <Icon name="plus" size={18} />
        <span>INPUT ORDER BARU</span>
      </div>

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
              {paginated.map((o) => {
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
              {paginated.length === 0 && (
                <tr><td colSpan={5} style={{ ...styles.td, textAlign: "center", color: "#94a3b8" }}>Belum ada pesanan</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination totalPages={totalPages} />
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
  processBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "6px 14px",
    borderRadius: 8,
    border: "none",
    background: "#f59e0b",
    color: "#fff",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  doneBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "6px 14px",
    borderRadius: 8,
    border: "none",
    background: "#16a34a",
    color: "#fff",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 16,
    flexWrap: "nowrap",
  },
  pageActive: {
    width: 28,
    height: 28,
    background: "#3b82f6",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    fontWeight: 700,
  },
};
