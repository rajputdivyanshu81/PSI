import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  uploadAttachments,
} from '../controllers/task.controller';

const router = Router();

// Protect all task routes
router.use(authenticate);

router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/:id/attachments', upload.array('files', 3), uploadAttachments);

export default router;
