-- ============================================================================
-- Seed Data for Oracle Database
-- ============================================================================

-- Users (BCrypt hashes for 'admin123' and 'customer123')
INSERT INTO users (username, email, password, role, created_at)
VALUES ('admin', 'admin@orderplatform.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ROLE_ADMIN', CURRENT_TIMESTAMP);

INSERT INTO users (username, email, password, role, created_at)
VALUES ('customer', 'customer@orderplatform.com', '$2a$10$dXJ3SW6G7P50lGmMQgel2u0PC3MKMHqDm5jS23wFmDhPqVsXuaaGO', 'ROLE_CUSTOMER', CURRENT_TIMESTAMP);

-- Products
INSERT INTO products (name, description, category, price, stock_quantity, image_url, active)
VALUES ('Enterprise Workstation', 'High-speed quad-core workstation for engineering tasks', 'Electronics', 1499.99, 45, 'workstation.jpg', 1);

INSERT INTO products (name, description, category, price, stock_quantity, image_url, active)
VALUES ('Ultra-Wide 4K Monitor', '34-inch curved productivity display', 'Electronics', 599.99, 80, 'monitor.jpg', 1);

INSERT INTO products (name, description, category, price, stock_quantity, image_url, active)
VALUES ('Mechanical Keyboard', 'Custom mechanical gaming & typing keyboard', 'Electronics', 129.50, 120, 'keyboard.jpg', 1);

INSERT INTO products (name, description, category, price, stock_quantity, image_url, active)
VALUES ('Executive Laptop Bag', 'Water-resistant leather messenger bag', 'Accessories', 79.99, 150, 'bag.jpg', 1);

INSERT INTO products (name, description, category, price, stock_quantity, image_url, active)
VALUES ('Noise-Cancelling Headphones', 'Wireless over-ear headset with ANC', 'Electronics', 249.99, 60, 'headphones.jpg', 1);

INSERT INTO products (name, description, category, price, stock_quantity, image_url, active)
VALUES ('Ergonomic Mesh Chair', 'Adjustable lumbar support office chair', 'Furniture', 320.00, 35, 'chair.jpg', 1);

COMMIT;
