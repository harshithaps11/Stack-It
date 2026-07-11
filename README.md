# 🚀 StackIt — Q&A Forum Platform

<div align="center">

**A modern, high-performance developer community hub for asking technical questions, sharing code, earning reputation, and building shared knowledge.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-success?style=for-the-badge&logo=vercel&logoColor=white)](https://stack-it-hash.vercel.app)
&nbsp;
[![Flask Backend](https://img.shields.io/badge/Backend-Flask%203.1.1-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
&nbsp;
[![React Frontend](https://img.shields.io/badge/Frontend-React%2018.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)

---

### [🔗 Live Application](https://stack-it-hash.vercel.app) | [🛠️ Getting Started](#-getting-started) | [📡 API Documentation](#-api-documentation) | [🗄️ Database Schema](#-database-schema) | [👥 Team](#-team)

</div>

---

## 🎯 Overview

**StackIt** is a full-featured developer Q&A forum platform inspired by Stack Overflow. Designed with a robust **Flask** backend REST API and a highly interactive, responsive **React + TypeScript + Tailwind CSS** frontend, StackIt offers a streamlined, fast, and feature-rich user experience for modern developers.

Key highlights include:
- **JWT Authentication** for route security.
- **Rich Text Editor (Tiptap)** with markdown formatting and media options.
- **Reputation & Badge Tracking** system to reward developer contributions.
- **Dynamic Tag System** to discover and categorize knowledge.
- **Smooth Theme System** with system-aware dark mode support.

---

## 📸 Screen Previews

<div align="center">

| 🖥️ Light & Dark Dashboard | 💬 Rich Q&A Interaction |
| :---: | :---: |
| ![Dashboard Preview](https://placehold.co/600x400/2d3748/ffffff?text=StackIt+Home+Feed) | ![Q&A Detail Preview](https://placehold.co/600x400/2d3748/ffffff?text=StackIt+Q%26A+Detail) |
| *Responsive feed with voting, views, and tag metrics* | *Interactive answers, views, and acceptance indicator* |

| 🏷️ Tags Discovery | 👤 User Leaderboard |
| :---: | :---: |
| ![Tags Explorer Preview](https://placehold.co/600x400/2d3748/ffffff?text=StackIt+Tags+Explorer) | ![Users Directory Preview](https://placehold.co/600x400/2d3748/ffffff?text=StackIt+User+Leaderboard) |
| *Tag statistics (question counts, recent activity)* | *Reputation system tracking gold, silver, and bronze badges* |

</div>

---

## ✨ Features

### 🔐 Authentication & Security
* **Seamless Onboarding:** Standard register/login flows.
* **JWT tokens:** Secure stateless session management.
* **Secured Password Hashing:** Powered by `Werkzeug`.
* **Guarded Endpoints:** Protected API routes for posting, updating, and voting.

### 💬 Rich Question Management
* **Rich Editor:** Post questions using an interactive Tiptap editor.
* **Categorization:** Multi-tag support for organizing questions.
* **Voting Engine:** Upvote and downvote questions to surface high-quality answers.
* **Interactive Feeds:** Sort questions by *newest*, *votes*, *views*, or *answers*.
* **Auditing:** Track views automatically.

### ✅ Answer & Reputation System
* **Write Answers:** Contribute Markdown/Rich text answers.
* **Accepted Answers:** Question owners can mark answers as accepted to reward contributors.
* **Gamification:** Users earn reputation points and unlock badges (Gold, Silver, Bronze) based on community contributions.

### 🎨 UI/UX Features
* **Modern CSS Styling:** Tailored Tailwind CSS layouts with smooth transitions.
* **Fluid Dark Mode:** Automatic system-aware preferences with manual override toggle.
* **Interactive Elements:** Real-time search with visual keyword highlighting.
* **Responsive Layout:** Adaptive sidebar and headers built for mobile, tablet, and desktop screens.

---

## 🛠️ Tech Stack & Architecture

### Backend Stack
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Flask** | 3.1.1 | Python REST API Web Framework |
| **Flask-SQLAlchemy** | 3.1.1 | Object Relational Mapping (ORM) |
| **Flask-JWT-Extended** | 4.7.1 | Session & authentication protection |
| **Flask-CORS** | 6.0.1 | Cross-origin sharing config |
| **SQLAlchemy** | 2.0.41 | SQL Database Toolkit |
| **Werkzeug** | 3.1.3 | Security, utility, & password hashing |
| **SQLite / PostgreSQL** | - | Persistent data stores |

### Frontend Stack
| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | 18.3.1 | Declarative component framework |
| **TypeScript** | 5.5.3 | Static type safety and autocomplete |
| **Vite** | 5.4.2 | Dev server and optimized production builder |
| **React Router** | 7.6.3 | Client-side page routing |
| **Tailwind CSS** | 3.4.1 | Utility-first application styling |
| **Tiptap** | 2.26.1 | Rich text editor environment |
| **Lucide React** | 0.344.0 | Responsive vector iconography |

---

## 📁 Project Structure

```
Stack-It/
├── backend/                   # Python Flask REST API
│   ├── app.py                 # Main server file & routes
│   ├── requirements.txt       # Backend package dependencies
│   ├── Procfile               # Production WSGI process definition
│   └── .env.example           # Backend environment configuration template
│
└── frontend/                  # React Single Page App
    ├── src/
    │   ├── api/               # API clients and helpers
    │   ├── assets/            # Project static assets & icons
    │   ├── components/        # Reusable UI components & layouts
    │   ├── contexts/          # Auth, Theme, and Layout state providers
    │   ├── pages/             # App page views (Home, Tags, Profile, etc.)
    │   ├── App.tsx            # Main application router root
    │   ├── index.css          # Tailwind CSS style overrides
    │   └── main.tsx           # Dom initialization
    ├── index.html             # Single page template index
    ├── package.json           # Frontend script definitions
    ├── tailwind.config.js     # Tailwind setup
    └── vercel.json            # Vercel deployment configurations
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed:
* **Python** 3.8+
* **Node.js** 16+
* **npm** or **yarn**

---

### Backend Setup

1. **Navigate to backend root:**
   ```bash
   cd backend
   ```

2. **Setup virtual environment:**
   ```bash
   # Windows:
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux:
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install python packages:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment variables:**
   Copy `.env.example` to `.env` and set your secrets:
   ```bash
   cp .env.example .env
   ```

5. **Start Flask API:**
   ```bash
   python app.py
   ```
   The backend API will listen on: **`http://127.0.0.1:5000`**

---

### Frontend Setup

1. **Navigate to frontend root:**
   ```bash
   cd frontend
   ```

2. **Install node dependencies:**
   ```bash
   npm install
   ```

3. **Run local development client:**
   ```bash
   npm run dev
   ```
   The client application will start at: **`http://localhost:5173`**

4. **Production Build:**
   ```bash
   npm run build
   ```

---

## 📡 API Documentation

<details>
<summary><b>📖 Expand API Endpoint Details</b></summary>

### Authentication Endpoints

#### Register User
```http
POST /api/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword"
}

Response: 201 Created
{
  "msg": "User created"
}
```

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}

Response: 200 OK
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### Get Profile
```http
GET /api/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com"
}
```

### Question Endpoints

#### Get All Questions
```http
GET /api/questions?sort_by=newest
# sort_by options: newest, votes, views, answers

Response: 200 OK
[
  {
    "id": 1,
    "title": "How to use Flask with React?",
    "content": "<p>I'm trying to integrate...</p>",
    "author": {
      "username": "johndoe",
      "reputation": 150
    },
    "tags": ["flask", "react"],
    "voteCount": 5,
    "answerCount": 3,
    "views": 120,
    "createdAt": "2025-01-01T10:30:00"
  }
]
```

#### Get Question by ID
```http
GET /api/questions/:id

Response: 200 OK
{
  "id": 1,
  "title": "How to use Flask with React?",
  "content": "<p>I'm trying to integrate...</p>",
  "author": {...},
  "tags": ["flask", "react"],
  "voteCount": 5,
  "answerCount": 3,
  "views": 121,
  "createdAt": "2025-01-01T10:30:00"
}
```

#### Create Question
```http
POST /api/questions
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "How to implement JWT in Flask?",
  "content": "<p>I need help with...</p>",
  "tags": ["flask", "jwt", "authentication"]
}

Response: 201 Created
{
  "msg": "Question created successfully",
  "question": {
    "id": 2,
    "title": "How to implement JWT in Flask?"
  }
}
```

#### Vote on Question
```http
POST /api/questions/:id/vote
Authorization: Bearer <token>
Content-Type: application/json

{
  "direction": "up"  # or "down"
}

Response: 200 OK
{
  "msg": "Vote recorded",
  "newVoteCount": 6
}
```

### Answer Endpoints

#### Get Answers for Question
```http
GET /api/questions/:id/answers

Response: 200 OK
[
  {
    "id": 1,
    "content": "<p>You can use CORS...</p>",
    "author": {
      "id": 2,
      "username": "janedoe",
      "reputation": 200
    },
    "isAccepted": true,
    "createdAt": "2025-01-01T11:00:00",
    "voteCount": 0
  }
]
```

#### Post Answer
```http
POST /api/questions/:id/answers
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "<p>Here's how you do it...</p>"
}

Response: 201 Created
{
  "id": 2,
  "content": "<p>Here's how you do it...</p>",
  "author": {...},
  "isAccepted": false,
  "createdAt": "2025-01-01T12:00:00",
  "voteCount": 0
}
```

#### Accept Answer
```http
POST /api/answers/:id/accept
Authorization: Bearer <token>

Response: 200 OK
{
  "msg": "Answer accepted successfully"
}
```

### Other Endpoints

#### Get All Tags
```http
GET /api/tags

Response: 200 OK
[
  {
    "name": "flask",
    "description": "Questions related to the 'flask' tag.",
    "questions": [
      {
        "answer_count": 3,
        "views": 120,
        "created_at": "2025-01-01T10:30:00"
      }
    ]
  }
]
```

#### Get All Users
```http
GET /api/users

Response: 200 OK
[
  {
    "id": 1,
    "username": "johndoe",
    "reputation": 150,
    "questionsAsked": 5,
    "answersGiven": 12,
    "acceptedAnswers": 3,
    "joinedDate": "2024-12-01T00:00:00",
    "badges": ["Bronze"],
    "isOnline": false
  }
]
```

#### Get Sidebar Stats
```http
GET /api/sidebar-stats

Response: 200 OK
{
  "quickStats": {
    "questions": 42,
    "answers": 156,
    "users": 23
  },
  "popularTags": ["python", "flask", "react", "typescript", "javascript"]
}
```
</details>

---

## 🗄️ Database Schema

<details>
<summary><b>💾 Expand DB SQL Schema Details</b></summary>

### Users Table
```sql
CREATE TABLE user (
    id INTEGER PRIMARY KEY,
    username VARCHAR(120) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password VARCHAR(120) NOT NULL,
    reputation INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Questions Table
```sql
CREATE TABLE question (
    id INTEGER PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    vote_count INTEGER DEFAULT 0,
    answer_count INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);
```

### Answers Table
```sql
CREATE TABLE answer (
    id INTEGER PRIMARY KEY,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_accepted BOOLEAN DEFAULT FALSE,
    user_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (question_id) REFERENCES question(id)
);
```

### Tags Table
```sql
CREATE TABLE tag (
    id INTEGER PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE question_tags (
    question_id INTEGER,
    tag_id INTEGER,
    PRIMARY KEY (question_id, tag_id),
    FOREIGN KEY (question_id) REFERENCES question(id),
    FOREIGN KEY (tag_id) REFERENCES tag(id)
);
```

### Votes Table
```sql
CREATE TABLE vote (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    direction INTEGER NOT NULL,  -- 1 for upvote, -1 for downvote
    UNIQUE (user_id, question_id),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (question_id) REFERENCES question(id)
);
```
</details>

---

## 🤝 Contributing

Contributions are welcome! Follow these steps to submit a PR:
1. **Fork** the repository.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'feat: Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a **Pull Request**.

### Guidelines
* Adhere to clean code practices and existing styling metrics.
* Provide comments for non-trivial logic blocks.
* Keep routes, database tables, and state updates secure.

---

## 🐛 Known Issues & Planned Enhancements

### Known Issues
- Answer upvoting/downvoting is not yet supported.
- Active user online status uses static tracking.
- Email authentication verification is not integrated.

### Planned Enhancements
- [ ] Email registration validation.
- [ ] User password recovery flows.
- [ ] Profile customization options.
- [ ] Direct comments threads for questions/answers.
- [ ] Comprehensive search features with database indexing.
- [ ] Containerized workspace via Docker.

---

## 👥 Team

* **Team Name:** Oblique
* **Support Email:** [bhadauriasuraj2004@gmail.com](mailto:bhadauriasuraj2004@gmail.com)

---

## 🙏 Acknowledgments

* Designed around [Stack Overflow](https://stackoverflow.com/) design mechanics.
* Vector Icons powered by [Lucide React](https://lucide.dev/).
* Styled components crafted via [Tailwind CSS](https://tailwindcss.com/).
* Rich text fields powered by [Tiptap](https://tiptap.dev/).

---

<div align="center">

**Made with ❤️ by Team Oblique**  
⭐ Star this repository if you find it helpful!

</div>
