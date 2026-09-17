import { useState, useEffect } from 'react';
import { getPayments, createPayment, updatePayment, deletePayment } from '../api/payments';
import { getAppointments } from '../api/appointments';

export default function PaymentsList() {
	const [payments, setPayments] = useState([]);
	const [appointments, setAppointments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [formData, setFormData] = useState({
		id_payment: '',
		appointment_id: '',
		payment_date: '',
		total: ''
	});

	const [formError, setFormError] = useState(null);

	async function loadPayments() {
		try {
			setLoading(true);
			const [paymentsData, appointmentsData] = await Promise.all([
				getPayments(),
				getAppointments()
			]);
			setPayments(paymentsData);
			setAppointments(appointmentsData);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		loadPayments();
	}, []);

	function handleChange(e) {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	}

	async function handleSubmit(e) {
		e.preventDefault();
		try {
			if (formData.id_payment) {
				await updatePayment(formData.id_payment, formData);
			} else {
				await createPayment(formData);
			}
			setFormData({
				id_payment: '',
				appointment_id: '',
				payment_date: '',
				total: ''
			});
			setFormError(null);
			loadPayments();
		} catch (err) {
			setFormError(err.message);
		}
	}

	function handleEdit(payment) {
		setFormData({
			id_payment: payment.id_payment,
			appointment_id: payment.appointment_id || '',
			payment_date: payment.payment_date ? payment.payment_date.slice(0, 10) : '',
			total: payment.total || ''
		});
	}

	async function handleDelete(id) {
		if (!window.confirm('Вы уверены, что хотите удалить эту запись?')) return;
		try {
			await deletePayment(id);
			loadPayments();
		} catch (err) {
			setError(err.message);
		}
	}

	if (loading) return <p>Загрузка платежей...</p>;
	if (error) return <p>Ошибка: {error}</p>;

	return (
		<div>
			<h2>{formData.id_payment ? 'Редактировать платеж' : 'Добавить платеж'}</h2>
			{formError && <p style={{ color: 'red' }}>Ошибка: {formError}</p>}
			<form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '400px' }}>

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

				<input
					type="date"
					name="payment_date"
					value={formData.payment_date}
					onChange={handleChange}
					required
				/>

				<input
					type="number"
					name="total"
					placeholder="Сумма"
					value={formData.total}
					onChange={handleChange}
					required
				/>

				<div style={{ display: 'flex', gap: '8px' }}>
					<button type="submit">{formData.id_payment ? 'Обновить' : 'Добавить'}</button>
					{formData.id_payment && (
						<button
							type="button"
							onClick={() => setFormData({ id_payment: '', appointment_id: '', payment_date: '', total: '' })}
						>
							Отмена
						</button>
					)}
				</div>
			</form>

			<h2>Список платежей</h2>
			{payments.length === 0 ? (
				<p>Записей нет</p>
			) : (
				<table>
					<thead>
						<tr>
							<th>Клиент</th>
							<th>Дата платежа</th>
							<th>Сумма</th>
							<th>Действия</th>
						</tr>
					</thead>
					<tbody>
					{payments.map(payment => (
						<tr key={payment.id_payment}>
							<td>{payment.client_name || `Клиент #${payment.appointment_id}`}</td>
							<td>{payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : '-'}</td>
							<td>{parseFloat(payment.total).toLocaleString()} ₽</td>
							<td>
								<button onClick={() => handleEdit(payment)}>Редактировать</button>
								<button onClick={() => handleDelete(payment.id_payment)} style={{ marginLeft: '10px', color: 'red' }}>Удалить</button>
							</td>
						</tr>
					))}
					</tbody>
				</table>
			)}
		</div>
	);
}
