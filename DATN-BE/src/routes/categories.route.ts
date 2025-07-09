import { Router } from "express";
import { Categories } from "../models/categories.model";

const router = Router();

router.get("/list", async (req: any, res: any) => {
  try {
    const categories = await Categories.find({ is_deleted: false });
    res.status(201).json({
      message: "success",
      statusCode: 201,
      data: categories,
    });
  } catch (error) {
    console.log(error);
  }
});

export default router;
