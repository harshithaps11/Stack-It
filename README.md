# StackIt — Developer Q&A and Collaboration Platform

<div align="center">

![StackIt Logo](https://img.shields.io/badge/StackIt-Knowledge%20Sharing-f70776?style=for-the-badge)

**A modern, high-performance developer community hub for asking technical questions, sharing code, earning reputation, and building shared knowledge.**

### [🚀 Click Here to Open the Live App](https://stack-it-hash.vercel.app)

[![Flask](https://img.shields.io/badge/Flask-3.1.1-000000?style=flat&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**StackIt** is a fully functional Q&A forum platform where users can:
- Ask and answer technical questions
- Vote on questions and answers
- Tag questions for better organization
- Accept answers to mark questions as resolved
- Search and filter questions by various criteria
- Track reputation and badges

Built with a Flask REST API backend and a modern React + TypeScript frontend, StackIt provides a seamless user experience with dark mode support, rich text editing, and real-time statistics.

---

## ✨ Features

### 🔐 Authentication & Authorization
- User registration with email and username
- Secure JWT-based authentication
- Password hashing with Werkzeug
- Protected routes and API endpoints

### 💬 Question Management
- **Ask Questions**: Rich text editor with formatting options (bold, italic, lists, links, images)
- **Tag System**: Multi-tag support for categorizing questions
- **Voting System**: Upvote/downvote questions
- **View Tracking**: Automatic view count increment
- **Sorting Options**: Sort by newest, votes, views, or answers

### ✅ Answer System
- Post answers to questions
- Accept answers (question authors only)
- Accepted answers displayed prominently
- Answer sorting by acceptance status

### 🏷️ Tags & Discovery
- Browse all available tags
- Tag statistics (question count, views, recent activity)
- Filter questions by tags
- Dynamic tag suggestions

### 👥 User Features
- User profiles with reputation scores
- Badge system (Gold, Silver, Bronze based on reputation)
- Track questions asked and answers given
- View accepted answer count

### 🎨 UI/UX Features
- **Dark Mode**: System-aware theme with manual toggle
- **Responsive Design**: Mobile-first approach with collapsible sidebars
- **Real-time Search**: Client-side search with query highlighting
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages

### 📊 Statistics & Analytics
- Real-time site statistics (questions, answers, users)
- Popular tags sidebar
- Question view counts
- Answer counts per question

---

## 🛠 Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Flask** | 3.1.1 | Web framework |
| **Flask-SQLAlchemy** | 3.1.1 | ORM for database operations |
| **Flask-JWT-Extended** | 4.7.1 | JWT authentication |
| **Flask-CORS** | 6.0.1 | Cross-origin resource sharing |
| **SQLAlchemy** | 2.0.41 | Database toolkit |
| **Werkzeug** | 3.1.3 | Password hashing & security |
| **SQLite** | 3.x | Database (development) |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI library |
| **TypeScript** | 5.5.3 | Type safety |
| **Vite** | 5.4.2 | Build tool & dev server |
| **React Router** | 7.6.3 | Client-side routing |
| **TailwindCSS** | 3.4.1 | Utility-first CSS framework |
| **Tiptap** | 2.26.1 | Rich text editor |
| **Lucide React** | 0.344.0 | Icon library |

---

## 📁 Project Structure

```
stackit(in flask)/
├── backend/                    # Flask Backend
│   ├── app.py                 # Main application file
│   ├── requirements.txt       # Python dependencies
│   └── instance/
│       └── db.sqlite3        # SQLite database
│
└── frontend/                   # React Frontend
    ├── public/
    ├── src/
    │   ├── api/
    │   │   └── api.ts        # API client functions
    │   ├── assets/
    │   ├── components/
    │   │   ├── Layout/
    │   │   │   ├── Header.tsx
    │   │   │   ├── Sidebar.tsx
    │   │   │   └── MobileSidebar.tsx
    │   │   ├── QuestionCard.tsx
    │   │   ├── RichTextEditor.tsx
    │   │   ├── TagSuggestions.tsx
    │   │   ├── ThemeToggle.tsx
    │   │   └── NotificationDropdown.tsx
    │   ├── contexts/
    │   │   ├── AuthContext.tsx    # Authentication state
    │   │   ├── ThemeContext.tsx   # Dark mode state
    │   │   └── LayoutContext.tsx  # Sidebar state
    │   ├── pages/
    │   │   ├── Home.tsx
    │   │   ├── Popular.tsx
    │   │   ├── Unanswered.tsx
    │   │   ├── Tags.tsx
    │   │   ├── Users.tsx
    │   │   ├── AskQuestion.tsx
    │   │   ├── QuestionDetail.tsx
    │   │   └── Auth/
    │   │       ├── Login.tsx
    │   │       └── Register.tsx
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── vite.config.ts
    └── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

Before running this project, ensure you have the following installed:

- **Python** 3.8 or higher ([Download](https://www.python.org/downloads/))
- **Node.js** 16 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** (optional, for cloning)

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure the application** (Optional):
   
   Edit `app.py` to customize settings:
   ```python
   # JWT Secret Key (Change in production!)
   app.config['JWT_SECRET_KEY'] = 'your-secret-key-here'
   
   # CORS Origins (Update for production)
   CORS(app, origins=["http://localhost:5173"])
   
   # Database URI
   app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite3'
   ```

5. **Run the Flask server:**
   ```bash
   python app.py
   ```
   
   The backend will start on `http://127.0.0.1:5000`

6. **Database initialization:**
   
   The database will be automatically created on first run. Tables include:
   - Users
   - Questions
   - Answers
   - Tags
   - Votes

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure API endpoint** (if needed):
   
   Edit `src/api/api.ts`:
   ```typescript
   const API_URL = "http://127.0.0.1:5000/api";
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   
   The frontend will start on `http://localhost:5173`

5. **Build for production:**
   ```bash
   npm run build
   # or
   yarn build
   ```

---

## 📡 API Documentation

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

---

## 🗄 Database Schema

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

---




## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes:**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch:**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 🐛 Known Issues & Future Enhancements

### Known Issues
- Answer voting system not yet implemented
- User online status is currently hardcoded
- No email verification for registration

### Planned Features
- [ ] Email verification
- [ ] Password reset functionality
- [ ] User profile pages
- [ ] Comment system
- [ ] Answer voting
- [ ] Notification system
- [ ] Search with full-text indexing
- [ ] Markdown support alongside rich text
- [ ] User badges and achievements
- [ ] Question bookmarking
- [ ] PostgreSQL/MySQL support
- [ ] Docker containerization
- [ ] API rate limiting

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👥 Team

**Team Name:** Oblique  
**Contact:** bhadauriasuraj2004@gmail.com

---

## 🙏 Acknowledgments

- Built with modern full-stack web technologies (Flask, SQLAlchemy, React, Vite)
- Icons by [Lucide](https://lucide.dev/)
- Rich text editing by [Tiptap](https://tiptap.dev/)

---

<div align="center">

**Made with ❤️ by Team Oblique**

⭐ Star this repo if you find it helpful!

</div>
