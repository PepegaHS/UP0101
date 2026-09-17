import { useState, useEffect } from 'react';
import { getCartsItems, createCartItems, updateCartItems } from '../api/carts_items';
import { getCarts } from '../api/carts';
import { getServices } from '../api/services';

export default function CartsItemsList() {
  const [cartsItems, setCartsItems] = useState([]);
  const [carts, setCarts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    cart_id: '',
    service_id: '',
    quantity: '1',
    isEditing: false,
  });

  const [formError, setFormError] = useState(null);

  async function loadCartsItems() {
    try {
      setLoading(true);
      const [itemsData, cartsData, servicesData] = await Promise.all([
        getCartsItems(),
        getCarts(),
        getServices()
      ]);
      setCartsItems(itemsData);
      setCarts(cartsData);
      setServices(servicesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCartsItems();
  }, []);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (formData.isEditing) {
        await updateCartItems(formData.cart_id, formData);
      } else {
        await createCartItems(formData);
      }
      setFormData({
        cart_id: '',
        service_id: '',
        quantity: '1',
        isEditing: false,
      });
      setFormError(null);
      loadCartsItems();
    } catch (err) {
      setFormError(err.message);
    }
  }

  function handleEdit(item) {
    setFormData({
      cart_id: item.cart_id,
      service_id: item.service_id,
      quantity: String(item.quantity),
      isEditing: true,
    });
  }

  async function handleDelete(cartId, serviceId) {
    if (!window.confirm('Вы уверены, что хотите удалить этот элемент корзины?')) return;
    try {
      // Direct delete via cartId/serviceId
      const res = await fetch(`http://localhost:3001/api/carts_items/${cartId}/${serviceId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Ошибка удаления');
      loadCartsItems();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Загрузка элементов корзин...</p>;
  if (error) return <p>Ошибка: {error}</p>;

  return (
    <div>
      <h2>{formData.isEditing ? 'Редактировать количество' : 'Добавить элемент корзины'}</h2>
      {formError && <p style={{ color: 'red' }}>Ошибка: {formError}</p>}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap', maxWidth: '500px' }}>

        <select
          name="cart_id"
          value={formData.cart_id}
          onChange={handleChange}
          required
          disabled={formData.isEditing}
        >
          <option value="">Выберите корзину</option>
          {carts.map((cart) => (
            <option key={cart.id_cart} value={cart.id_cart}>
              {cart.user_name || `Пользователь #${cart.user_id}`}
            </option>
          ))}
        </select>

        <select
          name="service_id"
          value={formData.service_id}
          onChange={handleChange}
          required
          disabled={formData.isEditing}
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
          placeholder="Количество"
          value={formData.quantity}
          onChange={handleChange}
          required
        />

        <button type="submit">{formData.isEditing ? 'Обновить' : 'Добавить'}</button>
        {formData.isEditing && (
          <button
            type="button"
            onClick={() => setFormData({ cart_id: '', service_id: '', quantity: '1', isEditing: false })}
          >
            Отмена
          </button>
        )}
      </form>

      <h2>Список элементов корзин</h2>
      {cartsItems.length === 0 ? (
        <p>Записей нет</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Пользователь</th>
              <th>Услуга</th>
              <th>Количество</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
          {cartsItems.map(item => {
            const userFio = item.user_name || [item.user_second_name, item.user_first_name, item.user_middle_name]
              .filter(Boolean)
              .join(' ');

            const serviceLabel = item.service_title || item.title || `Услуга #${item.service_id}`;

            return (
              <tr key={`${item.cart_id}-${item.service_id}`}>
                <td>{userFio || `Пользователь #${item.cart_id}`}</td>
                <td>{serviceLabel}</td>
                <td>{item.quantity}</td>
                <td>
                  <button onClick={() => handleEdit(item)}>Редактировать</button>
                  <button onClick={() => handleDelete(item.cart_id, item.service_id)} style={{ marginLeft: '10px', color: 'red' }}>Удалить</button>
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
