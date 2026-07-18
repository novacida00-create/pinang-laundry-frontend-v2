import { useState, useEffect } from "react";
import Icon from "../../utils/icons";

export default function KaryawanPengaturan() {
  const karyawan = JSON.parse(localStorage.getItem("karyawan") || "{}");
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", role: "" });
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    setProfile({
      name: karyawan.name || "",
      email: karyawan.email || "",
      phone: karyawan.phone || "",
      role: karyawan.role || "",
    });
  }, []);

  const handleEdit = () => {
    setForm({ name: profile.name, email: profile.email, phone: profile.phone });
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleSave = async () => {
    if (!form.name) return alert("Nama wajib diisi!");
    try {
      const res = await fetch(`/api/karyawan/${karyawan.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal simpan");

      const updated = { ...karyawan, name: form.name, email: form.email, phone: form.phone };
      localStorage.setItem("karyawan", JSON.stringify(updated));
      setProfile({ ...profile, name: form.name, email: form.email, phone: form.phone });
      setEditing(false);
      alert("Profil berhasil disimpan!");
    } catch (err) {
      alert("Gagal menyimpan: " + err.message);
    }
  };

  const roleColor = {
    "Staff (Kasir)": "#10b981",
    "Staff (Cuci)": "#8b5cf6",
    "Staff (Delivery)": "#f59e0b",
    Admin: "#3b82f6",
  };

  return (
    <div>
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>Pengaturan</h2>
      </div>

      <div style={styles.gridRow}>
        {/* Profil Saya */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Profil Saya</h3>
            {!editing && <button style={styles.btnEdit} onClick={handleEdit}><Icon name="edit" /> Edit</button>}
          </div>

          <div style={styles.avatarSection}>
            <div style={styles.avatarLarge}>
              <Icon name="user" size={40} />
            </div>
            <h3 style={styles.name}>{editing ? form.name : profile.name}</h3>
            <span style={{ ...styles.roleBadge, background: roleColor[profile.role] || "#6b7280" }}>
              {profile.role}
            </span>
          </div>

          {editing ? (
            <div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nama Lengkap</label>
                <input style={styles.input} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <input style={styles.input} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>No. Telepon</label>
                <input style={styles.input} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div style={styles.formActions}>
                <button style={styles.btnCancel} onClick={handleCancel}>Batal</button>
                <button style={styles.btnSave} onClick={handleSave}>Simpan</button>
              </div>
            </div>
          ) : (
            <div style={styles.infoList}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Nama Lengkap</span>
                <span style={styles.infoValue}>{profile.name}</span>
              </div>
              <div style={styles.infoDivider} />
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Email</span>
                <span style={styles.infoValue}>{profile.email}</span>
              </div>
              <div style={styles.infoDivider} />
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>No. Telepon</span>
                <span style={styles.infoValue}>{profile.phone}</span>
              </div>
              <div style={styles.infoDivider} />
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Role</span>
                <span style={styles.infoValue}>{profile.role}</span>
              </div>
            </div>
          )}
        </div>

        {/* Informasi Akun */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h3 style={styles.cardTitle}>Informasi Akun</h3>
          </div>

          <div style={styles.infoList}>
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Username</span>
              <span style={styles.infoValue}>{profile.name}</span>
            </div>
            <div style={styles.infoDivider} />
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Status</span>
              <span style={{ ...styles.infoValue, color: "#16a34a", fontWeight: 600 }}>Aktif</span>
            </div>
            <div style={styles.infoDivider} />
            <div style={styles.infoItem}>
              <span style={styles.infoLabel}>Akses</span>
              <span style={styles.infoValue}>Dashboard, Transaksi, Laporan</span>
            </div>
          </div>

          <div style={{ marginTop: 20, padding: 16, background: "#fff7ed", borderRadius: 12, border: "1px solid #fed7aa" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#c2410c", fontSize: 13, fontWeight: 600 }}>
              <Icon name="helpCircle" size={16} />
              <span>Butuh bantuan?</span>
            </div>
            <p style={{ margin: "8px 0 0", fontSize: 13, color: "#9a3412", lineHeight: 1.6 }}>
              Hubungi admin untuk mengubah profil atau password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageHeader: { marginBottom: 20 },
  pageTitle: { fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0 },

  gridRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: 20,
  },

  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 28,
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    border: "1px solid #e2e8f0",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottom: "1px solid #f1f5f9",
  },
  cardTitle: { fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 },

  avatarSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 24,
    borderBottom: "1px solid #f1f5f9",
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    marginBottom: 12,
    boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
  },
  name: { fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 },
  roleBadge: {
    display: "inline-block",
    padding: "4px 14px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    color: "#fff",
    marginTop: 6,
  },

  formGroup: { marginBottom: 14 },
  label: { display: "block", fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 4 },
  input: {
    width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0",
    fontSize: 14, outline: "none", boxSizing: "border-box", background: "#f8fafc",
  },
  formActions: { display: "flex", gap: 10, marginTop: 16 },
  btnCancel: {
    flex: 1, padding: "10px 20px", borderRadius: 10, border: "1px solid #e2e8f0",
    background: "#fff", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer",
  },
  btnSave: {
    flex: 1, padding: "10px 20px", borderRadius: 10, border: "none",
    background: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
  },

  btnEdit: {
    padding: "8px 16px", borderRadius: 10, border: "2px solid #3b82f6",
    background: "transparent", color: "#3b82f6", fontSize: 13, fontWeight: 700,
    cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
  },

  infoList: {},
  infoItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
  },
  infoLabel: { fontSize: 13, color: "#64748b" },
  infoValue: { fontSize: 14, fontWeight: 600, color: "#0f172a" },
  infoDivider: { height: 1, background: "#f1f5f9" },
};
