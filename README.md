# 📌 Todo Backend – Hono 🚀  

A **lightweight, high-performance** backend for the **Work-Manager** application, built using **Hono, TypeScript, Prisma, and PostgreSQL**.  
Designed for **fast API responses** and seamless integration with the frontend.

---

## ✨ Features  

✅ **Hono-powered API** for minimal overhead and fast routing  
✅ **Prisma ORM** for efficient and type-safe database management  
✅ **PostgreSQL** for scalable and reliable data storage  
✅ **JWT-based Authentication** for secure access  
✅ **Cloudflare Workers integration** for edge deployment  

---

## ⚙️ Tech Stack  

- **Backend:** Hono, TypeScript, Node.js  
- **Database:** PostgreSQL, Prisma ORM  
- **Authentication:** JWT, bcrypt  
- **Deployment:** Cloudflare Workers  

---

## 🖥 Frontend Repository

The frontend for this project is maintained separately:

🔗 **Work-Manager Frontend:**  
https://github.com/wiishal/Work-manager-fe

---

## 🔧 What This Backend Runs

This backend is responsible for running the **core API services** for the Work-Manager application.

It handles:
- User authentication and authorization  
- Task and todo management  
- Secure database operations  
- Communication with the AI service (via internal API calls)  

The backend does **not run the LLM directly**.  
AI-related logic is handled by a separate Node.js service located in the `callAi/` directory.

---


