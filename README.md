# TaskFlow - Full-Stack Task Management System

TaskFlow is a comprehensive Task Management System built for the PSI Technical Assignment. It provides robust user authentication, role-based access control, CRUD operations for tasks and users, and file attachments up to 3 PDFs per task.

## Tech Stack
- **Frontend:** React, HTML, CSS, TailwindCSS, Redux Toolkit, React Router, Vite, Axios
- **Backend:** Node.js, Express.js, TypeScript, Prisma ORM, JSON Web Tokens (JWT), bcryptjs, Multer
- **Database:** PostgreSQL
- **Testing:** Jest, Supertest
- **Documentation:** Swagger UI
- **Containerization:** Docker & Docker Compose

## Features
- **User Authentication:** Registration, Login, and persistent sessions with JWT stored locally.
- **Role-Based Access Control (RBAC):** `ADMIN` and `USER` roles.
- **Task Management:** Create, Read, Update, Delete tasks with properties (Title, Description, Status, Priority, Due Date).
- **Filtering & Pagination:** Fetch tasks by status/priority and paginate through them.
- **File Uploads:** Attach up to 3 PDF documents to each task.
- **Admin Dashboard:** Admins can view/manage all users and assign tasks.
- **API Documentation:** Interactive Swagger interface.

## Prerequisites
- Node.js (v20+)
- Docker & Docker Compose
- npm or yarn

## Local Setup

### 1. Database & Containers
You can start the PostgreSQL database and Adminer using Docker:
```bash
docker-compose up -d
```
*Note: Make sure port 5433 is free. The database runs on postgres://postgres:postgres@localhost:5433/task_management*

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file (if not exists):
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5433/task_management?schema=public"
   JWT_SECRET="supersecret_jwt_key_psi_task_management_2026"
   PORT=5000
   ```
4. Run Database Migrations:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Start backend:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start frontend:
   ```bash
   npm run dev
   ```

## API Documentation
Once the backend is running, access the Swagger UI directly at:
http://localhost:5000/api-docs

## Deployment Suggestions
- **Frontend**: Vercel (connect GitHub repository, root directory `/frontend`, build command `npm run build`).
- **Backend**: Render (connect GitHub repository, root directory `/backend`, build command `npm install && npm run build`, start command `npm start`, attach a Managed PostgreSQL instance).
