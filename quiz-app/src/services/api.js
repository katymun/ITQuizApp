const BASE_URL = 'http://localhost:8080';


function getToken() {
    return localStorage.getItem('token');
}

async function authorizedFetch(path, options = {}) {
    const token = getToken();
    if (!token) {
        throw new Error('No token—redirect to login');
    }
    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };
    const response = await fetch(BASE_URL + path, {
        ...options,
        headers
    });
    if (response.status === 401) {
        // token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw new Error('Unauthorized—please log in again.');
    }
    return response;
}

// GET /quizzes?page=0&size=10
export async function fetchQuizzes(page = 0, size = 10) {
    const res = await authorizedFetch(`/quizzes?page=${page}&size=${size}`, {
        method: 'GET'
    });
    if (!res.ok) {
        throw new Error('Failed to fetch quizzes');
    }
    // Spring Boot returns a Page<Quiz> object, so JSON has a “content” array
    return res.json(); // { content: [ {...}, {...} ], totalElements: 5, totalPages: 1, … }
}