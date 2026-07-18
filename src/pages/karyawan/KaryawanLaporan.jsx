import { useState, useEffect } from "react";
import Icon from "../../utils/icons";

export default function KaryawanLaporan() {
  const [laporan, setLaporan] = useState([]);

  // ambil data laporan dari api
  useEffect(() => {
    fetch("/api/laporan").then(r => r.json()).then(setLaporan).catch(() => {});
  }, []);

  const formatRp = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

  // hitung total pendapatan dari semua transaksi
  const totalPendapatan = laporan.reduce((s, l) => s + Number(l.total || 0), 0);

  return (
    <div>
      <h3 style={styles.title}>Laporan Transaksi</h3>

      <div style={styles.summaryCard}>
        <Icon name="cash" size={20} />
        <div>
          <div style={styles.summaryLabel}>Total Pendapatan</div>
          <div style={styles.summaryNum}>{formatRp(totalPendapatan)}</div>
        </div>
        <span style={styles.summaryCount}>{laporan.length} transaksi</span>
      </div>

      <div style={styles.tableCard}>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Tanggal</th>
                <th style={styles.th}>Pelanggan</th>
                <th style={styles.th}>Layanan</th>
                <th style={styles.th}>Berat</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Pembayaran</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {laporan.map((l) => (
                <tr key={l.id}>
                  <td style={styles.td}>{l.tanggal}</td>
                  <td style={styles.td}>{l.pelanggan}</td>
                  <td style={styles.td}>{l.layanan}</td>
                  <td style={styles.td}>{l.berat}</td>
                  <td style={styles.td}>{formatRp(l.total)}</td>
                  <td style={styles.td}>{l.payment === "qris" ? "QRIS" : "Cash"}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      background: l.status === "Selesai" ? "#dcfce7" : "#fef3c7",
                      color: l.status === "Selesai" ? "#166534" : "#92400e",
                    }}>{l.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  title: { fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 16px" },
  summaryCard: {
    display: "flex", alignItems: "center", gap: 16, background: "#fff", borderRadius: 14,
    padding: "20px 24px", marginBottom: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", color: "#2563eb",
  },
  summaryLabel: { fontSize: 12, color: "#64748b" },
  summaryNum: { fontSize: 22, fontWeight: 700, color: "#0f172a" },
  summaryCount: { marginLeft: "auto", fontSize: 13, color: "#64748b", background: "#f1f5f9", padding: "4px 12px", borderRadius: 20 },
  tableCard: { background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px 12px", fontSize: 12, fontWeight: 600, color: "#64748b", borderBottom: "2px solid #e2e8f0", whiteSpace: "nowrap" },
  td: { padding: "10px 12px", fontSize: 13, color: "#334155", borderBottom: "1px solid #f1f5f9" },
  badge: { display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600 },
};
