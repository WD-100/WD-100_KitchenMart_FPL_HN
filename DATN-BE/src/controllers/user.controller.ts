import { AuthRequest } from "../middlewares/auth.middleware";
import { Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "Không có thông tin người dùng" });
      return;
    }

    const user = await User.findById(userId).populate("role_id");

    if (!user) {
      res.status(404).json({ message: "Người dùng không tồn tại" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Lỗi getMe:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const updateProfile = async (req: any, res: any): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "Không có thông tin người dùng" });
      return;
    }

    const user = await User.findById(userId).populate("role_id");

    if (!user) {
      res.status(404).json({ message: "Người dùng không tồn tại" });
      return;
    }

    const { full_name, phone_number, location, address, avatar } = req.body;

    if (full_name !== undefined) user.full_name = full_name;
    if (phone_number !== undefined) user.phone_number = phone_number;
    if (location !== undefined) user.location = location;
    if (address !== undefined) user.address = address;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      message: "Cập nhật thông tin thành công",
      data: user,
    });
  } catch (error) {
    console.error("Lỗi updateProfile:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const changePassword = async (req: any, res: any): Promise<void> => {
  try {
    const userId = req.userId;

    if (!userId) {
      res.status(401).json({ message: "Không có thông tin người dùng" });
      return;
    }

    const user = await User.findById(userId).populate("role_id");

    if (!user) {
      res.status(404).json({ message: "Người dùng không tồn tại" });
      return;
    }

    const { password, newpassword, renewpassword } = req.body;

    if (!password || !newpassword) {
      res.status(400).json({ message: "Thiếu mật khẩu cũ hoặc mới" });
      return;
    }

    const isMatch = bcrypt.compareSync(password, user.password as string);
    if (!isMatch) {
      res.status(400).json({ message: "Mật khẩu cũ không đúng" });
      return;
    }

    if (newpassword !== renewpassword) {
      res.status(400).json({ message: "Mật khẩu cũ không khớp" });
      return;
    }

    user.password = bcrypt.hashSync(newpassword, 10);
    await user.save();

    res.status(200).json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.error("Lỗi changePassword:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
