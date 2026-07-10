// src/api/api.ts

const API_URL = "http://127.0.0.1:5000/api";

// --- LOGIN ---
// CHANGED: Takes `email` instead of `username` to match the backend.
export async function login(email: string, password: string): Promise<any> {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // CHANGED: Sends `email` field in the body.
    body: JSON.stringify({ email, password }), 
  });

  if (!res.ok) {
    // This helps in propagating the error message from the backend
    const errorData = await res.json();
    throw new Error(errorData.msg || 'Login failed');
  }

  return res.json();
}


// --- REGISTER ---
// CHANGED: Added `email` to the function parameters.
export async function register(username: string, email: string, password: string): Promise<any> {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // CHANGED: Sends `username`, `email`, and `password` in the body.
    body: JSON.stringify({ username, email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || 'Registration failed');
  }

  return res.json();
}

// These functions look correct, no changes needed here.
export async function fetchItems(token: string): Promise<any[]> {
  const res = await fetch(`${API_URL}/items`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function addItem(token: string, name: string): Promise<any> {
  const res = await fetch(`${API_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
  return res.json();
}


export async function fetchUserProfile(token: string): Promise<any> {
  const res = await fetch(`${API_URL}/profile`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || 'Failed to fetch user profile');
  }

  return res.json();
}


interface CreateQuestionPayLoad{
    title: string;
    content: string;
    tags: string[];
}

export async function createQuestion(payload: CreateQuestionPayLoad, token: string): Promise<any>{
    const res = await fetch(`${API_URL}/questions`, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if(!res.ok){
        const errorData = await res.json();
        throw new Error(errorData.msg || 'Failed to create question');
    }
    return res.json();
}

export async function fetchQuestions(sortBy: string): Promise<any[]> {
    const res = await fetch(`${API_URL}/questions?sort_by=${sortBy}`);

    if (!res.ok) {
        throw new Error('Failed to fetch questions');
    }

    return res.json();
}

// vote function
export async function voteOnQuestion(questionId: number, direction: 'up' | 'down', token: string): Promise<any> {
    const res = await fetch(`${API_URL}/questions/${questionId}/vote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ direction }),
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || 'Failed to vote');
    }
    return res.json();
}

// display all tags.tsx
export async function fetchTags(): Promise<any[]> {
    const res = await fetch(`${API_URL}/tags`);
    
    if (!res.ok) {
        throw new Error('Failed to fetch tags');
    }

    return res.json();
}

// display users ---
export async function fetchUsers(): Promise<any[]> {
    const res = await fetch(`${API_URL}/users`);
    if (!res.ok) {
        throw new Error('Failed to fetch users');
    }
    return res.json();
}


// sidebar stats
interface SidebarStats {
    quickStats: {
        questions: number;
        answers: number;
        users: number;
    };
    popularTags: string[];
}

// Then, add the fetch function itself
export async function fetchSidebarStats(): Promise<SidebarStats> {
    const res = await fetch(`${API_URL}/sidebar-stats`);
    if (!res.ok) {
        throw new Error('Failed to load site stats');
    }
    return res.json();
}


// --- ADD THESE NEW FUNCTIONS TO YOUR api/api.ts ---

export async function fetchQuestionById(id: string): Promise<any> {
  const res = await fetch(`${API_URL}/questions/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch question details');
  }
  return res.json();
}

export async function fetchAnswersForQuestion(questionId: string): Promise<any[]> {
  const res = await fetch(`${API_URL}/questions/${questionId}/answers`);
  if (!res.ok) {
    throw new Error('Failed to fetch answers');
  }
  return res.json();
}

export async function postAnswer(questionId: string, content: string, token: string): Promise<any> {
  const res = await fetch(`${API_URL}/questions/${questionId}/answers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || 'Failed to post answer');
  }
  return res.json();
}

export async function acceptAnswer(answerId: number, token: string): Promise<any> {
  const res = await fetch(`${API_URL}/answers/${answerId}/accept`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.msg || 'Failed to accept answer');
  }
  return res.json();
}