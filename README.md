# Vibely

Vibely is a full-stack social media app built with the MERN stack.
It supports posts, vibes (short videos), stories, follow system, direct messaging, notifications, and real-time updates via Socket.IO.

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT auth (HTTP-only cookie)
- Socket.IO
- Cloudinary (media storage)
- Multer (uploads)
- Nodemailer (OTP/password reset)

### Frontend
- React + Vite
- Redux Toolkit
- React Router
- Tailwind CSS
- Axios
- Socket.IO Client

## Project Structure

```text
backend/
frontend/
```

- `backend/`: API, auth, database models, real-time server, media/email config
- `frontend/`: React UI, routing, Redux slices, socket client

## Core Features

- Authentication (signup/signin/signout)
- OTP-based password reset (email)
- Post upload (image/video), likes, comments, save, report, delete
- Vibes (video) upload, likes, comments
- Stories (24-hour auto-expiry)
- Profiles (edit profile, follow/unfollow, search users)
- Real-time chat (messages, media, sharing posts/vibes/profiles)
- Real-time notifications
- Light/Dark theme state

## API Base

Default backend route prefix:

```text
/api
```

Main route groups:

- `/api/auth`
- `/api/user`
- `/api/posts`
- `/api/vibes`
- `/api/story`
- `/api/messages`
- `/api/notifications`

## Environment Variables

Create a `.env` file in `backend/`:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

EMAIL=your_gmail_address
EMAIL_PASS=your_gmail_app_password

NODE_ENV=development
```

Create or update `.env` in `frontend/`:

```env
VITE_BACKEND_URL=http://localhost:3000/api
```

> Note: The current frontend `.env` in this repo points to `http://localhost:8080/api`, while backend defaults to port `3000`.
> Use matching ports (either set backend `PORT=8080` or update `VITE_BACKEND_URL` to `3000`).

## Local Setup

### 1) Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2) Run backend

```bash
cd backend
npm run dev
```

### 3) Run frontend

```bash
cd frontend
npm run dev
```

Frontend runs on Vite default `http://localhost:5173`.

## Available Scripts

### Backend (`backend/package.json`)
- `npm run dev` → start backend with nodemon
- `npm test` → placeholder script (no test suite configured)

### Frontend (`frontend/package.json`)
- `npm run dev` → start Vite dev server
- `npm run build` → production build
- `npm run preview` → preview production build
- `npm run lint` → run ESLint

## Real-Time (Socket.IO)

- Tracks online users
- Typing / stop-typing indicators
- Seen receipts in chat
- Emits live message, like/comment, and notification updates

## Data Models

Backend includes models for:

- `User`
- `Post`
- `Vibe`
- `Story`
- `Message`
- `Conversation`
- `Notification`

## Notes

- No automated tests are currently configured.
- CORS is currently localhost-oriented in backend socket/API config.
- No `.env.example` file is included yet.


