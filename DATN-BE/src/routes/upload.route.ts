import express, { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router: Router = express.Router();

// Lấy đường dẫn thư mục uploads nằm ngoài thư mục project hiện tại
const baseUploadDir = path.join(process.cwd(), "uploads");
const imageDir = path.join(baseUploadDir, "images");
// You can now define your routes here

[imageDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Tạo storage và filter cho từng loại
const createStorage = (dir: any) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = path
        .basename(file.originalname, ext)
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-_]/g, "");
      cb(null, `${name}-${Date.now()}${ext}`);
    },
  });

const createFilter =
  (allowedTypes: string | any[], errorMessage: string | undefined) =>
  (req: any, file: any, cb: any) =>
    allowedTypes.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error(errorMessage), false);

// Multer config
const uploadImage = multer({
  storage: createStorage(imageDir),
  fileFilter: createFilter(
    ["image/jpeg", "image/png", "image/jpg"],
    "Chỉ chấp nhận file ảnh"
  ),
});

// validate định dạng ảnh
const imageFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/webp" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true); // ✅ Cho phép upload
  } else {
    cb(new Error("Chỉ được upload file ảnh (jpg, jpeg, png, webp)"), false); // ❌ Từ chối
  }
};

const uploadImageMultiple = multer({
  storage: createStorage(imageDir),
  fileFilter: imageFilter,
  limits: { files: 10 }, // Giới hạn số lượng ảnh là 10
});

// 📸 API upload ảnh
router.post("/image", uploadImage.single("image"), (req: any, res: any) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: "Không có ảnh được upload" });

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/images/${
    file.filename
  }`;
  res.json({ message: "Upload ảnh thành công", imageUrl: fileUrl });
});

// api upload multiple
router.post("/image/multiple", (req, res) => {
  uploadImageMultiple.array("image", 10)(req, res, function (err) {
    if (
      err instanceof multer.MulterError &&
      err.code === "LIMIT_UNEXPECTED_FILE"
    ) {
      return res.status(400).json({ error: "Chỉ được upload tối đa 10 ảnh" });
    }
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const files: any = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "Không có ảnh nào được upload" });
    }

    const fileUrls = files.map((file: { filename: string }) => {
      return `${req.protocol}://${req.get("host")}/uploads/images/${
        file.filename
      }`;
    });

    res.json({
      message: "Upload nhiều ảnh thành công",
      imageUrls: fileUrls,
    });
  });
});

export default router;
