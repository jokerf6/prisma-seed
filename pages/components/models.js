import { useEffect, useState } from "react";
import { generateFakeData } from "../../functions/generateFake";

export default function Model({
  selectedModel,
  setSelectedModel,
  setModelData,
  setRows,
}) {
  const [models, setModels] = useState([]);
  const [dirPath, setDirPath] = useState("");
  const handleLoad = async () => {
    const res = await fetch("/api/load-model", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dirPath }),
    });
    const data = await res.json();
    setModels(data);
    localStorage.setItem("dirPath", dirPath);
    setSelectedModel(null);
    setModelData([]);
  };

  const current = async (model) => {
    setSelectedModel(model);
    const res2 = await fetch(`/api/data/${model.name}`);
    const data2 = await res2.json();
    setRows(data2);
    // generateFakeData();
  };
  useEffect(() => {
    const saved = localStorage.getItem("dirPath");
    if (saved) setDirPath(saved);
  }, []);

  return (
    <div style={{ width: "30%", padding: 20, background: "#f2f2f2" }}>
      <h2>📂 Prisma Schema Directory</h2>
      <input
        type="text"
        value={dirPath}
        onChange={(e) => setDirPath(e.target.value)}
        placeholder="مثلاً: /media/fahd/base2/backend/prisma"
        style={{ width: "100%", padding: "8px", marginBottom: 10 }}
      />
      <button onClick={handleLoad} style={{ padding: "8px 12px" }}>
        تحميل الموديلات
      </button>
      <ul style={{ marginTop: 20, listStyle: "none", padding: 0 }}>
        {models.map((model, idx) => (
          <li
            key={idx}
            onClick={() => {
              current(model);
              setModelData([]); // reset model data when switching
            }}
            style={{
              cursor: "pointer",
              margin: "10px 0",
              fontWeight:
                selectedModel?.name === model.name ? "bold" : "normal",
            }}
          >
            📦 {model.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
