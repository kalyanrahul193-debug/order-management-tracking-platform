import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import productService from '../services/productService';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const { isAdmin } = useAuth();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      
      const data = await productService.getProducts(params);
      setProducts(data);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category]);

  const addToCart = (product) => {
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = currentCart.find(item => item.productId === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentCart.push({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(currentCart));
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success(`${product.name} added to cart`);
  };

  // Extract unique categories
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Products</h2>
        <div className="d-flex gap-2">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select 
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {products.length === 0 ? (
            <div className="col-12 text-center text-muted my-5">
              No products found matching your criteria.
            </div>
          ) : (
            products.map(product => (
              <div key={product.id} className="col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100 hover-effect shadow-sm">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} className="card-img-top" alt={product.name} style={{ height: '200px', objectFit: 'cover' }} />
                  ) : (
                    <div className="bg-secondary text-white d-flex align-items-center justify-content-center" style={{ height: '200px', fontSize: '3rem' }}>
                      {product.name.charAt(0)}
                    </div>
                  )}
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title mb-0">{product.name}</h5>
                      <span className="badge bg-light text-dark border">{product.category}</span>
                    </div>
                    <p className="card-text text-muted small flex-grow-1">{product.description}</p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <h5 className="mb-0 text-primary">${product.price.toFixed(2)}</h5>
                      <small className={product.stockQuantity > 0 ? "text-success" : "text-danger"}>
                        {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                      </small>
                    </div>
                  </div>
                  {!isAdmin() && (
                    <div className="card-footer bg-white border-top-0 p-3 pt-0">
                      <button 
                        className="btn btn-primary w-100" 
                        onClick={() => addToCart(product)}
                        disabled={product.stockQuantity === 0}
                      >
                        Add to Cart
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
