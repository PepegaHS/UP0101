import { useState, useEffect } from 'react';
import { getServicesCategories, createServiceCategory, updateServiceCategory, deleteServiceCategory } from '../api/services_categories';
import { getServices } from '../api/services';
import { getСategories } from '../api/categories';


export default function ServicesCategoriesList() {
	const [links, setLinks] = useState([]);
	const [services, setServices] = useState([]);
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [formData, setFormData] = useState({
		service_id: '',
		category_id: ''
	});

	const [formError, setFormError] = useState(null);

	// Загрузка списка
	async function loadLinks() {
		try {
			setLoading(true);
			const [linksData, servicesData, categoriesData] = await Promise.all([
				getServicesCategories(),
				getServices(),
				getСategories()
			]);
			setLinks(linksData);
			setServices(servicesData);
			setCategories(categoriesData);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		loadLinks();
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
			if (formData.original_service_id && formData.original_category_id) {
				await updateServiceCategory(formData.original_service_id, formData.original_category_id, formData);
			} else {
				await createServiceCategory(formData);
			}
			setFormData({
				service_id: '',
				category_id: '',
				original_service_id: '',
				original_category_id: ''
			});
			setFormError(null);
			loadLinks();
		} catch (err) {
			setFormError(err.message);
		}
	}

	// ===== КОД ДЛЯ РЕДАКТИРОВАНИЯ =====
	function handleEdit(link) {
		setFormData({
			...link,
			original_service_id: link.service_id,
			original_category_id: link.category_id
		});
	}
	// ==================================

	// ===== КОД ДЛЯ УДАЛЕНИЯ =====
	async function handleDelete(serviceId, categoryId) {
		if (!window.confirm('Вы уверены, что хотите удалить эту запись?')) return;
		try {
			await deleteServiceCategory(serviceId, categoryId);
			loadLinks(); // обновляем список после удаления
		} catch (err) {
			setError(err.message);
		}
	}
	// ==================================

	if (loading) return <p>Загрузка...</p>;
	if (error) return <p>Ошибка: {error}</p>;

	return (
		<div>
			<h2>{formData.original_service_id ? 'Редактировать связь' : 'Добавить связь'}</h2>
			{formError && <p style={{ color: 'red' }}>Ошибка: {formError}</p>}
			<form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>

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

				<select
					name="category_id"
					value={formData.category_id}
					onChange={handleChange}
					required
				>
					<option value="">Выберите категорию</option>
					{categories.map((category) => (
						<option key={category.id_category} value={category.id_category}>
							{category.title}
						</option>
					))}
				</select>

				<button type="submit">{formData.original_service_id ? 'Обновить' : 'Добавить'}</button>
			</form>

			<h2>Список связей</h2>
			{links.length === 0 ? (
				<p>Записей нет</p>
			) : (
				<table>
					<thead>
						<tr>
							<th>Услуга</th>
							<th>Категория</th>
							<th>Действия</th>
						</tr>
					</thead>
					<tbody>
					{links.map(link => (
						<tr key={`${link.service_id}-${link.category_id}`}>
							<td>{link.service_title || `Услуга #${link.service_id}`}</td>
							<td>{link.category_title || `Категория #${link.category_id}`}</td>
							<td>
								<button onClick={() => handleEdit(link)}>Редактировать</button>
								<button onClick={() => handleDelete(link.service_id, link.category_id)} style={{ marginLeft: '10px', color: 'red' }}>Удалить</button>
							</td>
						</tr>
					))}
					</tbody>
				</table>
			)}
		</div>
	);
}
