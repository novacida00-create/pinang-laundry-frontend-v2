import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function KaryawanLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // bikin responsive style buat mobile
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
@media (max-width: 768px) {
.klp-wrap{min-height:100dvh!important}
.klp-wrap > div[style*="z-index: 1"]{flex-direction:column!important;width:92%!important;max-width:400px!important;border-radius:24px!important}
.klp-wrap > div[style*="z-index: 1"] > div:first-child{width:100%!important;min-width:unset!important;padding:28px 20px 20px!important;border-radius:24px 24px 0 0!important}
.klp-wrap > div[style*="z-index: 1"] > div:first-child > div:first-child{font-size:44px!important}
.klp-wrap > div[style*="z-index: 1"] > div:last-child{padding:20px 16px 24px!important}
.klp-wrap input{font-size:16px!important;padding:14px 16px!important;box-sizing:border-box!important;width:100%!important;border-radius:14px!important;-webkit-appearance:none!important;appearance:none!important}
.klp-wrap button{font-size:16px!important;padding:14px!important;border-radius:14px!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important}
.klp-wrap > div[style*="z-index: 1"] > div:last-child h2{font-size:20px!important}
}
@media (max-width: 480px) {
.klp-wrap > div[style*="z-index: 1"] > div:first-child{padding:20px 16px 16px!important}
.klp-wrap > div[style*="z-index: 1"] > div:first-child > div:first-child{font-size:36px!important}
.klp-wrap > div[style*="z-index: 1"] > div:first-child h2{font-size:20px!important}
.klp-wrap > div[style*="z-index: 1"] > div:last-child{padding:16px 14px 20px!important}
.klp-wrap > div[style*="z-index: 1"] > div:last-child h2{font-size:18px!important}
.klp-wrap input{font-size:15px!important;padding:12px 14px!important;border-radius:12px!important}
.klp-wrap button{font-size:15px!important;padding:13px!important;border-radius:12px!important}
}
`;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    // console.log('submit login', username)
    if (!username || !password) {
      setError("Masukkan username dan password!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/karyawan/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login gagal");
        setLoading(false);
        return;
      }
      localStorage.setItem("karyawan", JSON.stringify(data));
      // simpen data login ke local storage trus redirect
      navigate("/karyawan/dashboard");
    } catch (err) {
      // console.log('login error:', err)
      setError("Gagal terhubung ke server");
      setLoading(false);
    }
  };

  return (
    <div className="klp-wrap" style={styles.container}>
      <div style={styles.leftBg}></div>
      <div style={styles.rightBg}></div>
      <div style={styles.card}>
        <div style={styles.cardLeft}>
          <div style={styles.cardLeftIcon}>🧺</div>
          <h2 style={styles.cardLeftTitle}>Pinang Laundry</h2>
          <p style={styles.cardLeftSub}>Bersih, Cepat, Terpercaya</p>
          {/* icon pakaian */}
          <div style={styles.cardLeftIcons}>
            <span style={styles.cardLeftIconSmall}>&#x1F455;</span>
            <span style={styles.cardLeftIconSmall}>&#x1F456;</span>
            <span style={styles.cardLeftIconSmall}>&#x1F9E5;</span>
          </div>
          <div style={styles.cardLeftStats}>
            <div><span style={styles.cardLeftStatNum}>Staff</span><span style={styles.cardLeftStatLabel}>Karyawan</span></div>
            <div><span style={styles.cardLeftStatNum}>2020</span><span style={styles.cardLeftStatLabel}>Sejak</span></div>
          </div>
        </div>
        <div style={styles.cardRight}>
          <h2 style={{ ...styles.title, fontSize: 18 }}>Login Karyawan</h2>
          <p style={styles.subtitle}>Masuk ke panel karyawan</p>

          {error && <div style={styles.errorBox}>{error}</div>}

          <label style={styles.label}>Username</label>
          <input
            type="text"
            placeholder="Masukkan nama anda"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={styles.label}>Password</label>
          </div>
          <div style={styles.passWrap}>
            <input
              type={showPass ? "text" : "password"}
              placeholder="Masukkan kata sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
            {/* toggle show password */}
            <span onClick={() => setShowPass(!showPass)} style={styles.passToggle}>{showPass ? "\uD83D\uDC41\u200D\uD83D\uDDE8\uFE0F" : "\uD83D\uDC41"}</span>
          </div>

          <button type="button" onClick={handleLogin} disabled={loading} style={styles.button}>{loading ? "Masuk..." : "Login"}</button>

          <div style={styles.footer}>
            <span style={styles.footerText}>Bukan karyawan? </span>
            <span style={styles.link} onClick={() => navigate("/")}>Kembali ke beranda</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "sans-serif", position: "relative", overflow: "hidden", backgroundColor: "#F5F7FB" },
  leftBg: { position: "absolute", left: "-10%", top: "-20%", width: 500, height: 500, background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)", borderRadius: "50%" },
  rightBg: { position: "absolute", right: "-10%", bottom: "-10%", width: 500, height: 500, background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)", borderRadius: "50%" },
  card: { width: 780, background: "#ffffff", borderRadius: 32, border: "1px solid #e2e8f0", display: "flex", flexDirection: "row", position: "relative", zIndex: 1, overflow: "hidden" },
  cardLeft: { width: 300, background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)", padding: "40px 32px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, color: "#fff" },
  cardLeftIcon: { fontSize: 64, marginBottom: 4 },
  cardLeftTitle: { fontSize: 24, fontWeight: 700, margin: 0, textAlign: "center" },
  cardLeftSub: { fontSize: 14, color: "rgba(255,255,255,0.8)", margin: 0, textAlign: "center" },
  cardLeftIcons: { display: "flex", gap: 8, marginTop: 8, marginBottom: 20 },
  cardLeftIconSmall: { fontSize: 28, opacity: 0.9 },
  cardLeftStats: { display: "flex", gap: 32, marginTop: 8 },
  cardLeftStatNum: { display: "block", fontSize: 22, fontWeight: 700, textAlign: "center" },
  cardLeftStatLabel: { display: "block", fontSize: 12, color: "rgba(255,255,255,0.7)", textAlign: "center", letterSpacing: "+0.3px" },
  cardRight: { flex: 1, padding: "40px 36px", display: "flex", flexDirection: "column", gap: 12 },
  title: { fontSize: 22, fontWeight: 600, color: "#1e293b", margin: 0, letterSpacing: "-0.5px" },
  subtitle: { fontSize: 16, color: "#64748b", margin: 0, lineHeight: 1.65, letterSpacing: "+0.3px" },
  errorBox: { padding: "12px 16px", backgroundColor: "#fef2f2", color: "#dc2626", borderRadius: 12, fontSize: 14, fontWeight: 400, textAlign: "center", border: "1px solid #fecaca", lineHeight: 1.65 },
  label: { fontSize: 14, fontWeight: 400, color: "#475569", letterSpacing: "+0.3px" },
  input: { width: "100%", padding: "14px 16px", borderRadius: 14, border: "1px solid #e2e8f0", fontSize: 16, outline: "none", background: "#f8fafc", boxSizing: "border-box", lineHeight: 1.65 },
  passWrap: { position: "relative", display: "flex", alignItems: "center" },
  passToggle: { position: "absolute", right: 14, cursor: "pointer", fontSize: 20, opacity: 0.7 },
  button: { width: "100%", padding: 14, marginTop: 12, background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "white", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(59,130,246,0.3)", transition: "all 0.2s ease" },
  footer: { textAlign: "center", marginTop: 8 },
  footerText: { fontSize: 14, color: "#64748b", lineHeight: 1.65 },
  link: { fontSize: 14, color: "#3b82f6", fontWeight: 400, cursor: "pointer" },
};
