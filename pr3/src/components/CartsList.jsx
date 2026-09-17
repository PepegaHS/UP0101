import { useState, useEffect } from 'react';
import { getСarts, createCart, updateCart, deleteCart } from '../api/carts';
import { getUsers } from '../api/users';

export default function CartsList() {
	const [carts, setCarts] = useState([]);
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const [formData, setFormData] = useState({
		id_cart: '',
		user_id: ''
	});

	const [formError, setFormError] = useState(null);

	async function loadCarts() {
		try {
			setLoading(true);
			const [cartsData, usersData] = await Promise.all([
				getСarts(),
				getUsers()
			]);
			setCarts(cartsData);
			setUsers(usersData);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		loadCarts();
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
			if (formData.id_cart) {
				await updateCart(formData.id_cart, formData);
			} else {
				await createCart(formData);
			}
			setFormData({
				id_cart: '',
				user_id: ''
			});
			setFormError(null);
			loadCarts();
		} catch (err) {
			setFormError(err.message);
		}
	}

	function handleEdit(cart) {
		setFormData({
			id_cart: cart.id_cart,
			user_id: cart.user_id
		});
	}

	async function handleDelete(id) {
		if (!window.confirm('Вы уверены, что хотите удалить эту корзину?')) return;
		try {
			await deleteCart(id);
			loadCarts();
		} catch (err) {
			setError(err.message);
		}
	}

	if (loading) return <p>Загрузка корзин...</p>;
	if (error) return <p>Ошибка: {error}</p>;

	return (
		<div>
			<h2>{formData.id_cart ? 'Редактировать корзину' : 'Добавить корзину'}</h2>
			{formError && <p style={{ color: 'red' }}>Ошибка: {formError}</p>}
			<form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '8px', maxWidth: '400px' }}>
				<select
					name="user_id"
					value={formData.user_id}
					onChange={handleChange}
					required
					style={{ flex: 1 }}
				>
					<option value="">Выберите пользователя</option>
					{users.map((user) => (
						<option key={user.id_user} value={user.id_user}>
							{user.second_name} {user.first_name} {user.middle_name || ''}
						</option>
					))}
				</select>

				<button type="submit">{formData.id_cart ? 'Обновить' : 'Добавить'}</button>
				{formData.id_cart && (
					<button type="button" onClick={() => setFormData({ id_cart: '', user_id: '' })}>
						Отмена
					</button>
				)}
			</form>

			<h2>Список корзин</h2>
			{carts.length === 0 ? (
				<p>Записей нет</p>
			) : (
				<table>
					<thead>
						<tr>
							<th>Пользователь</th>
							<th>Действия</th>
						</tr>
					</thead>
					<tbody>
					{carts.map(cart => {
						const userFio = cart.user_name || [cart.user_second_name, cart.user_first_name, cart.user_middle_name]
							.filter(Boolean)
							.join(' ');

						return (
							<tr key={cart.id_cart}>
								<td>{userFio || `Пользователь #${cart.user_id}`}</td>
								<td>
									<button onClick={() => handleEdit(cart)}>Редактировать</button>
									<button onClick={() => handleDelete(cart.id_cart)} style={{ marginLeft: '10px', color: 'red' }}>Удалить</button>
								</td>
							</tr>
						);
					})}
					</tbody>
				</table>
			)}
		</div>
	);
}
