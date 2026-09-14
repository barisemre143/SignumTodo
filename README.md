# SignumTodo

SignumTodo is a task board application built with a cleanly separated ASP.NET Core backend and a React frontend.

## Features

- Create, edit, delete, and list tasks
- Kanban board with `Todo`, `InProgress`, and `Completed` columns
- One-way status flow: `Todo -> InProgress -> Completed`
- Drag-and-drop task status updates
- People view grouped by assignee
- Overdue task indicator from backend business logic
- PostgreSQL persistence with Entity Framework Core

## Tech Stack

Backend:

- ASP.NET Core 9
- Entity Framework Core
- PostgreSQL
- Clean architecture style projects:
  - `SignumTodo.Api`
  - `SignumTodo.Application`
  - `SignumTodo.Domain`
  - `SignumTodo.Infrastructure`

Frontend:

- React
- Vite
- Axios
- Context-based state management

## Project Structure

```txt
backend/
  SignumTodo.Api/             HTTP API, controllers, app startup
  SignumTodo.Application/     use cases, DTOs, requests, interfaces
  SignumTodo.Domain/          entities, enums, business rules
  SignumTodo.Infrastructure/  EF Core, PostgreSQL, repositories
  SignumTodo.sln

frontend/
  src/
    components/
    contexts/
    pages/
    services/
    constants/
    utils/
```

## Backend Setup

Create a local backend environment file:

```bash
copy backend\SignumTodo.Api\.env.example backend\SignumTodo.Api\.env
```

Update `backend/SignumTodo.Api/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=signumtodo_db
DB_USERNAME=your_db_name_here
DB_PASSWORD=your_password_here
```

Create the PostgreSQL database if it does not exist:

```txt
signumtodo_db
```

Run migrations:

```bash
cd backend
dotnet ef database update --project SignumTodo.Infrastructure --startup-project SignumTodo.Api
```

Start the API:

```bash
dotnet run --project SignumTodo.Api
```

Default API URL:

```txt
http://localhost:5213
```

## Frontend Setup

Create a frontend environment file:

```bash
copy frontend\.env.example frontend\.env
```

Install dependencies and start Vite:

```bash
cd frontend
npm install
npm run dev
```

Default frontend URL:

```txt
http://localhost:5173
```

If port `5173` is busy, Vite may start on another port such as `5174`.

## Useful Commands

Backend build:

```bash
cd backend
dotnet build SignumTodo.sln /p:UseAppHost=false
```

Frontend build:

```bash
cd frontend
npm run build
```

Frontend lint:

```bash
cd frontend
npm run lint
```

## API Endpoints

```txt
GET    /api/tasks
GET    /api/tasks/{id}
POST   /api/tasks
PUT    /api/tasks/{id}
PATCH  /api/tasks/{id}
DELETE /api/tasks/{id}
```

Example create request:

```json
{
  "taskDescription": "Implement task board",
  "assignedTo": "Recep",
  "plannedDate": "2026-09-16"
}
```

Example status update:

```json
{
  "status": "InProgress"
}
```
