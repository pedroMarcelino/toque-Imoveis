import multer from 'multer';
import { AppError } from '../util/appError.js';

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg', 'avif'];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const extension = file.originalname.split('.').pop().toLowerCase();
    const hasValidMimetype = file.mimetype.startsWith('image/');
    const hasValidExtension = IMAGE_EXTENSIONS.includes(extension);

    if (!hasValidMimetype && !hasValidExtension) {
        return cb(new AppError('Apenas arquivos de imagem são permitidos', 400, 'config.multer.fileFilter'));
    }

    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 10
    }
});

export default upload;