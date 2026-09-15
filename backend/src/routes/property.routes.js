import { Router } from 'express';
import propertyController from '../controller/propertyController.js';
import { authMiddleware } from '../middleware/auth.js';
import upload from '../config/multer.js';

const propertyRoute = Router();

propertyRoute.post('/', authMiddleware, propertyController.createProperty)
propertyRoute.get('/:id', propertyController.getProperty)
propertyRoute.get('/', propertyController.getProperties)
propertyRoute.patch('/:id', authMiddleware, propertyController.updateProperty)
propertyRoute.delete('/:id', authMiddleware, propertyController.deleteProperty)
propertyRoute.patch('/:id/images', authMiddleware, upload.array('images', 10), propertyController.uploadImages)


export default propertyRoute;