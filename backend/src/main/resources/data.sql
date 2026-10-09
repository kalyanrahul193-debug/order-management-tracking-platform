-- Admin user
INSERT INTO users (username, email, password, role, created_at) 
VALUES ('admin', 'admin@orderplatform.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ROLE_ADMIN', CURRENT_TIMESTAMP);

-- Customer user
INSERT INTO users (username, email, password, role, created_at) 
VALUES ('customer', 'customer@orderplatform.com', '$2a$10$dXJ3SW6G7P50lGmMQgel2u0PC3MKMHqDm5jS23wFmDhPqVsXuaaGO', 'ROLE_CUSTOMER', CURRENT_TIMESTAMP);

-- Sample Products
INSERT INTO products (name, description, category, price, stock_quantity, image_url, active)
VALUES ('Laptop Pro', 'High performance laptop', 'Electronics', 1200.00, 50, 'laptop.jpg', true);

INSERT INTO products (name, description, category, price, stock_quantity, image_url, active)
VALUES ('Smartphone X', 'Latest smartphone', 'Electronics', 899.99, 100, 'smartphone.jpg', true);

INSERT INTO products (name, description, category, price, stock_quantity, image_url, active)
VALUES ('Cotton T-Shirt', 'Comfortable cotton t-shirt', 'Clothing', 19.99, 200, 'tshirt.jpg', true);

INSERT INTO products (name, description, category, price, stock_quantity, image_url, active)
VALUES ('Denim Jeans', 'Classic blue denim jeans', 'Clothing', 49.99, 150, 'jeans.jpg', true);

INSERT INTO products (name, description, category, price, stock_quantity, image_url, active)
VALUES ('Sci-Fi Novel', 'Best-selling sci-fi book', 'Books', 14.99, 75, 'book.jpg', true);

INSERT INTO products (name, description, category, price, stock_quantity, image_url, active)
VALUES ('Cookbook', 'Healthy recipes', 'Books', 24.99, 60, 'cookbook.jpg', true);
