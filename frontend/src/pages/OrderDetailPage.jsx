import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import { FiArrowLeft } from 'react-icons/fi';

const OrderDetailPage = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [paymentStatusUpdate, setPaymentStatusUpdate] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrder = async () => {
    try {
      const data = await orderService.getOrderById(id);
      setOrder(data);
      setStatusUpdate(data.status);
      if (data.payment) setPaymentStatusUpdate(data.payment.paymentStatus);
    } catch (err) {
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      await orderService.updateOrderStatus(id, statusUpdate);
      toast.success('Order status updated');
      fetchOrder();
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePaymentStatusUpdate = async () => {
    if (!order.payment) return;
    setIsUpdating(true);
    try {
      await orderService.updatePaymentStatus(order.payment.id, paymentStatusUpdate);
      toast.success('Payment status updated');
      fetchOrder();
    } catch (err) {
      toast.error('Failed to update payment status');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-center my-5"><div className="spinner-border text-primary" /></div>;
  }

  if (!order) {
    return <div className="alert alert-danger">Order not found</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <Link to={isAdmin() ? "/admin/orders" : "/orders"} className="text-decoration-none text-secondary d-flex align-items-center">
          <FiArrowLeft className="me-2" /> Back to Orders
        </Link>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Order #{order.orderNumber}</h2>
        <span className={`badge fs-5 bg-${order.status.toLowerCase()}`}>
          {order.status.replace('_', ' ')}
        </span>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white"><h5 className="mb-0">Order Items</h5></div>
            <div className="card-body p-0">
              <table className="table mb-0">
                <thead className="table-light">
                  <tr>
                    <th className="px-3">Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map(item => (
                    <tr key={item.id}>
                      <td className="px-3">{item.productName}</td>
                      <td>${item.unitPrice.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>${item.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="3" className="text-end fw-bold">Total Amount:</td>
                    <td className="fw-bold fs-5">${order.totalAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white"><h5 className="mb-0">Tracking History</h5></div>
            <div className="card-body">
              {order.trackingHistory && order.trackingHistory.length > 0 ? (
                <div className="tracking-timeline mt-2">
                  {order.trackingHistory.slice().reverse().map(track => (
                    <div key={track.id} className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <div className="timeline-date">{new Date(track.timestamp).toLocaleString()}</div>
                        <h6 className="mb-1">{track.status.replace('_', ' ')}</h6>
                        {track.location && <div><strong>Location:</strong> {track.location}</div>}
                        {track.description && <div className="text-muted small">{track.description}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No tracking information available.</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white"><h5 className="mb-0">Customer & Shipping</h5></div>
            <div className="card-body">
              {isAdmin() && (
                <div className="mb-3">
                  <strong>Customer Name:</strong><br/>{order.customerName}
                </div>
              )}
              <div className="mb-3">
                <strong>Order Date:</strong><br/>{new Date(order.orderDate).toLocaleString()}
              </div>
              <div>
                <strong>Shipping Address:</strong><br/>
                <span style={{ whiteSpace: 'pre-line' }}>{order.shippingAddress}</span>
              </div>
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-header bg-white"><h5 className="mb-0">Payment Details</h5></div>
            <div className="card-body">
              {order.payment ? (
                <>
                  <div className="mb-2"><strong>Method:</strong> {order.payment.paymentMethod.replace('_', ' ')}</div>
                  <div className="mb-2"><strong>Status:</strong> <span className={`badge bg-${order.payment.paymentStatus === 'COMPLETED' ? 'success' : order.payment.paymentStatus === 'FAILED' ? 'danger' : 'warning'}`}>{order.payment.paymentStatus}</span></div>
                  {order.payment.transactionId && <div className="mb-2"><strong>Transaction ID:</strong> {order.payment.transactionId}</div>}
                </>
              ) : (
                <p className="text-muted">No payment info available.</p>
              )}
            </div>
          </div>

          {isAdmin() && (
            <div className="card shadow-sm border-primary mb-4">
              <div className="card-header bg-primary text-white"><h5 className="mb-0">Admin Actions</h5></div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Update Order Status</label>
                  <div className="input-group">
                    <select className="form-select" value={statusUpdate} onChange={e => setStatusUpdate(e.target.value)}>
                      <option value="PLACED">Placed</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="IN_TRANSIT">In Transit</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                    <button className="btn btn-outline-primary" onClick={handleStatusUpdate} disabled={isUpdating || statusUpdate === order.status}>Update</button>
                  </div>
                </div>

                {order.payment && (
                  <div>
                    <label className="form-label">Update Payment Status</label>
                    <div className="input-group">
                      <select className="form-select" value={paymentStatusUpdate} onChange={e => setPaymentStatusUpdate(e.target.value)}>
                        <option value="PENDING">Pending</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="FAILED">Failed</option>
                        <option value="REFUNDED">Refunded</option>
                      </select>
                      <button className="btn btn-outline-primary" onClick={handlePaymentStatusUpdate} disabled={isUpdating || paymentStatusUpdate === order.payment.paymentStatus}>Update</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
