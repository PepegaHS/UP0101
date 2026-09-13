import { useState, useEffect } from 'react';
import { getCartsItems, createCartItems, updateCartItems } from '../api/carts_items';

export default function CartsItemsList() {
  const [cartsItems, setCartsItems] = useState([]);
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
      const data = await getCartsItems();
      setCartsItems(data);
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

        <input
          type="number"
          name="cart_id"
          placeholder="Cart ID"
          value={formData.cart_id}
          onChange={handleChange}
          required
          disabled={formData.isEditing}
        />

        <input
          type="number"
          name="service_id"
          placeholder="Service ID"
          value={formData.service_id}
          onChange={handleChange}
          required
          disabled={formData.isEditing}
        />

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
              <th>Cart ID</th>
              <th>Service ID</th>
              <th>Количество</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
          {cartsItems.map(item => (
            <tr key={`${item.cart_id}-${item.service_id}`}>
              <td>{item.cart_id}</td>
              <td>{item.service_id}</td>
              <td>{item.quantity}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Редактировать</button>
                <button onClick={() => handleDelete(item.cart_id, item.service_id)} style={{ marginLeft: '10px', color: 'red' }}>Удалить</button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
