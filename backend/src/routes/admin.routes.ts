import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { getUsers, createUser, updateUser, deleteUser, assignTask } from '../controllers/admin.controller';

const router = Router();

// Protect ALL routes: Must be authenticated AND have ADMIN role
router.use(authenticate, authorize('ADMIN'));

router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.put('/tasks/:taskId/assign', assignTask);

export default router;
