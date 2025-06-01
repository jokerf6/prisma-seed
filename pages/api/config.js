import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { getPrisma } from "../../lib/prismaClient";

const CONFIG_PATH = path.join(process.cwd(), "db-config.json");
const ENV_PATH = path.join(process.cwd(), ".env");

export default function handler(req, res) {
  if (req.method === "POST") {
    const { dbUrl } = req.body;

    if (!dbUrl) return res.status(400).json({ error: "dbUrl مطلوب" });

    try {
      // 1. حفظ db-config.json
      fs.writeFileSync(CONFIG_PATH, JSON.stringify({ dbUrl }, null, 2));

      // 2. تحديث ملف .env
      fs.writeFileSync(ENV_PATH, `DATABASE_URL="${dbUrl}"`);

      // 3. تنفيذ prisma generate
      execSync("npx prisma generate", { stdio: "inherit" });

      return res
        .status(200)
        .json({ message: "تم حفظ الاتصال وتوليد Prisma Client بنجاح" });
    } catch (err) {
      return res
        .status(500)
        .json({ error: "فشل أثناء توليد Prisma Client", details: err.message });
    }
  }

  if (req.method === "GET") {
    getPrisma();
    if (!fs.existsSync(CONFIG_PATH))
      return res.status(404).json({ error: "لا يوجد إعداد" });

    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
    return res.status(200).json(config);
  }

  return res.status(405).json({ error: "الطريقة غير مسموحة" });
}
