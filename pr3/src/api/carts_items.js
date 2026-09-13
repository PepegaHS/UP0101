const API_URL = 'http://localhost:3001/api/carts_items';

// Получить все записи
export async function getCartsItems() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Ошибка при получении элементов корзины');
  return await response.json();
}

// Получить запись по ID
export async function getCartItemsById(id) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error('Ошибка при получении элемента корзины');
  return await response.json();
}

// Создать новую запись
export async function createCartItems(appointment) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointment),
  });
  if (!response.ok) throw new Error('Ошибка при создании элемента корзины');
  return await response.json();
}

// Обновить запись
export async function updateCartItems(id, appointment) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointment),
  });
  if (!response.ok) throw new Error('Ошибка при обновлении элемента корзины');
}

// Удалить запись
export async function deleteCartItems(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Ошибка при удалении элемента корзины');
}
