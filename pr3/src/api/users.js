const API_URL = 'http://localhost:3001/api/users';


// Получить все пользователей
export async function getUsers() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Ошибка при получении пользователей');
  return await response.json();
}

// Получить запись по ID
export async function getUserById(id) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error('Ошибка при получении пользователя');
  return await response.json();
}

// Создать новую запись
export async function createUser(user) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Ошибка при создании пользователя');
  }

  return data;
}

// Обновить запись
export async function updateUser(id, user) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error('Ошибка при обновлении пользователя');
  return await response.json();
}

// Удалить запись
export async function deleteUser(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Ошибка при удалении пользователя');
  return await response.json();
}

// Логин пользователя
export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.error || 'Ошибка при входе пользователя');
    error.code = data.code;
    throw error;
  }

  return data;
}