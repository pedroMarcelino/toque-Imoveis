import { Router } from 'express';
import userController from '../controller/userController.js';

const userRoute = Router();

userRoute.post('/login', userController.login)

export default userRoute;