import { User } from "../../models/user.model";
import bcrypt from "bcryptjs";

export const listUsers = async (req: any, res: any) => {
  try {
    const searchValue = (req.query.value as string)?.trim() || "";

    const filter: any = { is_deleted: false };

    if (searchValue) {
      const regex = new RegExp(searchValue, "i");
      filter.$or = [
        { full_name: { $regex: regex } },
        { email: { $regex: regex } },
      ];
    }

    const users = await User.find(filter)
      .populate("role_id") // Lấy đầy đủ thông tin role
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "success",
      data: {
        users,
        totalItems: users.length,
      },
    });
  } catch (error) {
    console.error("Error listing users:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const detailUser = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const user = await User.findById({ _id: id, is_deleted: false });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        statusCode: 404,
      });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      data: user,
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Server error", statusCode: 500 });
  }
};

export const deleteUser = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const user = await User.findOne({ _id: id, is_deleted: false });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        statusCode: 404,
      });
    }

    user.is_deleted = true;

    await user.save();

    return res.status(200).json({
      message: "User deleted successfully",
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error deleting uer:", error);
    return res.status(500).json({ message: "Server error", statusCode: 500 });
  }
};

export const createUser = async (req: any, res: any) => {
  try {
    const {
      full_name,
      email,
      password,
      role_id,
      phone_number,
      location,
      address,
      avatar,
    } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      full_name,
      email,
      password: hashedPassword,
      role_id,
      phone_number,
      location,
      address,
      avatar,
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req: any, res: any) => {
  const { id } = req.params;
  const { full_name, email, role_id, phone_number, location, address, avatar } =
    req.body;

  try {
    const user = await User.findOne({ _id: id, is_deleted: false });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: id } });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Email already in use by another account" });
      }
      user.email = email;
    }

    if (full_name !== undefined) user.full_name = full_name;
    if (role_id !== undefined) user.role_id = role_id;
    if (phone_number !== undefined) user.phone_number = phone_number;
    if (location !== undefined) user.location = location;
    if (address !== undefined) user.address = address;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    return res.status(200).json({
      message: "User updated successfully",
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
