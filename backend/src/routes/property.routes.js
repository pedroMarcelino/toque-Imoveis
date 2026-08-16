import { Router } from 'express';
import propertyController from '../controller/propertyController.js';

const propertyRoute = Router();

propertyRoute.post('/', propertyController.createPropeties)