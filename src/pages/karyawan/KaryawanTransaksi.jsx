import { useState, useEffect } from "react";
import Icon from "../../utils/icons";

export default function KaryawanTransaksi() {
  const [orders, setOrders] = useState([]);
  const [layanan, setLayanan] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    customer_name: "", phone: "", address: "", service_name: "", weight: "", price: 0, total: 0, payment: "cash",
  });
  const karyawan = JSON.parse(localStorage.getItem("karyawan") || "{}");

  useEffect(() => {
    fetch("/api/orders").then(r => r.json()).then(setOrders).catch(() => {});
    fetch("/api/layanan").then(r => r.json()).then(setLayanan).catch(() => {});
  }, []);

  const handleServiceChange = (name) => {
    const svc = layanan.find((l) => l.name === name);
    if (svc) {
      const harga = parseInt(svc.harga) || 0;
      setForm({ ...form, service_name: name, price: harga, total: harga * (parseFloat(form.weight) || 1) });
    }
  };

  const handleWeightChange = (w) => {
    setForm({ ...form, weight: w, total: form.price * (parseFloat(w) || 1) });
  };

  const handleSubmit = async () => {
    if (!form.customer_name || !form.service_name) return alert("Lengkapi data!");
    const now = new Date();
    const orderCount = orders.length + 1;
    const orderCode = "ORD-" + String(orderCount).padStart(4, "0");
    const body = {
      order_code: orderCode,
      customer_name: form.customer_name,
      phone: form.phone,
      address: form.address,
      service_name: form.service_name,
      weight: parseFloat(form.weight) || 0,
      price: form.price,
      total: form.total,
      status: "Menunggu",
      payment: form.payment,
      payment_status: "Belum Lunas",
      created_at: now.toISOString().slice(0, 19).replace("T", " "),
    };
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setOrders([data, ...orders]);
      setForm({ customer_name: "", phone: "", address: "", service_name: "", weight: "", price: 0, total: 0, payment: "cash" });
      setShowForm(false);
    } catch {
      alert("Gagal menyimpan order");
    }
  };

  const formatRp = (n) => "Rp " + (n || 0).toLocaleString("id-ID");

  const statusColor = (s) => {
    switch (s) {
      case "Selesai": return { bg: "#dcfce7", color: "#166534" };
      case "Dikerjakan": return { bg: "#dbeafe", color: "#1e40af" };
      case "Menunggu": return { bg: "#fef3c7", color: "#92400e" };
      default: return { bg: "#f1f5f9", color: "#475569" };
    }
  };

  return (
    <div>
      {/* Button Input Order */}
      <div style={styles.topBar}>
        <h3 style={styles.pageTitle}>Daftar Transaksi</h3>
        <div style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          <Icon name="plus" size={16} />
          <span>Order Baru</span>
        </div>
      </div>

      {/* Form Input Order */}
      {showForm && (
        <div style={styles.formCard}>
          <h4 style={styles.formTitle}>Input Order Baru</h4>
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>Nama Pelanggan *</label>
              <input style={styles.input} placeholder="Nama" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
            </div>
            <div>
              <label style={styles.label}>No. Telepon</label>
              <input style={styles.input} placeholder="Telepon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label style={styles.label}>Alamat</label>
              <input style={styles.input} placeholder="Alamat" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
            <div>
              <label style={styles.label}>Layanan *</label>
              <select style={styles.input} value={form.service_name} onChange={(e) => handleServiceChange(e.target.value)}>
                <option value="">Pilih Layanan</option>
                {layanan.filter(l => l.status === "Aktif").map((l) => (
                  <option key={l.id} value={l.name}>{l.name} - {formatRp(l.harga)}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={styles.label}>Berat (kg)</label>
              <input style={styles.input} type="number" placeholder="0" value={form.weight} onChange={(e) => handleWeightChange(e.target.value)} />
            </div>
            <div>
              <label style={styles.label}>Total</label>
              <input style={styles.input} value={formatRp(form.total)} readOnly />
            </div>
            <div>
              <label style={styles.label}>Pembayaran</label>
              <select style={styles.input} value={form.payment} onChange={(e) => setForm({ ...form, payment: e.target.value })}>
                <option value="cash">Cash</option>
                <option value="qris">QRIS</option>
              </select>
            </div>
          </div>
          <div style={styles.formActions}>
            <button style={styles.cancelBtn} onClick={() => setShowForm(false)}>Batal</button>
            <button style={styles.submitBtn} onClick={handleSubmit}>Simpan Order</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={styles.tableCard}>
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>No. Nota</th>
                <th style={styles.th}>Pelanggan</th>
                <th style={styles.th}>Layanan</th>
                <th style={styles.th}>Berat</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Bayar</th>
                <th style={styles.th}>Status</th>
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
                    <td style={styles.td}>{o.weight} kg</td>
                    <td style={styles.td}>{formatRp(o.total)}</td>
                    <td style={styles.td}>{o.payment === "qris" ? "QRIS" : "Cash"}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: sc.bg, color: sc.color }}>{o.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  topBar: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  pageTitle: { fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 },
  addBtn: {
    display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 12,
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "#fff", fontSize: 13, fontWeight: 600,
    cursor: "pointer", boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
  },

  formCard: {
    background: "#fff", borderRadius: 14, padding: 24, marginBottom: 20,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0",
  },
  formTitle: { fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 16px" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 },
  label: { display: "block", fontSize: 12, fontWeight: 600, color: "#475569", marginBottom: 4 },
  input: {
    width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0",
    fontSize: 14, outline: "none", boxSizing: "border-box", background: "#f8fafc",
  },
  formActions: { display: "flex", gap: 10, marginTop: 16, justifyContent: "flex-end" },
  cancelBtn: {
    padding: "10px 20px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff",
    color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer",
  },
  submitBtn: {
    padding: "10px 20px", borderRadius: 10, border: "none", background: "#2563eb",
    color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
  },

  tableCard: { background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px 12px", fontSize: 12, fontWeight: 600, color: "#64748b", borderBottom: "2px solid #e2e8f0", whiteSpace: "nowrap" },
  td: { padding: "10px 12px", fontSize: 13, color: "#334155", borderBottom: "1px solid #f1f5f9" },
  badge: { display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" },
};
