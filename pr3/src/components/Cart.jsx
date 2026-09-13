import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { user } = useAuth();
  const { cart, loading, error, updateQuantity, removeFromCart, clearCart, reloadCart } = useCart();
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // User personal discount percentage
  const userDiscountPercentage = user?.discount_percentage || 0;
  const userDiscountTitle = user?.discount_title || 'Персональный купон';

  // Calculate totals
  const summary = cart.reduce(
    (acc, item) => {
      const qty = parseInt(item.quantity, 10) || 1;
      const basePrice = parseFloat(item.price) || 0;
      const servPct = item.discount_percentage ? Number(item.discount_percentage) : 0;
      const userPct = Number(userDiscountPercentage);
      const effectivePct = Math.min(75, servPct + userPct);

      const discountedUnitPrice = effectivePct > 0
        ? Math.round(basePrice * (1 - effectivePct / 100))
        : basePrice;

      const itemBaseTotal = basePrice * qty;
      const itemFinalTotal = discountedUnitPrice * qty;
      const itemSavings = itemBaseTotal - itemFinalTotal;

      acc.totalQuantity += qty;
      acc.baseTotal += itemBaseTotal;
      acc.finalTotal += itemFinalTotal;
      acc.totalSavings += itemSavings;

      return acc;
    },
    { totalQuantity: 0, baseTotal: 0, finalTotal: 0, totalSavings: 0 }
  );

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);
    try {
      // Clear cart items in DB
      await clearCart();
      setCheckoutSuccess(true);
    } catch {
      // Handled in CartContext
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && cart.length === 0) {
    return (
      <div className="cart-page">
        <h1>Корзина</h1>
        <div className="loading-state">
          <p>Загрузка корзины...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Корзина</h1>

      {error && (
        <div className="alert-error">
          <p>Ошибка: {error}</p>
          <button onClick={reloadCart}>Повторить загрузку</button>
        </div>
      )}

      {checkoutSuccess && (
        <div className="alert-success">
          <h3>Заказ успешно оформлен!</h3>
          <p>Спасибо за заказ! Наш администратор свяжется с вами для подтверждения времени записи.</p>
          <Link to="/available-services" className="btn-primary" style={{ display: 'inline-block', marginTop: '10px' }}>
            Вернуться в каталог услуг
          </Link>
        </div>
      )}

      {!checkoutSuccess && cart.length === 0 ? (
        <div className="empty-cart-state">
          <p>Ваша корзина пуста.</p>
          <Link to="/available-services" className="btn-primary">
            Перейти к каталогу услуг
          </Link>
        </div>
      ) : (
        !checkoutSuccess && (
          <div className="cart-layout">
            <div className="cart-items-container">
              <div className="cart-items-header">
                <h2>Выбранные услуги ({summary.totalQuantity})</h2>
                <button
                  type="button"
                  className="btn-link btn-danger-text"
                  onClick={clearCart}
                >
                  Очистить всё
                </button>
              </div>

              <div className="cart-items-list">
                {cart.map((item) => {
                  const qty = parseInt(item.quantity, 10) || 1;
                  const basePrice = parseFloat(item.price) || 0;
                  const servPct = item.discount_percentage ? Number(item.discount_percentage) : 0;
                  const userPct = Number(userDiscountPercentage);
                  const effectivePct = Math.min(75, servPct + userPct);

                  const discountedUnitPrice = effectivePct > 0
                    ? Math.round(basePrice * (1 - effectivePct / 100))
                    : basePrice;

                  const lineTotal = discountedUnitPrice * qty;

                  return (
                    <div className="cart-item-row" key={item.service_id}>
                      <div className="cart-item-info">
                        <h3>{item.title}</h3>
                        {item.duration && (
                          <span className="cart-item-duration">
                            ⏱ {item.duration} мин.
                          </span>
                        )}
                        <div className="cart-item-discount-info">
                          {effectivePct > 0 ? (
                            <>
                              <span className="price-original">
                                {basePrice.toLocaleString()} ₽
                              </span>
                              <span className="price-final">
                                {discountedUnitPrice.toLocaleString()} ₽ / шт.
                              </span>
                              {servPct > 0 && (
                                <span className="discount-badge discount-badge--service">
                                  Акция -{servPct}%
                                </span>
                              )}
                              {userPct > 0 && (
                                <span className="discount-badge discount-badge--user">
                                  Купон -{userPct}%
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="price-final">
                              {basePrice.toLocaleString()} ₽ / шт.
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="cart-item-actions">
                        <div className="quantity-controls">
                          <button
                            type="button"
                            className="btn-qty"
                            onClick={() => updateQuantity(item.service_id, qty - 1)}
                            title="Уменьшить"
                          >
                            -
                          </button>
                          <span className="qty-value">{qty}</span>
                          <button
                            type="button"
                            className="btn-qty"
                            onClick={() => updateQuantity(item.service_id, qty + 1)}
                            title="Увеличить"
                          >
                            +
                          </button>
                        </div>

                        <div className="cart-item-subtotal">
                          <strong>{lineTotal.toLocaleString()} ₽</strong>
                        </div>

                        <button
                          type="button"
                          className="btn-delete"
                          onClick={() => removeFromCart(item.service_id)}
                          title="Удалить услугу из корзины"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ORDER SUMMARY BLOCK */}
            <div className="cart-summary-card">
              <h2>Итог заказа</h2>

              <div className="summary-line">
                <span>Базовая стоимость:</span>
                <span>{summary.baseTotal.toLocaleString()} ₽</span>
              </div>

              {userDiscountPercentage > 0 && (
                <div className="summary-line summary-line--discount">
                  <span>{userDiscountTitle} (-{userDiscountPercentage}%):</span>
                  <span>Применен</span>
                </div>
              )}

              {summary.totalSavings > 0 && (
                <div className="summary-line summary-line--savings">
                  <span>Экономия по скидкам:</span>
                  <span>-{summary.totalSavings.toLocaleString()} ₽</span>
                </div>
              )}

              <hr />

              <div className="summary-total">
                <span>Итого к оплате:</span>
                <strong>{summary.finalTotal.toLocaleString()} ₽</strong>
              </div>

              <button
                type="button"
                className="btn-checkout"
                onClick={handleCheckout}
                disabled={submitting || cart.length === 0}
              >
                {submitting ? 'Оформление...' : 'Оформить заказ'}
              </button>

              <Link to="/available-services" className="btn-link" style={{ textAlign: 'center', display: 'block', marginTop: '12px' }}>
                ← Продолжить выбор услуг
              </Link>
            </div>
          </div>
        )
      )}
    </div>
  );
}