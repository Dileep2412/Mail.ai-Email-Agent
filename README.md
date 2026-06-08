<div align="center">

# 📧 Mail.ai
### AI-Powered Email Agent

[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Dileep2412/Mail.ai-Email-Agent)

*Type in natural language → AI composes → Email sent instantly!*

</div>

---

## ✨ What is Mail.ai?

Mail.ai is an AI-powered email agent where you just type what you want in plain English and the AI automatically writes a professional email and sends it — no forms, no manual drafting!

**Example:**
> *"Send a leave application to manager@company.com for 2 days"*
> → AI writes professional email → Sends instantly ✅

---

## 🚀 Features

- 💬 **Natural Language Input** — Just type what you want
- 🤖 **AI Email Composer** — Mistral AI writes professional emails
- 📧 **Gmail Integration** — Sends via Nodemailer
- 🔐 **Authentication** — Login with Password or OTP
- 📊 **Sent Emails Dashboard** — View all sent email history
- 🌙 **Professional Dark UI** — Clean, responsive design

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vite |
| Backend | Node.js, Express |
| AI Agent | LangChain, Mistral AI |
| Auth & DB | Supabase |
| Email | Nodemailer, Gmail SMTP |
| Deployment | Vercel (frontend) |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- Gmail account with App Password
- Mistral AI API Key
- Supabase account

### Backend Setup
```bash
cd backend
npm install
```

Create `.env` in backend folder:
```
MISTRAL_API_KEY=your_mistral_key
GOOGLE_USER=your@gmail.com
GOOGLE_APP_PASSWORD=your_app_password
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
```

```bash
node server.js
```

### Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` in frontend folder:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_BACKEND_URL=http://localhost:3000
```

```bash
npm run dev
```

---

## 📸 How It Works

1. **Login** with email/password or OTP
2. **Type** what email you want to send
3. **AI composes** a professional email automatically
4. **Email sent** directly to recipient
5. **View history** in Dashboard

---

## 💻 Local Demo

```bash
# Terminal 1 - Backend
cd backend
node server.js

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

Open `http://localhost:5173` and start sending emails with AI! 

---

## 📄 License

MIT License — feel free to use!

---

<div align="center">
Made with ❤️ by Dileep Parihar
</div>
