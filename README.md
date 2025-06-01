# Blogging AI Platform

A full-stack, AI-powered blogging platform built with a microservices architecture. Designed to offer seamless writing, publishing, and content enhancement features for bloggers. This project uses modern technologies across the stack to demonstrate scalable service-based design, performance optimization, and developer-first tooling.

---

## 🚀 Features

* **AI Writing Assistant**

  * Automatically improves grammar, spelling, and structure using Google Gemini API.
  * One-click enhancements for titles, descriptions, and full blog content.

* **Microservices Architecture**

  * Isolated services for user management, blog operations, author profiles, and more.
  * RabbitMQ message broker for decoupled, event-driven communication.

* **Authentication & Authorization**

  * Google OAuth 2.0 login for users
  * JWT-based user session handling

* **Rich Content Editor**

  * Integrated Jodit rich-text editor
  * Image uploads supported via Cloudinary

* **Dynamic Blog Management**

  * Create, update, delete, and read blog posts
  * Categorization, content storage, and versioning

* **Advanced Backend Stack**

  * **PostgreSQL** for relational user/auth data
  * **MongoDB** for flexible blog content storage
  * **Redis** for caching and session optimization

---

## 🤖 Tech Stack

### Frontend

* Next.js (App Router)
* TypeScript
* TailwindCSS
* React Hot Toast & Jodit Editor

### Backend (Microservices)

* Node.js + Express.js (per service)
* TypeScript (everywhere)
* RabbitMQ (message queue)
* Redis (caching)
* PostgreSQL (User/Auth Service)
* MongoDB (Blog Service)
* Cloudinary (Media uploads)
* Google OAuth (Auth)
* Gemini API (AI Enhancements)

---

## 💡 Highlights

* Focused on clean, scalable service boundaries
* Demonstrates real-world integration of multiple databases
* Full AI workflow built into the writing experience
* Fully typed with TypeScript across services and client
* Dev-friendly error handling and logging

---

## 🙌 How to Run Locally

```bash
# Start each service
cd services/user && npm run dev
cd services/blog && npm run dev
cd services/author && npm run dev
cd frontend && npm run dev

# RabbitMQ, Redis, Mongo, Postgres should be running (use Docker or local installs)
```

---

## 🌟 Contributions

This is a personal project but feel free to fork, open issues, or contribute improvements. I'm especially open to ideas around scaling, performance optimizations, and CI/CD setup.

---

## 👨‍💻 About the Author

Built by a full-stack developer passionate about distributed systems, AI-assisted UX, and developer-friendly tooling. This project is a demonstration of architecture, UX polish, and end-to-end microservice communication.

---

## 📢 License

This project is licensed under the MIT License.
