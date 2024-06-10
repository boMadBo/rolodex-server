import { diskStorage } from 'multer';
import * as path from 'path';

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, './src/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const fileName = uniqueSuffix + fileExtension;
    cb(null, fileName);
  },
});

export const multerOptions = {
  storage: storage,
};
