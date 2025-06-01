export const Clean = (field) => {
  const rawValue = data[field.name];
  const fieldType = field.type.toLowerCase();

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
};
