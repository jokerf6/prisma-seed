import { getSchema } from "@mrleebo/prisma-ast";
import fs from "fs";
import path from "path";

const dirPath = path.join(process.cwd(), "prisma"); // adjust as needed

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "الطريقة غير مسموحة" });
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

  const enums = schema.list
    .filter((item) => item.type === "enum")
    .map((enumItem) => {
      return {
        name: enumItem.name,
        values: enumItem.enumerators.map((e) => e.name),
      };
    });

  return res.status(200).json(enums);
}
