import { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../api/users';
import { getDiscounts } from '../api/discounts';
import { getRoles } from '../api/roles';

export default function UsersList() {
	const [users, setUsers] = useState([]);
	const [discounts, setDiscounts] = useState([]);
	const [roles, setRoles] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [formData, setFormData] = useState({
		id_user: '',
		second_name: '',
		first_name: '',
		middle_name: '',
		role_id: '2',
		email: '',
		password: '',
		discount_id: '1',
	});

	const [formError, setFormError] = useState(null);

	async function loadAllData() {
		try {
			setLoading(true);
			const [usersData, discountsData, rolesData] = await Promise.all([
				getUsers(),
				getDiscounts(),
				getRoles(),
			]);
			setUsers(usersData);
			setDiscounts(discountsData);
			setRoles(rolesData);
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
			if (formData.id_user) {
				await updateUser(formData.id_user, formData);
			} else {
				await createUser(formData);
			}
			setFormData({
				id_user: '',
				second_name: '',
				first_name: '',
				middle_name: '',
				role_id: '2',
				email: '',
				password: '',
				discount_id: '1',
			});
			setFormError(null);
			loadAllData();
		} catch (err) {
			setFormError(err.message);
		}
	}

	function handleEdit(user) {
		setFormData({
			id_user: user.id_user,
			second_name: user.second_name || '',
			first_name: user.first_name || '',
			middle_name: user.middle_name || '',
			role_id: String(user.role_id || '2'),
			email: user.email || '',
			password: user.password || '',
			discount_id: String(user.discount_id || '1'),
		});
	}

	async function handleDelete(id) {
		if (!window.confirm('Вы уверены, что хотите удалить эту запись?')) return;
		try {
			await deleteUser(id);
			loadAllData();
		} catch (err) {
			setError(err.message);
		}
	}

	function getRoleTitle(roleId) {
		const r = roles.find(item => String(item.id_role) === String(roleId));
		return r ? r.title : `Роль #${roleId}`;
	}

	function getDiscountTitle(discountId) {
		const d = discounts.find(item => String(item.id_discount) === String(discountId));
		return d ? `${d.title} (${d.percentage}%)` : `Скидка #${discountId}`;
	}

	if (loading) return <p>Загрузка пользователей...</p>;
	if (error) return <p>Ошибка: {error}</p>;

	return (
		<div>
			<h2>{formData.id_user ? 'Редактировать пользователя' : 'Добавить пользователя'}</h2>
			{formError && <p style={{ color: 'red' }}>Ошибка: {formError}</p>}
			<form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '500px' }}>

				<input
					type="text"
					name="second_name"
					placeholder="Фамилия"
					value={formData.second_name}
					onChange={handleChange}
					required
				/>

				<input
					type="text"
					name="first_name"
					placeholder="Имя"
					value={formData.first_name}
					onChange={handleChange}
					required
				/>

				<input
					type="text"
					name="middle_name"
					placeholder="Отчество"
					value={formData.middle_name}
					onChange={handleChange}
				/>

				<input
					type="email"
					name="email"
					placeholder="Email"
					value={formData.email}
					onChange={handleChange}
					required
				/>

				<input
					type="password"
					name="password"
					placeholder="Пароль"
					value={formData.password}
					onChange={handleChange}
					required
				/>

				<label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
					<span>Роль:</span>
					<select name="role_id" value={formData.role_id} onChange={handleChange} required>
						{roles.map(r => (
							<option key={r.id_role} value={r.id_role}>{r.title}</option>
						))}
					</select>
				</label>

				<label style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
					<span>Персональный скидочный купон:</span>
					<select name="discount_id" value={formData.discount_id} onChange={handleChange}>
						{discounts.map(d => (
							<option key={d.id_discount} value={d.id_discount}>
								{d.title} ({d.percentage}%)
							</option>
						))}
					</select>
				</label>

				<div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
					<button type="submit">{formData.id_user ? 'Обновить пользователя' : 'Добавить пользователя'}</button>
					{formData.id_user && (
						<button
							type="button"
							onClick={() => setFormData({
								id_user: '',
								second_name: '',
								first_name: '',
								middle_name: '',
								role_id: '2',
								email: '',
								password: '',
								discount_id: '1',
							})}
						>
							Отмена
						</button>
					)}
				</div>
			</form>

			<h2>Список пользователей</h2>
			{users.length === 0 ? (
				<p>Записей нет</p>
			) : (
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>ФИО</th>
							<th>Роль</th>
							<th>Email</th>
							<th>Персональная скидка</th>
							<th>Действия</th>
						</tr>
					</thead>
					<tbody>
					{users.map(user => (
						<tr key={user.id_user}>
							<td>{user.id_user}</td>
							<td>{user.second_name} {user.first_name} {user.middle_name}</td>
							<td>{getRoleTitle(user.role_id)}</td>
							<td>{user.email}</td>
							<td>
								<span className="discount-tag">
									{getDiscountTitle(user.discount_id)}
								</span>
							</td>
							<td>
								<button onClick={() => handleEdit(user)}>Редактировать</button>
								<button onClick={() => handleDelete(user.id_user)} style={{ marginLeft: '10px', color: 'red' }}>Удалить</button>
							</td>
						</tr>
					))}
					</tbody>
				</table>
			)}
		</div>
	);
}
