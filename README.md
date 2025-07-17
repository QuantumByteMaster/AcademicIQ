# AcademicIQ

**AcademicIQ** is a modern, AI-powered productivity platform built to streamline study planning, resource management, and document interaction for students and lifelong learners. Combining intelligent learning pathways with smart content discovery and PDF comprehension, AcademicIQ helps users stay organized and motivated through an integrated web application.

---

## 🌟 Core Features

### Personalized Study Planner

- Generate subject-based study schedules automatically.
- Set exam dates and receive dynamic weekly and daily plans.
- Visual progress indicators and adjustable task tracking.

### Intelligent Resource Finder

- Discover curated resources: videos, articles, courses, and exercises.
- AI-driven search powered by Tavily API.
- Filter content by difficulty, format, and relevance.

### Document Chat Assistant

- Upload PDFs and ask context-aware questions.
- Highlight specific content and reference source pages.
- Integrated PDF viewer with synchronized chat.

### Enhanced User Experience

- Clean, responsive interface with modern UI components.
- Real-time notifications and loading indicators.
- Session persistence and interactive navigation tools.

---

## 🚀 Technology Stack

**Frontend:**

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + Shadcn UI
- Zustand & React Query
- React-PDF + PDF.js
- NextAuth.js (JWT-based authentication)

**Backend:**

- Node.js + Express
- MongoDB + Mongoose ODM
- Groq API (LLM Services)
- HuggingFace API (Document Embeddings)
- Tavily API (Content Discovery)
- JWT Security, Rate Limiting, Input Validation

---

## ⚙️ Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/academiciq
cd academiciq
```

### 2️⃣ Set Up Environment Variables

Create a `.env` file:

```
NEXTAUTH_SECRET=your-secret-key
MONGODB_URI=your-mongodb-uri
NEXTAUTH_URL=http://localhost:3000
EXPRESS_BACKEND_URL=http://backend:5000
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://us.posthog.com
NEXT_PUBLIC_API_URL=http://backend:5000
API_URL=http://backend:5000
GROQ_API_KEY=your-groq-api-key
GROQ_API_KEY_RAG=your-groq-api-key
TAVILY_API_KEY=your-tavily-api-key
HUGGINGFACE_API_KEY=your-huggingface-api-key
```

### 3️⃣ Build & Run with Docker Compose

```bash
docker compose build
docker compose up -d
```

Frontend: `http://localhost:3000`
Backend: `http://localhost:5000`

---

## 🎓 Usage Flow

- **Study Planner:**

  - Input subject and exam date → Auto-generate plan → Track progress.

- **Resource Discovery:**

  - Search topic → Filter resources → Save or use directly.

- **PDF Chat Assistant:**

  - Upload PDF → Ask questions → View results with page references.

---

## 💡 Contribution Guide

We welcome new ideas and improvements:

1. Fork the repository
2. Create a feature branch
3. Commit changes with clear messages
4. Push your branch
5. Open a pull request

---

## 📄 License

AcademicIQ is licensed under the Apache 2.0 License.
