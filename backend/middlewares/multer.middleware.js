import multer from "multer";

// Memory storage for uploads
const memoryStorage = multer.memoryStorage();

export const imageUpload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(file.mimetype)) {
      cb(new Error("Only images are allowed"), false);
    } else {
      cb(null, true);
    }
  },
});

export const videoUpload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
  fileFilter: (req, file, cb) => {
    const allowed = ["video/mp4", "video/webm","video/mov", "video/avi", "video/mkv"];
    if (!allowed.includes(file.mimetype)) {
      cb(new Error("Only videos are allowed"), false);

    } else {
      cb(null, true);
    }
    },
});

// Unified multer middleware for posts (image or video)
export const upload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB (max for video)
  },

  fileFilter: (req, file, cb) => {
    const allowedImages = ["image/jpeg", "image/png", "image/jpg"];
    const allowedVideos = ["video/mp4", "video/webm", "video/mov", "video/avi", "video/mkv"];
    const allAllowed = [...allowedImages, ...allowedVideos];
    
    if (!allAllowed.includes(file.mimetype)) {
      cb(new Error("Only images and videos are allowed"), false);
    } else {
      cb(null, true);
    }
  },
});

// Error handler middleware for multer
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File size is too large! Maximum allowed size is 50 MB for videos and 10 MB for images.'
      });
    }
    return res.status(400).json({
      message: err.message
    });
  } else if (err) {
    return res.status(400).json({
      message: err.message || 'File upload failed'
    });
  }
  next();
};
