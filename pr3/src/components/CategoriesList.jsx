import { useState, useEffect } from 'react';
import { getСategories, createCategory, updateCategory, deleteCategory } from '../api/categories';

export default function CategoriesList() {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [formData, setFormData] = useState({
		id_category: '',
		title: ''
	});

	const [formError, setFormError] = useState(null);

	async function loadCategories() {
		try {
			setLoading(true);
			const data = await getСategories();
			setCategories(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		loadCategories();
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
			if (formData.id_category) {
				await updateCategory(formData.id_category, formData);
			} else {
				await createCategory(formData);
			}
			setFormData({
				id_category: '',
				title: ''
			});
			setFormError(null);
			loadCategories();
		} catch (err) {
			setFormError(err.message);
		}
	}

	function handleEdit(category) {
		setFormData(category);
	}

	async function handleDelete(id) {
		if (!window.confirm('Вы уверены, что хотите удалить эту категорию?')) return;
		try {
			await deleteCategory(id);
			loadCategories();
		} catch (err) {
			setError(err.message);
		}
	}

	if (loading) return <p>Загрузка категорий...</p>;
	if (error) return <p>Ошибка: {error}</p>;

	return (
		<div>
			<h2>{formData.id_category ? 'Редактировать категорию' : 'Добавить категорию'}</h2>
			{formError && <p style={{ color: 'red' }}>Ошибка: {formError}</p>}
			<form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '8px', maxWidth: '400px' }}>
				<input
					type="text"
					name="title"
					placeholder="Название категории"
					value={formData.title}
					onChange={handleChange}
					required
					style={{ flex: 1 }}
				/>

				<button type="submit">{formData.id_category ? 'Обновить' : 'Добавить'}</button>
				{formData.id_category && (
					<button type="button" onClick={() => setFormData({ id_category: '', title: '' })}>
						Отмена
					</button>
				)}
			</form>

			<h2>Список категорий</h2>
			{categories.length === 0 ? (
				<p>Записей нет</p>
			) : (
				<table>
					<thead>
						<tr>
							<th>Название</th>
							<th>Действия</th>
						</tr>
					</thead>
					<tbody>
					{categories.map(category => (
						<tr key={category.id_category}>
							<td><strong>{category.title}</strong></td>
							<td>
								<button onClick={() => handleEdit(category)}>Редактировать</button>
								<button onClick={() => handleDelete(category.id_category)} style={{ marginLeft: '10px', color: 'red' }}>Удалить</button>
							</td>
						</tr>
					))}
					</tbody>
				</table>
			)}
		</div>
	);
}
