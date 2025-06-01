import { useEffect, useState } from "react";

export default function ConfigPage() {
  const [dbUrl, setDbUrl] = useState("");
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    const res = await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dbUrl }),
    });
    const data = await res.json();
    localStorage.setItem("dbUrl", dbUrl);
    setMessage(data.message || "تم الحفظ");
  };
  useEffect(async () => {
    // استرجاع dbUrl من localStorage لو موجود

    await fetch(`/api/config`);
    const saved = localStorage.getItem("dbUrl");
    if (saved) setDbUrl(saved);
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>⚙️ إعداد الاتصال بقاعدة البيانات</h2>
      <input
        type="text"
        value={dbUrl}
        onChange={(e) => setDbUrl(e.target.value)}
        placeholder="مثلاً: postgresql://user:pass@host:port/dbname"
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />
      <button onClick={handleSave} style={{ padding: "8px 12px" }}>
        حفظ الاتصال
      </button>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
