import { Router } from "express";
import { Role } from "../../models/role.model";
const router = Router();

router.get("/list", async (req: any, res: any) => {
  try {
    const feedback = await Role.find({ is_deleted: false });
    res.status(200).json({
      message: "success",
      statusCode: 200,
      data: feedback,
    });
  } catch (error) {
    console.log(error);
  }
});

export default router;
