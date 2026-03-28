const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");
const ApiError = require("../utils/apiError");

// إعدادات تخزين عامة على Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = "uploads";
    let resource_type = "raw";

    if (file.fieldname === "imageProfile") {
      folder = "profile_images";
      resource_type = "image";
    } else if (file.fieldname === "images") {
      folder = "productImages";
      resource_type = "image";
    } else if (file.fieldname === "image"){
      folder = "image";
      resource_type = "image";
    }

    return {
      folder,
      resource_type,
      public_id: `${Date.now()}-${file.originalname.split(".")[0].trim().replace(/\s+/g, "_")}`,
      format: file.mimetype.split("/")[1],
    };
  },
});

// الفلتر للتأكد من نوع الملفات المقبولة
const fileFilter = (req, file, cb) => {
  if (
    file.fieldname === "imageProfile" &&
    !file.mimetype.startsWith("image/")
  ) {
    return cb(new ApiError("Only images allowed for imageProfile", 400), false);
  }

  if (
    file.fieldname === "images" &&
    !file.mimetype.startsWith("image/")
  ) {
    return cb(new ApiError("Only image allowed for products images", 400), false);
  }

   if (
    file.fieldname === "image" &&
    !file.mimetype.startsWith("image/")
  ) {
    return cb(new ApiError("Only image allowed for category image", 400), false);
  }

  cb(null, true);
};

// إعداد multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// ميدل وير لرفع صورة وملف معًا
exports.uploadImages = upload.fields([
  { name: "imageProfile", maxCount: 1 },
  { name: "images", maxCount: 5 },
  { name: "image" , maxCount:1}
]);

exports.attachUploadedLinks = (req, res, next) => {
  try {
    req.uploadedFiles = {};

    Object.keys(req.files || {}).forEach((key) => {
      req.uploadedFiles[key] = req.files[key].map((f) => f.path);
    });

    next();
  } catch {
    next(new ApiError("Error processing uploaded files", 500));
  }
};
