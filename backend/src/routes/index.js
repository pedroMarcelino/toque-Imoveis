import { Router } from 'express';
// import authRoutes from './auth.routes.js';
import propertyRoute from './property.routes.js';


const routes = Router();
routes.use('/property', propertyRoute);



export default routes;