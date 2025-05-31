import { getPrisma } from "../../../../lib/prismaClient";

export default async function handler(req, res) {
  const { model } = req.query;
  const prisma = getPrisma();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = req.body;
    const result = await prisma[model].create({ data });
    res.status(200).json(result);
  } catch (err) {
    res
      .status(400)
      .json({
        error: `فشل في إضافة البيانات في ${model}`,
        details: err.message,
      });
  }
}
