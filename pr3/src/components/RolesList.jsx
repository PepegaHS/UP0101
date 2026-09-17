import { useState, useEffect } from 'react';
import { getRoles, createRole, updateRole, deleteRole } from '../api/roles';

export default function RolesList() {
	const [roles, setRoles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [formData, setFormData] = useState({
		id_role: '',
		title: ''
	});

	const [formError, setFormError] = useState(null);

	async function loadRoles() {
		try {
			setLoading(true);
			const data = await getRoles();
			setRoles(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		loadRoles();
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
			if (formData.id_role) {
				await updateRole(formData.id_role, formData);
			} else {
				await createRole(formData);
			}
			setFormData({
				id_role: '',
				title: ''
			});
			setFormError(null);
			loadRoles();
		} catch (err) {
			setFormError(err.message);
		}
	}

	function handleEdit(role) {
		setFormData(role);
	}

	async function handleDelete(id) {
		if (!window.confirm('Вы уверены, что хотите удалить эту роль?')) return;
		try {
			await deleteRole(id);
			loadRoles();
		} catch (err) {
			setError(err.message);
		}
	}

	if (loading) return <p>Загрузка ролей...</p>;
	if (error) return <p>Ошибка: {error}</p>;

	return (
		<div>
			<h2>{formData.id_role ? 'Редактировать роль' : 'Добавить роль'}</h2>
			{formError && <p style={{ color: 'red' }}>Ошибка: {formError}</p>}
			<form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '8px', maxWidth: '400px' }}>
				<input
					type="text"
					name="title"
					placeholder="Название роли"
					value={formData.title}
					onChange={handleChange}
					required
					style={{ flex: 1 }}
				/>

				<button type="submit">{formData.id_role ? 'Обновить' : 'Добавить'}</button>
				{formData.id_role && (
					<button type="button" onClick={() => setFormData({ id_role: '', title: '' })}>
						Отмена
					</button>
				)}
			</form>

			<h2>Список ролей</h2>
			{roles.length === 0 ? (
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
					{roles.map(role => (
						<tr key={role.id_role}>
							<td>{role.title}</td>
							<td>
								<button onClick={() => handleEdit(role)}>Редактировать</button>
								<button onClick={() => handleDelete(role.id_role)} style={{ marginLeft: '10px', color: 'red' }}>Удалить</button>
							</td>
						</tr>
					))}
					</tbody>
				</table>
			)}
		</div>
	);
}
