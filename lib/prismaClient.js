import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), "db-config.json");

let prisma = null;

export function getPrisma() {
  if (prisma) return prisma;

  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: config.dbUrl,
      },
    },
  });

  return prisma;
}
