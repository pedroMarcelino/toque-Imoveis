import { Router } from 'express';
import propertyController from '../controller/propertyController.js';
import { authMiddleware, requireApproved } from '../middleware/auth.js';
import upload, { MAX_IMAGES_PER_UPLOAD } from '../config/multer.js';

const propertyRoute = Router();

propertyRoute.post('/', authMiddleware, requireApproved, propertyController.createProperty)
propertyRoute.get('/:id', propertyController.getProperty)
propertyRoute.get('/', propertyController.getProperties)
propertyRoute.patch('/:id', authMiddleware, requireApproved, propertyController.updateProperty)
propertyRoute.delete('/:id', authMiddleware, requireApproved, propertyController.deleteProperty)
propertyRoute.patch('/:id/images', authMiddleware, requireApproved, upload.array('images', MAX_IMAGES_PER_UPLOAD), propertyController.uploadImages)
propertyRoute.delete('/:id/images/:imageId', authMiddleware, requireApproved, propertyController.deleteImage)


export default propertyRoute;