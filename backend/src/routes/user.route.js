import { Router } from 'express';
import userController from '../controller/userController.js';
import { authMiddleware, requireApproved } from '../middleware/auth.js';

const userRoute = Router();

userRoute.post('/', userController.create)
userRoute.post('/login', userController.login)
userRoute.get('/', authMiddleware, requireApproved, userController.listUsers)
userRoute.patch('/:id/approve', authMiddleware, requireApproved, userController.approveUser)

export default userRoute;