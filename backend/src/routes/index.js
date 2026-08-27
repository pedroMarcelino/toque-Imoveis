import { Router } from 'express';
// import authRoutes from './auth.routes.js';
import propertyRoute from './property.routes.js';
import userRoute from './user.route.js';


const routes = Router();
routes.use('/property', propertyRoute);
routes.use('/user', userRoute);



export default routes;