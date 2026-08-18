import { Router } from 'express';
import propertyController from '../controller/propertyController.js';

const propertyRoute = Router();

propertyRoute.post('/', propertyController.createProperty)
propertyRoute.get('/:id', propertyController.getProperty)
propertyRoute.patch('/:id', propertyController.updateProperty)
propertyRoute.delete('/:id', propertyController.deleteProperty)

export default propertyRoute;