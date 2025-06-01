import { da, faker } from "@faker-js/faker";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Model from "./components/models";
import Structure from "./components/structure";
import { IsEnum } from "../functions/IsEnum";
import { generateFakeDataFunction } from "../functions/generateFake";

export default function Home() {
  const [rows, setRows] = useState(0);

  const [selectedModel, setSelectedModel] = useState(null);
  const [modelData, setModelData] = useState([]);
  const [enums, setEnums] = useState([]);
  const [generatedRows, setGeneratedRows] = useState(0);
  const router = useRouter();

  const [formData, setFormData] = useState({});

  const generateFakeData = (formData) => {
    const data = {};
    const fields =
      (selectedModel &&
        selectedModel.fields.filter(
          (f) =>
            f.hasOwnProperty("name") &&
            f.hasOwnProperty("type") &&
            !f.attributes.includes("relation")
        )) ||
      [];
    fields.forEach((field) => {
      console.log("Processing field:", field);
      if (formData && formData[field.name]) {
        data[field.name] = formData[field.name];
        return;
      }
      if (
        field.attributes.includes("id") &&
        field.attributes.includes("default")
      ) {
        console.log(
          `Skipping field ${field.name} because it has both 'id' and 'default' attributes`
        );
        data[field.name] = undefined;
        return;
      }
      data[field.name] = generateFakeDataFunction(field);
    });

    return data;
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    let result;
    for (let i = 0; i < generatedRows; i++) {
      const data = generateFakeData(formData);
      console.log("current Data:", data);
      const cleanedData = {};
      const fields =
        (selectedModel &&
          selectedModel.fields.filter(
            (f) =>
              f.hasOwnProperty("name") &&
              f.hasOwnProperty("type") &&
              !f.attributes.includes("relation")
          )) ||
        [];
      fields.forEach((field) => {
        const rawValue = data[field.name];
        const fieldType = field.type.toLowerCase();
        if (rawValue === undefined || rawValue === null) {
          console.warn(`Field ${field.name} is undefined or null, skipping.`);
          return;
        }
        switch (fieldType) {
          case "int":
            cleanedData[field.name] = parseInt(rawValue);
            break;
          case "float":
          case "decimal":
            cleanedData[field.name] = parseFloat(rawValue);
            break;
          case "boolean":
            cleanedData[field.name] = rawValue === "true" || rawValue === true;
            break;
          case "date":
          case "datetime":
            cleanedData[field.name] = new Date(rawValue);
            break;
          default:
            cleanedData[field.name] = rawValue;
        }
      });
      const res = await fetch("/api/insert-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelName: selectedModel.name,
          data: cleanedData,
          generatedRows,
        }),
      });

      result = await res.json();
    }
    alert("✅ Response: " + JSON.stringify(result));
  };
  useEffect(async () => {
    const res2 = await fetch(`/api/enum`);
    const data2 = await res2.json();
    setEnums(data2);
    // generateFakeData();
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial" }}>
      <Model
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        setModelData={setModelData}
        setRows={setRows}
      />
      <div style={{ flex: 1, padding: 20 }}>
        {selectedModel && (
          <Structure selectedModel={selectedModel} rows={rows} />
        )}
        <h3>📝 تعبئة بيانات</h3>
        <input
          type="number"
          value={generatedRows || 0}
          onChange={(e) => setGeneratedRows(e.target.value)}
          placeholder="عدد الصفوف المراد توليدها"
          style={{ padding: "4px", width: "300px" }}
          min="1"
          max="1000"
        />
        <div style={{ marginTop: 10 }}>
          {selectedModel &&
            selectedModel.fields
              .filter(
                (f) =>
                  f.hasOwnProperty("name") &&
                  f.hasOwnProperty("type") &&
                  !f.attributes.includes("relation")
              )
              .map((field, idx) => (
                <div key={idx} style={{ margin: "10px 0" }}>
                  {/* {IsEnum(field) && (
                    <pre
                      style={{
                        color: "blue",
                        fontWeight: "bold",
                        marginRight: "5px",
                      }}
                    >
                      {JSON.stringify(
                        enums.find((e) => e.name === field.type),
                        null,
                        2
                      )}
                    </pre>
                  )} */}
                  <label>{field.name}: </label>
                  {IsEnum(field) ? (
                    <select
                      value={formData[field.name] || ""}
                      onChange={(e) =>
                        handleFieldChange(field.name, e.target.value)
                      }
                      style={{ padding: "4px", width: "300px" }}
                    >
                      <option value="">Select {field.name}</option>
                      {enums
                        .filter((attr) => attr.name === field.type)
                        .flatMap((attr) =>
                          attr.values.map((value, index) => (
                            <option key={index} value={value}>
                              {value}
                            </option>
                          ))
                        )}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={formData[field.name] || ""}
                      onChange={(e) =>
                        handleFieldChange(field.name, e.target.value)
                      }
                      style={{ padding: "4px", width: "300px" }}
                    />
                  )}
                </div>
              ))}
        </div>
        <button onClick={handleSubmit}>💾 إرسال الداتا</button>
      </div>
      <button
        onClick={() => router.push("/config")}
        style={{
          direction: "ltr",
          height: "40px",
          width: "100px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Config
      </button>
    </div>
  );
}
