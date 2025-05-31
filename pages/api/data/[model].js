import { getPrisma } from "../../../lib/prismaClient";

export default async function handler(req, res) {
  const { model } = req.query;
  const prisma = getPrisma();

  try {
    console.log("--------------------------------");
    const data = await prisma[model].findMany({ take: 10 });
    res.status(200).json(data);
  } catch (err) {
    res
      .status(400)
      .json({ error: `فشل في جلب البيانات من ${model}`, details: err.message });
  }
}
