import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const CONFIG_PATH = path.join(process.cwd(), "db-config.json");
const GENERATED_CLIENT_PATH = path.join(process.cwd(), "./prisma/.prisma");

let prisma = null;

export function getPrisma() {
  if (prisma) return prisma;

  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
  const dbUrl = config.dbUrl;

  // ✅ Generate if not exists
  if (!fs.existsSync(GENERATED_CLIENT_PATH)) {
    console.log("🔄 Generating Prisma Client...");
    try {
      execSync("npx prisma generate", { stdio: "inherit" });
      console.log("✅ Prisma Client generated.");
    } catch (err) {
      console.error("❌ Failed to generate Prisma Client", err);
      throw new Error("Prisma Client generation failed.");
    }
  }

  // ✅ import after generation
  const { PrismaClient } = require("@prisma/client");

  console.log("🔗 Connecting to database:", dbUrl);
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
  });

  return prisma;
}
