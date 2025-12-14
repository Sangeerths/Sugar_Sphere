import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartService } from '../services/cartService';
import './CartPage.css';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartService.getCart();
      if (response && response.success && response.data) {
        // Ensure items array exists
        const cartData = {
          ...response.data,
          items: response.data.items || []
        };
        setCart(cartData);
      } else {
        // If response is not successful, set empty cart
        setCart({ items: [], totalAmount: 0, itemCount: 0 });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart({ items: [], totalAmount: 0, itemCount: 0 });
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await cartService.updateCartItem(productId, quantity);
      if (response && response.success && response.data) {
        setCart(response.data);
      }
      fetchCart(); // Refresh cart to ensure consistency
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity. Please try again.');
    }
  };

  const removeItem = async (productId) => {
    try {
      const response = await cartService.removeFromCart(productId);
      if (response && response.success && response.data) {
        setCart(response.data);
      }
      fetchCart(); // Refresh cart to ensure consistency
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item. Please try again.');
    }
  };

  const clearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        const response = await cartService.clearCart();
        if (response && response.success && response.data) {
          setCart(response.data);
        }
        fetchCart(); // Refresh cart to ensure consistency
      } catch (error) {
        console.error('Error clearing cart:', error);
        alert('Failed to clear cart. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Add some delicious treats to get started!</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <button onClick={clearCart} className="btn-clear">
            Clear Cart
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cart.items.map((item) => (
              <div key={item.productId} className="cart-item">
                <img 
                  src={item.productImage || '/placeholder.jpg'} 
                  alt={item.productName} 
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.productName}</h3>
                  <p className="cart-item-price">₹{item.price}</p>
                </div>
                <div className="cart-item-quantity">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="qty-btn"
                  >
                    -
                  </button>
                  <span className="qty-display">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>
                <div className="cart-item-subtotal">
                  <p>₹{item.subtotal}</p>
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="btn-remove"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal ({cart.itemCount} items)</span>
              <span>₹{cart.totalAmount}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row">
              <span>Tax (18% GST)</span>
              <span>₹{(cart.totalAmount * 0.18).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{(cart.totalAmount * 1.18).toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="btn-checkout"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-continue"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;