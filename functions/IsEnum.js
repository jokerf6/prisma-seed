export const IsEnum = (field) => {
  const fieldType = field.type.toLowerCase();
  console.log(fieldType);
  if (
    fieldType !== "string" &&
    fieldType !== "int" &&
    fieldType !== "float" &&
    fieldType !== "boolean" &&
    fieldType !== "boolean" &&
    fieldType !== "dateTime" &&
    fieldType !== "datetime" &&
    fieldType !== "decimal" &&
    fieldType !== "bigInt" &&
    fieldType !== "json"
  ) {
    return true;
  }
  return false;
};
