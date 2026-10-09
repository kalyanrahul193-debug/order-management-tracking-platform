import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import orderService from '../services/orderService';
import { FiTrash2 } from 'react-icons/fi';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(items);
  }, []);

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map(item => 
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error('Cart is empty!');
      return;
    }
    if (!shippingAddress.trim()) {
      toast.error('Shipping address is required');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map(item => ({ productId: item.productId, quantity: item.quantity })),
        shippingAddress,
        paymentMethod
      };
      
      const order = await orderService.placeOrder(orderData);
      
      // Clear cart
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));
      
      toast.success('Order placed successfully!');
      navigate(`/orders/${order.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center my-5 py-5">
        <h3 className="mb-4">Your cart is empty</h3>
        <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-lg-8 mb-4">
        <div className="card shadow-sm">
          <div className="card-header bg-white">
            <h4 className="mb-0">Shopping Cart</h4>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-3">Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.productId}>
                      <td className="px-3">{item.productName}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>
                        <div className="d-flex align-items-center" style={{ width: '100px' }}>
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
                          <input type="number" className="form-control form-control-sm text-center mx-1" value={item.quantity} readOnly />
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                        </div>
                      </td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                      <td>
                        <button className="btn btn-sm btn-danger text-white" onClick={() => removeItem(item.productId)}>
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-lg-4">
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-white">
            <h5 className="mb-0">Order Summary</h5>
          </div>
          <div className="card-body">
            <div className="d-flex justify-content-between mb-3">
              <span>Subtotal:</span>
              <strong>${calculateTotal().toFixed(2)}</strong>
            </div>
            
            <hr />
            
            <div className="mb-3">
              <label className="form-label">Shipping Address</label>
              <textarea 
                className="form-control" 
                rows="3" 
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
              ></textarea>
            </div>
            
            <div className="mb-4">
              <label className="form-label">Payment Method</label>
              <select 
                className="form-select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="DEBIT_CARD">Debit Card</option>
                <option value="UPI">UPI</option>
                <option value="NET_BANKING">Net Banking</option>
                <option value="COD">Cash on Delivery</option>
              </select>
            </div>
            
            <button 
              className="btn btn-success w-100 py-2" 
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? 'Processing...' : `Place Order ($${calculateTotal().toFixed(2)})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
