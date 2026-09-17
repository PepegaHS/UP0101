import { useState, useEffect } from 'react';
import { getServices, createService, updateService, deleteService } from '../api/services';
import { getDiscounts } from '../api/discounts';

export default function ServicesList() {
	const [services, setServices] = useState([]);
	const [discounts, setDiscounts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [formData, setFormData] = useState({
		id_service: '',
		title: '',
		description: '',
		duration: '30',
		price: '',
		discount_id: '1'
	});

	const [formError, setFormError] = useState(null);

	async function loadAllData() {
		try {
			setLoading(true);
			const [servicesData, discountsData] = await Promise.all([
				getServices(),
				getDiscounts()
			]);
			setServices(servicesData);
			setDiscounts(discountsData);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		loadAllData();
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
			if (formData.id_service) {
				await updateService(formData.id_service, formData);
			} else {
				await createService(formData);
			}
			setFormData({
				id_service: '',
				title: '',
				description: '',
				duration: '30',
				price: '',
				discount_id: '1'
			});
			setFormError(null);
			loadAllData();
		} catch (err) {
			setFormError(err.message);
		}
	}

	function handleEdit(service) {
		setFormData({
			id_service: service.id_service,
			title: service.title,
			description: service.description || '',
			duration: String(service.duration),
			price: String(service.price),
			discount_id: String(service.discount_id || '1')
		});
	}

	async function handleDelete(id) {
		if (!window.confirm('Вы уверены, что хотите удалить эту услугу?')) return;
		try {
			await deleteService(id);
			loadAllData();
		} catch (err) {
			setError(err.message);
		}
	}

	function getDiscountLabel(discountId) {
		const d = discounts.find(item => String(item.id_discount) === String(discountId));
		return d ? `${d.title} (${d.percentage}%)` : `Скидка #${discountId}`;
	}

	if (loading) return <p>Загрузка услуг...</p>;
	if (error) return <p>Ошибка: {error}</p>;

	return (
		<div>
			<h2>{formData.id_service ? 'Редактировать услугу' : 'Добавить услугу'}</h2>
			{formError && <p style={{ color: 'red' }}>Ошибка: {formError}</p>}
			<form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '500px' }}>

				<input
					type="text"
					name="title"
					placeholder="Название услуги"
					value={formData.title}
					onChange={handleChange}
					required
				/>

				<textarea
					name="description"
					placeholder="Описание услуги"
					value={formData.description}
					onChange={handleChange}
					rows="3"
					required
				/>

				<label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
					<span>Длительность (в минутах):</span>
					<input
						type="number"
						name="duration"
						placeholder="60"
						value={formData.duration}
						onChange={handleChange}
						required
					/>
				</label>

				<label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
					<span>Базовая цена (₽):</span>
					<input
						type="number"
						name="price"
						placeholder="2500"
						value={formData.price}
						onChange={handleChange}
						required
					/>
				</label>

				<label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
					<span>Общая скидка на товар (акция):</span>
					<select name="discount_id" value={formData.discount_id} onChange={handleChange}>
						{discounts.map(d => (
							<option key={d.id_discount} value={d.id_discount}>
								{d.title} ({d.percentage}%)
							</option>
						))}
					</select>
				</label>

				<div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
					<button type="submit">{formData.id_service ? 'Обновить' : 'Добавить'}</button>
					{formData.id_service && (
						<button
							type="button"
							onClick={() => setFormData({
								id_service: '',
								title: '',
								description: '',
								duration: '30',
								price: '',
								discount_id: '1'
							})}
						>
							Отмена
						</button>
					)}
				</div>
			</form>

			<h2>Список услуг</h2>
			{services.length === 0 ? (
				<p>Записей нет</p>
			) : (
				<table>
					<thead>
						<tr>
							<th>Название</th>
							<th>Цена</th>
							<th>Длительность</th>
							<th>Скидка</th>
							<th>Действия</th>
						</tr>
					</thead>
					<tbody>
					{services.map(service => (
						<tr key={service.id_service}>
							<td><strong>{service.title}</strong></td>
							<td>{parseFloat(service.price).toLocaleString()} ₽</td>
							<td>{service.duration} мин.</td>
							<td>{getDiscountLabel(service.discount_id)}</td>
							<td>
								<button onClick={() => handleEdit(service)}>Редактировать</button>
								<button onClick={() => handleDelete(service.id_service)} style={{ marginLeft: '10px', color: 'red' }}>Удалить</button>
							</td>
						</tr>
					))}
					</tbody>
				</table>
			)}
		</div>
	);
}