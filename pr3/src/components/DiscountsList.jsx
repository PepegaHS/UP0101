import { useState, useEffect } from 'react';
import { getDiscounts, createDiscount, updateDiscount, deleteDiscount } from '../api/discounts';


export default function DiscountsList() {
	const [discounts, setDiscounts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [formData, setFormData] = useState({
		id_discount: '',
		title: '',
		percentage: ''
	});

	const [formError, setFormError] = useState(null);

	// Загрузка списка
	async function loadDiscounts() {
		try {
			setLoading(true);
			const data = await getDiscounts();
			setDiscounts(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		loadDiscounts();
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
			if (formData.id_discount) {
				await updateDiscount(formData.id_discount, formData);
			} else {
				await createDiscount(formData);
			}
			setFormData({
				id_discount: '',
				title: '',
				percentage: ''
			});
			setFormError(null);
			loadDiscounts();
		} catch (err) {
			setFormError(err.message);
		}
	}

	// ===== КОД ДЛЯ РЕДАКТИРОВАНИЯ =====
	function handleEdit(discount) {
		setFormData(discount);
	}
	// ==================================

	// ===== КОД ДЛЯ УДАЛЕНИЯ =====
	async function handleDelete(id) {
		if (!window.confirm('Вы уверены, что хотите удалить эту запись?')) return;
		try {
			await deleteDiscount(id);
			loadDiscounts(); // обновляем список после удаления
		} catch (err) {
			setError(err.message);
		}
	}
	// ==================================

	if (loading) return <p>Загрузка...</p>;
	if (error) return <p>Ошибка: {error}</p>;

	return (
		<div>
			<h2>{formData.id_discount ? 'Редактировать скидку' : 'Добавить скидку'}</h2>
			{formError && <p style={{ color: 'red' }}>Ошибка: {formError}</p>}
			<form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>

				<input
					type="text"
					name="title"
					placeholder="Название"
					value={formData.title}
					onChange={handleChange}
					required
				/>

				<input
					type="number"
					name="percentage"
					placeholder="Процент скидки"
					value={formData.percentage}
					onChange={handleChange}
					required
				/>

				<button type="submit">{formData.id_discount ? 'Обновить' : 'Добавить'}</button>
			</form>

			<h2>Список скидок</h2>
			{discounts.length === 0 ? (
				<p>Записей нет</p>
			) : (
				<table>
					<thead>
						<tr>
							<th>Название</th>
							<th>Процент скидки</th>
							<th>Действия</th>
						</tr>
					</thead>
					<tbody>
					{discounts.map(discount => (
						<tr key={discount.id_discount}>
							<td>{discount.title}</td>
							<td>{discount.percentage}</td>
							<td>
								<button onClick={() => handleEdit(discount)}>Редактировать</button>
								<button onClick={() => handleDelete(discount.id_discount)} style={{ marginLeft: '10px', color: 'red' }}>Удалить</button>
							</td>
						</tr>
					))}
					</tbody>
				</table>
			)}
		</div>
	);
}