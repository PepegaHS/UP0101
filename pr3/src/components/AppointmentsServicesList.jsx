import { useState, useEffect } from 'react';
import { getAppointmentsServices, createAppointmentServices, updateAppointmentServices, deleteAppointmentServices } from '../api/appointments_services';


export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    appointment_id: '',
    service_id: '',
    quantity: '',
  });

  const [formError, setFormError] = useState(null);

  // Загрузка списка
  async function loadAppointments() {
    try {
      setLoading(true);
      const data = await getAppointmentsServices();
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
      if (formData.appointment_id) {
        await updateAppointmentServices(formData.appointment_id, formData);
      } else {
        await createAppointmentServices(formData);
      }
      setFormData({
        appointment_id: '',
        service_id: '',
        quantity: '',
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
      await deleteAppointmentServices(id);
      loadAppointments(); // обновляем список после удаления
    } catch (err) {
      setError(err.message);
    }
  }
  // ==================================


  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div>
      <h2>{formData.appointment_id ? 'Редактировать запись' : 'Добавить новую запись'}</h2>
      {formError && <p style={{ color: 'red' }}>Ошибка: {formError}</p>}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>

        <input
          type="number"
          name="appointment_id"
          placeholder="Appointment ID"
          value={formData.appointment_id}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="service_id"
          placeholder="Service ID"
          value={formData.service_id}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
        />

        <button type="submit">{formData.appointment_id ? 'Обновить' : 'Добавить'}</button>
      </form>

      <h2>Список записей</h2>
      {appointments.length === 0 ? (
        <p>Записей нет</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>Service ID</th>
              <th>Quantity</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
          {appointments.map(a => (
            <tr key={a.appointment_id}>
              <td>{a.appointment_id}</td>
              <td>{a.service_id}</td>
              <td>{a.quantity}</td>
              <td>
                <button onClick={() => handleEdit(a)}>Редактировать</button>
                <button onClick={() => handleDelete(a.appointment_id)} style={{ marginLeft: '10px', color: 'red' }}>Удалить</button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
