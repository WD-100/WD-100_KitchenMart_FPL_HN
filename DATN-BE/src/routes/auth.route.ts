import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { Role } from "../models/role.model";

const router = Router();

// Định nghĩa dữ liệu đăng nhập 123
interface PayloadLogin {
  email: string;
  password: string;
}

// Định nghĩa dữ liệu đăng ký
interface PayloadRegister {
  full_name: string;
  email: string;
  password: string;
}

// API Đăng ký
router.post(
  "/register",
  async (
    req: {
      body: PayloadRegister;
    },
    res: any
  ) => {
    try {
      const { full_name, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "Email đã được sử dụng" });

      // Tìm role "Người dùng"
      const userRole = await Role.findOne({ code: "user", is_deleted: false });
      if (!userRole)
        return res.status(500).json({ message: "Không tìm thấy quyền User" });

      // Mã hoá mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tạo tài khoản kèm role
      await User.create({
        full_name,
        email,
        password: hashedPassword,
        role_id: userRole._id,
      });

      return res.status(201).json({
        message: "Đăng ký tài khoản thành công",
      });
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }
);

// API Đăng nhập
router.post(
  "/login",
  async (
    req: {
      body: PayloadLogin;
    },
    res: any
  ) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).populate("role_id");

      if (!user)
        return res.status(401).json({ message: "Tài khoản không tồn tại" });

      if (typeof user.password !== "string") {
        return res
          .status(500)
          .json({ message: "Định dạng mật khẩu không hợp lệ" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res
          .status(401)
          .json({ message: "Thông tin tài khoản không chính xác" });

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET as string,
        { expiresIn: "10d" }
      );

      const dataResponse = {
        user,
        accessToken: token,
      };

      return res.status(200).json({
        message: "Đăng nhập thành công",
        data: dataResponse,
      });
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      return res.status(500).json({ message: "Lỗi máy chủ" });
    }
  }
);

export default router;
