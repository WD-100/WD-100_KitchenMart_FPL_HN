import { NextFunction, Response } from "express";
import { User } from "../models/user.model";
import { Role } from "../models/role.model";
import { AuthRequest } from "./auth.middleware";

export const isAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "Không xác định được người dùng" });
      return;
    }

    const user = await User.findById(userId);

    if (!user || !user.role_id) {
      res.status(403).json({ message: "Không tìm thấy quyền người dùng" });
      return;
    }

    const role = await Role.findById(user.role_id);

    if (!role || role.code !== "admin") {
      res
        .status(403)
        .json({ message: "Bạn không có quyền truy cập (cần quyền admin)" });
      return;
    }

    next();
  } catch (error) {
    console.error("Lỗi kiểm tra quyền admin:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};
