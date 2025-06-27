import { Role } from "../models/role.model";

export const initRoles = async () => {
  try {
    const existingRoles = await Role.find({ code: { $in: ["admin", "user"] } });

    const roleCodes = existingRoles.map((role) => role.code);

    const rolesToCreate = [];

    if (!roleCodes.includes("admin")) {
      rolesToCreate.push({ name: "Quản trị viên", code: "admin" });
    }

    if (!roleCodes.includes("user")) {
      rolesToCreate.push({ name: "Người dùng", code: "user" });
    }

    if (rolesToCreate.length > 0) {
      await Role.insertMany(rolesToCreate);
      console.log(
        "✅ Đã khởi tạo role mặc định:",
        rolesToCreate.map((r) => r.code).join(", ")
      );
    } else {
      console.log("ℹ️ Các role mặc định đã tồn tại.");
    }
  } catch (error) {
    console.error("❌ Lỗi khi khởi tạo role mặc định:", error);
  }
};
