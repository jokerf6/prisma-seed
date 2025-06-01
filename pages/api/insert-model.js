import { getPrisma } from "../../lib/prismaClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { modelName, data } = req.body;
  console.log(modelName);
  console.log(data);
  console.log(`📥 Received data to insert into model ${modelName}:`);
  const prisma = await getPrisma();
  await prisma[modelName].create({
    data,
  });

  res
    .status(200)
    .json({ message: `✅ Model ${modelName} data received`, data });
}
