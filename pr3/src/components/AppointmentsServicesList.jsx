import { useState, useEffect } from 'react';
import { getAppointmentsServices, createAppointmentServices, updateAppointmentServices, deleteAppointmentServices } from '../api/appointments_services';
import { getAppointments } from '../api/appointments';
import { getServices } from '../api/services';

function formatDateTimeForDisplay(value) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(',', '');
}

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
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
      const [appointmentsData, servicesData] = await Promise.all([
        getAppointmentsServices(),
        getServices()
      ]);
      setAppointments(appointmentsData);
      setServices(servicesData);
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

        <select
          name="appointment_id"
          value={formData.appointment_id}
          onChange={handleChange}
          required
        >
          <option value="">Выберите запись</option>
          {appointments.map((appointment) => (
            <option key={appointment.id_appointment} value={appointment.id_appointment}>
              {appointment.client_second_name && appointment.client_first_name
                ? `${appointment.client_second_name} ${appointment.client_first_name}`
                : `Запись #${appointment.id_appointment}`} — {appointment.appointment_date}
            </option>
          ))}
        </select>

        <select
          name="service_id"
          value={formData.service_id}
          onChange={handleChange}
          required
        >
          <option value="">Выберите услугу</option>
          {services.map((service) => (
            <option key={service.id_service} value={service.id_service}>
              {service.title}
            </option>
          ))}
        </select>

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
              <th>Клиент</th>
              <th>Время записи</th>
              <th>Услуга</th>
              <th>Количество</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
          {appointments.map(a => (
            <tr key={`${a.appointment_id}-${a.service_id}`}>
              <td>{a.client_name || `Клиент #${a.user_id || a.appointment_id}`}</td>
              <td>{formatDateTimeForDisplay(a.appointment_date)}</td>
              <td>{a.service_title || `Услуга #${a.service_id}`}</td>
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
