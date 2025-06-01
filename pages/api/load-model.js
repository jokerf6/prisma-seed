import fs from "fs";
import path from "path";
import { getSchema } from "@mrleebo/prisma-ast";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ error: "Method not allowed" });
  }

  const { dirPath } = req.body;

  if (!fs.existsSync(dirPath)) {
    return res.status(400).json({ error: "Directory does not exist" });
  }

  const prismaFiles = fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith(".prisma"));

  let combinedContent = "";
  for (const file of prismaFiles) {
    const content = fs.readFileSync(path.join(dirPath, file), "utf-8");
    combinedContent += "\n" + content;
  }

  const schema = getSchema(combinedContent);

  const models = schema.list
    .filter((item) => item.type === "model")
    .map((model) => ({
      name: model.name,
      fields: model.properties.map((field) => ({
        name: field.name,
        type: field.fieldType,
        isOptional: field.optional,
        attributes: field.attributes?.map((a) => a.name) || [],
      })),
    }));
  const prismaModels = schema.list
    .filter((item) => item.type === "model")
    .map(modelToPrisma)
    .join("\n\n");
  console.log("Models:", prismaModels);

  const prismaEnums = schema.list
    .filter((item) => item.type === "enum")
    .map(enumToPrisma)
    .join("\n\n");

  fs.writeFileSync(
    "./prisma/schema.prisma",

    `
    generator client {
  provider        = "prisma-client-js"
}
    
    datasource db {
    provider = "mysql"
    url      = env("DB_URL")
}
${prismaModels}
${prismaEnums}
`,
    "utf-8"
  );

  // fs.writeFileSync("./prisma/enum.prisma", `${prismaEnums}`, "utf-8");

  res.status(200).json(models);
}

function enumToPrisma(enumObj) {
  const lines = enumObj.enumerators.map((e) => `  ${e.name}`);
  return `enum ${enumObj.name} {\n${lines.join("\n")}\n}`;
}
function attributeArgsToString(args = []) {
  return args
    .map((arg) => {
      const val = arg.value;
      if (val.type === "function") {
        return `${val.name}()`;
      } else if (val.type === "keyValue") {
        if (val.value.type === "array") {
          return `${val.key}: [${val.value.args.join(", ")}]`;
        }
        return `${val.key}: ${val.value}`;
      } else if (val.type === "array") {
        return `[${val.args.join(", ")}]`;
      } else {
        return val; // raw value like "true", number, or string
      }
    })
    .join(", ");
}

function fieldAttributesToString(attributes = []) {
  return attributes
    .map((attr) => {
      const args = attributeArgsToString(attr.args || []);
      return args
        ? `@${attr.name}(${args})`
        : `@${attr.group && attr.group.length > 0 ? `${attr.group}.` : ""}${
            attr.name
          }`;
    })
    .join(" ");
}

function propertyToPrismaLine(prop) {
  if (prop.type === "comment") {
    return prop.text;
  }
  if (prop.type === "break") {
    return ""; // line break
  }
  if (prop.type === "field") {
    const fieldName = prop.name;
    const type = prop.fieldType;
    const optional = prop.optional ? "?" : "";
    const array = prop.array ? "[]" : "";
    const attributes = fieldAttributesToString(prop.attributes || []);
    return `  ${fieldName} ${type}${array}${optional} ${attributes}`.trim();
  }
  if (prop.type === "attribute" && prop.kind === "object") {
    const args = attributeArgsToString(prop.args || []);
    return `@@${prop.name}(${args})`;
  }
  return "";
}

function modelToPrisma(model) {
  const lines = model.properties.map(propertyToPrismaLine).filter(Boolean);
  return `model ${model.name} {\n${lines.join("\n")}\n}`;
}
