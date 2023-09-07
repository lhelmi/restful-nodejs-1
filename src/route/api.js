import express from 'express';
import userController from '../controller/user-controller.js';
import { authMiddleware } from '../middleware/auth-middleware.js';
import contactController from '../controller/contact-controller.js';

const userRouter = express.Router();
userRouter.use(authMiddleware);
userRouter.get('/api/users/current', userController.get);
userRouter.patch('/api/users/current', userController.update);
userRouter.delete('/api/users/logout', userController.logout);

userRouter.post('/api/contacts', contactController.create);
userRouter.get('/api/contacts/:contactId', contactController.get);
userController.put('/api/contact/:contactId', contactController.update);

export {
    userRouter
}