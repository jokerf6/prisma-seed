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

  res.status(200).json(models);
}
