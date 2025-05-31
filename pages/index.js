import { useState } from "react";

export default function Home() {
  const [dirPath, setDirPath] = useState("");
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [modelData, setModelData] = useState([]);

  const handleLoad = async () => {
    const res = await fetch("/api/load-model", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dirPath }),
    });
    const data = await res.json();
    setModels(data);
    setSelectedModel(null);
    setModelData([]);
  };

  const loadData = async () => {
    if (!selectedModel) return;

    const res = await fetch(`/api/data/${selectedModel.name}`);
    console.log(res);
    const data = await res.json();
    setModelData(data);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial" }}>
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
                setSelectedModel(model);
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

      <div style={{ flex: 1, padding: 20 }}>
        {selectedModel ? (
          <>
            <h2>🧱 Model: {selectedModel.name}</h2>
            <table border="1" cellPadding="8" cellSpacing="0">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Type</th>
                  <th>Optional</th>
                  <th>Attributes</th>
                </tr>
              </thead>
              <tbody>
                {selectedModel.fields
                  .filter(
                    (f) => f.hasOwnProperty("name") && f.hasOwnProperty("type")
                  )
                  .map((field, idx) => (
                    <tr key={idx}>
                      <td>{field.name}</td>
                      <td>{field.type}</td>
                      <td>{field.isOptional ? "✅" : "❌"}</td>
                      <td>{field.attributes.join(", ")}</td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <div style={{ marginTop: 30 }}>
              <h3>📄 بيانات الموديل</h3>
              <button onClick={loadData} style={{ marginBottom: 10 }}>
                تحميل البيانات
              </button>
              {modelData.length > 0 ? (
                <ul>
                  {modelData.map((item, idx) => (
                    <li key={idx}>
                      <pre>{JSON.stringify(item, null, 2)}</pre>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>لا توجد بيانات حتى الآن.</p>
              )}
            </div>
          </>
        ) : (
          <p>اختر موديل لعرض التفاصيل.</p>
        )}
      </div>
    </div>
  );
}
