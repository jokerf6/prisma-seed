export default function Structure({ selectedModel, rows }) {
  return (
    <>
      {selectedModel ? (
        <>
          <h2>🧱 Model: {selectedModel.name}</h2>
          <p>Rows: {rows}</p>
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
              {selectedModel &&
                selectedModel.fields &&
                selectedModel.fields
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
        </>
      ) : (
        <p>اختر موديل لعرض التفاصيل.</p>
      )}
    </>
  );
}
