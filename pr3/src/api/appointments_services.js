const API_URL = 'http://localhost:3001/api/appointments_services';

// Получить все записи
export async function getAppointmentsServices() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Ошибка при получении записей');
  return await response.json();
}

// Получить запись по ID
export async function getAppointmentsServicesById(id) {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error('Ошибка при получении записи');
  return await response.json();
}

// Создать новую запись
export async function createAppointmentServices(appointmentServices) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointmentServices),
  });
  if (!response.ok) throw new Error('Ошибка при создании записи');
  return await response.json();
}

// Обновить запись
export async function updateAppointmentServices(id, appointmentServices) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointmentServices),
  });
  if (!response.ok) throw new Error('Ошибка при обновлении записи');
}

// Удалить запись
export async function deleteAppointmentServices(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Ошибка при удалении записи');
}
