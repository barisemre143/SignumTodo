# SignumTodo Frontend

React + Vite frontend for SignumTodo.

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

Default API base URL:

```env
VITE_API_BASE_URL=http://localhost:5213
```

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Structure

```txt
src/
  components/  reusable UI pieces
  contexts/    task state and actions
  pages/       board and people screens
  services/    axios API clients
  constants/   task status constants
  utils/       date helpers
```
