import { Response, NextFunction } from 'express';
import prisma from '../db';
import { AuthRequest } from '../middleware/auth.middleware';

// 1. Create Task
export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || 'TODO',
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: req.user.id,
      },
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// 2. Get All Tasks (with Filtering, Sorting, Pagination)
export const getTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const status = req.query.status as string | undefined;
    const priority = req.query.priority as string | undefined;
    const sortBy = req.query.sortBy as string | undefined;
    const sortOrder = req.query.sortOrder as string | undefined;
    const page = parseInt((req.query.page as string) || '1');
    const limit = parseInt((req.query.limit as string) || '10');

    const skip = (page - 1) * limit;

    const where: any = {};
    if (req.user.role !== 'ADMIN') {
      where.userId = req.user.id; // Users see only their own tasks
    }
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        user: {
          select: { email: true, role: true }
        },
        attachments: true
      }
    });

    const total = await prisma.task.count({ where });

    res.json({
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// 3. Get Single Task
export const getTaskById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const id = req.params.id as string;
    const task = await prisma.task.findUnique({
      where: { id },
      include: { attachments: true }
    });

    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (task.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to view this task' });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

// 4. Update Task
export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const id = req.params.id as string;
    const { title, description, status, priority, dueDate } = req.body;

    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (task.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to update this task' });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
    });

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// 5. Delete Task
export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const id = req.params.id as string;
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (task.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to delete this task' });
    }

    await prisma.task.delete({ where: { id } });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// 6. Upload Attachments
export const uploadAttachments = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const id = req.params.id as string;
    const task = await prisma.task.findUnique({
      where: { id },
      include: { attachments: true }
    });

    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (task.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    if (task.attachments.length + req.files.length > 3) {
      return res.status(400).json({ error: 'A task can have a maximum of 3 attachments' });
    }

    const newAttachments = req.files.map((file: Express.Multer.File) => ({
      taskId: task.id,
      url: `/uploads/${file.filename}`,
      filename: file.originalname,
    }));

    await prisma.taskAttachment.createMany({
      data: newAttachments,
    });

    const updatedTask = await prisma.task.findUnique({
      where: { id },
      include: { attachments: true },
    });

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};
