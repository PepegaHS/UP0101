import { useState, useEffect } from 'react';
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from '../api/appointments';


export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    id_appointment: null,
    user_id: '',
    master_id: '',
    appointment_date: '',
    note: '',
    is_completed: false
  });

  const [formError, setFormError] = useState(null);

  // Загрузка списка
  async function loadAppointments() {
    try {
      setLoading(true);
      const data = await getAppointments();
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (formData.id_appointment) {
        await updateAppointment(formData.id_appointment, formData);
      } else {
        await createAppointment(formData);
      }
      setFormData({
        id_appointment: null,
        user_id: '',
        master_id: '',
        appointment_date: '',
        note: '',
        is_completed: false
      });
      setFormError(null);
      loadAppointments();
    } catch (err) {
      setFormError(err.message);
    }
  }

  // ===== КОД ДЛЯ РЕДАКТИРОВАНИЯ =====
  function handleEdit(appointment) {
    setFormData(appointment);
  }
  // ==================================

  // ===== КОД ДЛЯ УДАЛЕНИЯ =====
  async function handleDelete(id) {
    if (!window.confirm('Вы уверены, что хотите удалить эту запись?')) return;
    try {
      await deleteAppointment(id);
      loadAppointments(); // обновляем список после удаления
    } catch (err) {
      setError(err.message);
    }
  }
  // ==================================

  async function handleToggleCompleted(appointment) {
    try {
      await updateAppointment(appointment.id_appointment, {
        ...appointment,
        is_completed: !appointment.is_completed
      });
      loadAppointments();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div>
      <h2>{formData.id_appointment ? 'Редактировать запись' : 'Добавить новую запись'}</h2>
      {formError && <p style={{ color: 'red' }}>Ошибка: {formError}</p>}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>

        <input
          type="number"
          name="user_id"
          placeholder="User ID"
          value={formData.user_id}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="master_id"
          placeholder="Master ID"
          value={formData.master_id}
          onChange={handleChange}
          required
        />

        <input
          type="datetime-local"
          name="appointment_date"
          placeholder="Время записи"
          value={formData.appointment_date}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="note"
          placeholder="Note"
          value={formData.note}
          onChange={handleChange}
        />

        <label>
          <input
            type="checkbox"
            name="is_completed"
            checked={formData.is_completed}
            onChange={handleChange}
          />
          Заказ завершён
        </label>

        <button type="submit">{formData.id_appointment ? 'Обновить' : 'Добавить'}</button>
      </form>

      <h2>Список записей</h2>
      {appointments.length === 0 ? (
        <p>Записей нет</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Client ID</th>
              <th>Master ID</th>
              <th>Время</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
          {appointments.map(a => (
            <tr key={a.id_appointment}>
              <td>{a.user_id}</td>
              <td>{a.master_id}</td>
              <td>{a.appointment_date}</td>
              <td>
                <button onClick={() => handleToggleCompleted(a)}>
                  {a.is_completed ? 'Завершён' : 'Не завершён'}
                </button>
              </td>
              <td>
                <button onClick={() => handleEdit(a)}>Редактировать</button>
                <button onClick={() => handleDelete(a.id_appointment)} style={{ marginLeft: '10px', color: 'red' }}>Удалить</button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
