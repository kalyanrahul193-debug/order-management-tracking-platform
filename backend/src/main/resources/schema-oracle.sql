-- ============================================================================
-- Order Management & Tracking Platform - Oracle Database Schema
-- Optimized for High-Concurrency Order Processing & Real-time Tracking
-- ============================================================================

-- 1. USERS TABLE
CREATE TABLE users (
    id NUMBER(19) GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR2(50) NOT NULL UNIQUE,
    email VARCHAR2(100) NOT NULL UNIQUE,
    password VARCHAR2(255) NOT NULL,
    role VARCHAR2(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- 2. PRODUCTS TABLE
CREATE TABLE products (
    id NUMBER(19) GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR2(150) NOT NULL,
    description VARCHAR2(1000),
    category VARCHAR2(50),
    price NUMBER(10, 2) NOT NULL CHECK (price >= 0),
    stock_quantity NUMBER(10) NOT NULL CHECK (stock_quantity >= 0),
    image_url VARCHAR2(500),
    active NUMBER(1) DEFAULT 1 NOT NULL CHECK (active IN (0, 1))
);

CREATE INDEX idx_products_category ON products(category, active);
CREATE INDEX idx_products_name ON products(UPPER(name));

-- 3. ORDERS TABLE
CREATE TABLE orders (
    id NUMBER(19) GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id NUMBER(19) NOT NULL,
    order_number VARCHAR2(50) NOT NULL UNIQUE,
    status VARCHAR2(30) DEFAULT 'PLACED' NOT NULL,
    total_amount NUMBER(12, 2) NOT NULL CHECK (total_amount >= 0),
    shipping_address VARCHAR2(500) NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Composite index to accelerate user order history queries ordered by date
CREATE INDEX idx_orders_user_date ON orders(user_id, order_date DESC);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_num ON orders(order_number);

-- 4. ORDER ITEMS TABLE
CREATE TABLE order_items (
    id NUMBER(19) GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id NUMBER(19) NOT NULL,
    product_id NUMBER(19) NOT NULL,
    quantity NUMBER(10) NOT NULL CHECK (quantity > 0),
    unit_price NUMBER(10, 2) NOT NULL CHECK (unit_price >= 0),
    subtotal NUMBER(12, 2) NOT NULL CHECK (subtotal >= 0),
    CONSTRAINT fk_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_items_product FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE INDEX idx_items_order ON order_items(order_id);
CREATE INDEX idx_items_product ON order_items(product_id);

-- 5. PAYMENTS TABLE
CREATE TABLE payments (
    id NUMBER(19) GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id NUMBER(19) NOT NULL UNIQUE,
    payment_method VARCHAR2(30) NOT NULL,
    payment_status VARCHAR2(30) DEFAULT 'PENDING' NOT NULL,
    amount NUMBER(12, 2) NOT NULL CHECK (amount >= 0),
    transaction_id VARCHAR2(100) NOT NULL UNIQUE,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_payments_txn ON payments(transaction_id);

-- 6. ORDER TRACKING TABLE
CREATE TABLE order_tracking (
    id NUMBER(19) GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id NUMBER(19) NOT NULL,
    status VARCHAR2(50) NOT NULL,
    location VARCHAR2(150),
    description VARCHAR2(500),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT fk_tracking_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Composite index optimized for real-time tracking timeline lookups
CREATE INDEX idx_tracking_order_time ON order_tracking(order_id, timestamp ASC);
