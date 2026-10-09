import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import productService from '../services/productService';
import { FiShoppingBag, FiBox, FiList, FiClock } from 'react-icons/fi';

const DashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({ orders: [], products: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersData, productsData] = await Promise.all([
          orderService.getOrders(),
          isAdmin() ? productService.getProducts() : Promise.resolve([])
        ]);
        
        setStats({ 
          orders: ordersData, 
          products: productsData 
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isAdmin]);

  if (loading) return <div>Loading dashboard...</div>;

  const adminStats = {
    totalOrders: stats.orders.length,
    pendingOrders: stats.orders.filter(o => o.status === 'PLACED' || o.status === 'PROCESSING').length,
    totalProducts: stats.products.length
  };

  const recentOrders = stats.orders.slice(0, 5);

  return (
    <div>
      <h2 className="mb-4">Welcome back, {user.username}!</h2>
      
      {isAdmin() ? (
        <div className="row mb-5">
          <div className="col-md-4 mb-3">
            <div className="card bg-primary text-white h-100 hover-effect">
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="card-title">Total Orders</h6>
                  <h2 className="mb-0">{adminStats.totalOrders}</h2>
                </div>
                <FiList size={40} opacity={0.8} />
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card bg-warning text-dark h-100 hover-effect">
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="card-title">Pending Orders</h6>
                  <h2 className="mb-0">{adminStats.pendingOrders}</h2>
                </div>
                <FiClock size={40} opacity={0.8} />
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card bg-success text-white h-100 hover-effect">
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="card-title">Total Products</h6>
                  <h2 className="mb-0">{adminStats.totalProducts}</h2>
                </div>
                <FiBox size={40} opacity={0.8} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="row mb-5">
          <div className="col-md-6 mb-3">
            <Link to="/products" className="text-decoration-none">
              <div className="card bg-primary text-white h-100 hover-effect p-3 text-center">
                <div className="card-body">
                  <FiShoppingBag size={48} className="mb-3" />
                  <h4>Browse Products</h4>
                  <p className="mb-0">Find and shop our latest items</p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-md-6 mb-3">
            <Link to="/orders" className="text-decoration-none">
              <div className="card bg-info text-dark h-100 hover-effect p-3 text-center">
                <div className="card-body">
                  <FiList size={48} className="mb-3" />
                  <h4>My Orders</h4>
                  <p className="mb-0">Track and view your past orders</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}

      <h4>Recent Orders</h4>
      <div className="card shadow-sm">
        <div className="card-body p-0">
          {recentOrders.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Order #</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}>
                      <td>{order.orderNumber}</td>
                      <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td>${order.totalAmount.toFixed(2)}</td>
                      <td>
                        <span className={`badge bg-${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <Link to={`/orders/${order.id}`} className="btn btn-sm btn-outline-primary">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 text-center text-muted">
              No orders found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
