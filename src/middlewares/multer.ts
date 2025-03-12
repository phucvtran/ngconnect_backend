// middleware/multer.ts
import multer from "multer";
import { HttpError } from "../utils/httpError";

/**
 * upload image
 */
const upload = multer({
  storage: multer.memoryStorage(), // temporary memory before upload to s3
  limits: { fileSize: 5 * 1024 * 1024 }, // limit: 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(file.originalname.toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(
      new HttpError(
        HttpError.BAD_REQUEST_CODE,
        HttpError.BAD_REQUEST_DESCRIPTION,
        HttpError.HTTP_MESSAGE.ERROR_IMAGE_FORMAT
      )
    );
  },
});

export default upload;
