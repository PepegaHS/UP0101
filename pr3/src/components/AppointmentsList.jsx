import { useState, useEffect } from 'react';
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from '../api/appointments';
import { getUsers } from '../api/users';
import { getRoles } from '../api/roles';


function formatDateTimeForInput(value) {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const pad = (num) => String(num).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

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
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
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
      const [appointmentsData, usersData, rolesData] = await Promise.all([
        getAppointments(),
        getUsers(),
        getRoles()
      ]);
      setAppointments(appointmentsData);
      setUsers(usersData);
      setRoles(rolesData);
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
    setFormData({
      ...appointment,
      appointment_date: formatDateTimeForInput(appointment.appointment_date)
    });
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

  const masterRoleId = roles.find((role) => /мастер/i.test(role.title))?.id_role;
  const masterUsers = users.filter((user) => String(user.role_id) === String(masterRoleId));

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div>
      <h2>{formData.id_appointment ? 'Редактировать запись' : 'Добавить новую запись'}</h2>
      {formError && <p style={{ color: 'red' }}>Ошибка: {formError}</p>}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>

        <select
          name="user_id"
          value={formData.user_id}
          onChange={handleChange}
          required
        >
          <option value="">Выберите клиента</option>
          {users.map((user) => (
            <option key={user.id_user} value={user.id_user}>
              {user.second_name} {user.first_name} {user.middle_name || ''}
            </option>
          ))}
        </select>

        <select
          name="master_id"
          value={formData.master_id}
          onChange={handleChange}
          required
        >
          <option value="">Выберите мастера</option>
          {masterUsers.length === 0 ? (
            <option value="" disabled>Нет пользователей с ролью "Мастер"</option>
          ) : (
            masterUsers.map((user) => (
              <option key={user.id_user} value={user.id_user}>
                {user.second_name} {user.first_name} {user.middle_name || ''}
              </option>
            ))
          )}
        </select>

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
              <th>Клиент</th>
              <th>Мастер</th>
              <th>Время</th>
              <th>Статус</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
          {appointments.map(a => (
            <tr key={a.id_appointment}>
              <td>{a.client_second_name && a.client_first_name ? `${a.client_second_name} ${a.client_first_name}${a.client_middle_name ? ` ${a.client_middle_name}` : ''}` : `Клиент #${a.user_id}`}</td>
              <td>{a.master_second_name && a.master_first_name ? `${a.master_second_name} ${a.master_first_name}${a.master_middle_name ? ` ${a.master_middle_name}` : ''}` : `Мастер #${a.master_id}`}</td>
              <td>{formatDateTimeForDisplay(a.appointment_date)}</td>
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
