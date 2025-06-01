Blogging AI Platform

Welcome to my full-stack microservices blogging platform — a hands-on project where AI meets content creation. This app is built from scratch using modern technologies, with a focus on writing assistance, real-time performance, and service-oriented architecture.

🚀 What This Project Does

✍️ Helps users write better — suggests grammar, fixes spelling, and formats blog content using Google Gemini AI.

🧱 Follows microservices architecture — each core functionality (user, blog, author) lives in its own service.

🔒 Secures user authentication — integrates Google OAuth 2.0 for easy login.

🖋️ Provides a clean writing experience — rich-text editing with image uploads.

⚡ Is performance-focused — Redis caching, RabbitMQ messaging, and optimized DB access.

🧰 Tech Stack

Frontend

Next.js (App Router)

TypeScript

TailwindCSS

React Hot Toast

Jodit Rich Text Editor

Backend

Node.js with Express (per service)

PostgreSQL (user/auth data)

MongoDB (blog content)

Redis (cache/session)

RabbitMQ (async communication)

Integrations

Google OAuth (user login)

Gemini API (AI-powered writing assistance)

Cloudinary (image uploads)

✨ Highlights

Modular microservices with isolated responsibilities

AI-enhanced blog writing workflow

Unified UI with smooth UX

Typescript-first approach everywhere

Built for extensibility (more services can be added easily)

🛠️ Running the Project

Start your databases (Mongo, Postgres, Redis) and RabbitMQ — either via Docker or local installs.

Launch each service:

cd services/user && npm run dev
cd services/blog && npm run dev
cd services/author && npm run dev
cd frontend && npm run dev

Navigate to the frontend (http://localhost:3000) and start writing!

👨‍💻 About Me

I'm a full-stack developer who enjoys turning complex ideas into working products. This project is a blend of my interest in writing tools, system design, and frontend polish. It reflects what I believe a modern, scalable web app should look like.

🪪 License

This project is MIT licensed. Feel free to explore, fork, and build upon it.

Feel free to star the repo if you find it interesting!

