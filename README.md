# 🏕️ Project Camp Backend

A RESTful API service for collaborative project management. Built with Node.js, Express, and MongoDB.

---

## 🚀 Features

- **Authentication & Authorization** — JWT-based login, registration, email verification, password reset
- **Project Management** — Create, update, delete, and list projects
- **Team Management** — Add members, assign roles, manage access
- **Task Management** — Full task lifecycle with file attachments and status tracking
- **Subtask Management** — Nested subtasks with completion tracking
- **Project Notes** — Admin-controlled notes per project
- **Role-Based Access Control** — Three-tier permission system (Admin, Project Admin, Member)

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (Access + Refresh Tokens)
- **File Uploads:** Multer
- **Email:** Mailtrap (SMTP)
- **Validation:** express-validator

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account or local MongoDB instance
- Mailtrap account for email testing

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/project-camp-backend.git

# Navigate into the project
cd project-camp-backend

# Install dependencies
npm install

# Create your .env file
cp .env.example .env

# Start the server
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following:

```env
MONGO_URI=your_mongodb_connection_string
PORT=8000
CORS_ORIGIN=*

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

MAILTRAP_SMTP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_SMTP_PORT=2525
MAILTRAP_SMTP_USER=your_mailtrap_user
MAILTRAP_SMTP_PASS=your_mailtrap_password

FORGOT_PASSWORD_REDIRECT_URL=http://localhost:3000/forgot-password
SERVER_URL=http://localhost:8000
```

---

## 📡 API Endpoints

### Auth Routes `/api/v1/auth`

| Method | Endpoint                     | Description               | Auth |
| ------ | ---------------------------- | ------------------------- | ---- |
| POST   | `/register`                  | Register a new user       | ❌   |
| POST   | `/login`                     | Login and get tokens      | ❌   |
| POST   | `/logout`                    | Logout user               | ✅   |
| GET    | `/current-user`              | Get logged in user info   | ✅   |
| POST   | `/change-password`           | Change password           | ✅   |
| POST   | `/refresh-token`             | Refresh access token      | ❌   |
| GET    | `/verify-email/:token`       | Verify email address      | ❌   |
| POST   | `/forgot-password`           | Request password reset    | ❌   |
| POST   | `/reset-password/:token`     | Reset password            | ❌   |
| POST   | `/resend-email-verification` | Resend verification email | ✅   |

### Project Routes `/api/v1/projects`

| Method | Endpoint                      | Description            | Role  |
| ------ | ----------------------------- | ---------------------- | ----- |
| GET    | `/`                           | List all user projects | All   |
| POST   | `/`                           | Create a project       | All   |
| GET    | `/:projectId`                 | Get project details    | All   |
| PUT    | `/:projectId`                 | Update project         | Admin |
| DELETE | `/:projectId`                 | Delete project         | Admin |
| GET    | `/:projectId/members`         | List project members   | All   |
| POST   | `/:projectId/members`         | Add a member           | Admin |
| PUT    | `/:projectId/members/:userId` | Update member role     | Admin |
| DELETE | `/:projectId/members/:userId` | Remove a member        | Admin |

### Task Routes `/api/v1/tasks`

| Method | Endpoint                         | Description        | Role                 |
| ------ | -------------------------------- | ------------------ | -------------------- |
| GET    | `/:projectId`                    | List project tasks | All                  |
| POST   | `/:projectId`                    | Create a task      | Admin, Project Admin |
| GET    | `/:projectId/t/:taskId`          | Get task details   | All                  |
| PUT    | `/:projectId/t/:taskId`          | Update task        | Admin, Project Admin |
| DELETE | `/:projectId/t/:taskId`          | Delete task        | Admin, Project Admin |
| POST   | `/:projectId/t/:taskId/subtasks` | Create subtask     | Admin, Project Admin |
| PUT    | `/:projectId/st/:subTaskId`      | Update subtask     | All                  |
| DELETE | `/:projectId/st/:subTaskId`      | Delete subtask     | Admin, Project Admin |

### Note Routes `/api/v1/notes`

| Method | Endpoint                | Description        | Role  |
| ------ | ----------------------- | ------------------ | ----- |
| GET    | `/:projectId`           | List project notes | All   |
| POST   | `/:projectId`           | Create a note      | Admin |
| GET    | `/:projectId/n/:noteId` | Get note details   | All   |
| PUT    | `/:projectId/n/:noteId` | Update note        | Admin |
| DELETE | `/:projectId/n/:noteId` | Delete note        | Admin |

### Health Check `/api/v1/healthcheck`

| Method | Endpoint | Description             |
| ------ | -------- | ----------------------- |
| GET    | `/`      | Check API health status |

---

## 🔒 Permission Matrix

| Feature                    | Admin | Project Admin | Member |
| -------------------------- | ----- | ------------- | ------ |
| Create Project             | ✅    | ❌            | ❌     |
| Update/Delete Project      | ✅    | ❌            | ❌     |
| Manage Project Members     | ✅    | ❌            | ❌     |
| Create/Update/Delete Tasks | ✅    | ✅            | ❌     |
| View Tasks                 | ✅    | ✅            | ✅     |
| Update Subtask Status      | ✅    | ✅            | ✅     |
| Create/Delete Subtasks     | ✅    | ✅            | ❌     |
| Create/Update/Delete Notes | ✅    | ❌            | ❌     |
| View Notes                 | ✅    | ✅            | ✅     |

---

## 📁 Project Structure

```
src/
├── controllers/      # Route handlers
├── middlewares/      # Auth, validation middleware
├── models/           # Mongoose schemas
├── routes/           # Express routers
├── utils/            # Helper functions
└── validators/       # Input validation rules
```

---

## 👤 User Roles

- **admin** — Full access to all project features
- **project_admin** — Can manage tasks and subtasks
- **member** — Can view content and update subtask status

---

## 📝 Task Status

- `todo` — Not started
- `in_progress` — Currently being worked on
- `done` — Completed
