import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiPackage, FiShoppingCart } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(cart.reduce((total, item) => total + item.quantity, 0));
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    // Custom event for same-window cart updates
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <NavLink className="navbar-brand d-flex align-items-center" to="/">
          <FiPackage className="me-2" /> OrderTrack
        </NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {isAuthenticated() && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/">Dashboard</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/products">Products</NavLink>
                </li>
                
                {!isAdmin() && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/orders">My Orders</NavLink>
                  </li>
                )}

                {isAdmin() && (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/admin/products">Manage Products</NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/admin/orders">Manage Orders</NavLink>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
          
          <ul className="navbar-nav">
            {!isAuthenticated() ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">Login</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">Register</NavLink>
                </li>
              </>
            ) : (
              <>
                {!isAdmin() && (
                  <li className="nav-item me-3">
                    <NavLink className="nav-link position-relative" to="/cart">
                      <FiShoppingCart size={20} />
                      {cartCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                          {cartCount}
                        </span>
                      )}
                    </NavLink>
                  </li>
                )}
                <li className="nav-item d-flex align-items-center">
                  <span className="text-light me-3">Welcome, {user.username}</span>
                  <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
