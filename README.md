# Order Management & Tracking Platform

A full-stack Order Management & Tracking Platform built with **Java Spring Boot** (backend) and **React** (frontend) to streamline customer order processing and real-time order tracking.

## Features

- **Secure Authentication** — JWT-based login/register with role-based access (Admin/Customer)
- **Product Catalog** — Browse, search, and filter products by category
- **Order Placement** — Shopping cart, inventory validation, and automated order processing
- **Payment Tracking** — Payment status monitoring with multiple payment methods
- **Order Tracking** — Real-time order lifecycle tracking with timeline view
- **Admin Dashboard** — Manage products, orders, and payments

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Java 17+, Spring Boot 3.2, Spring Security, Spring Data JPA |
| Frontend | React 18, React Router, Axios, Bootstrap 5 |
| Database | H2 (dev) / Oracle (production) |
| Auth | JWT (JSON Web Tokens) |
| Build | Maven (backend), Vite (frontend) |

## Project Structure

```
├── backend/                  # Spring Boot REST API
│   ├── src/main/java/com/orderplatform/
│   │   ├── config/           # Security, JWT, CORS configuration
│   │   ├── controller/       # REST API controllers
│   │   ├── dto/              # Request/Response DTOs
│   │   ├── entity/           # JPA entities & enums
│   │   ├── exception/        # Custom exceptions & global handler
│   │   ├── repository/       # Spring Data JPA repositories
│   │   └── service/          # Business logic layer
│   └── src/main/resources/
│       ├── application.properties
│       └── data.sql          # Seed data
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # Auth context provider
│   │   ├── pages/            # Page components
│   │   └── services/         # API service layer
│   └── index.html
└── README.md
```

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- npm

### Backend Setup

```bash
cd backend
mvnw.cmd spring-boot:run
```

The backend starts on **http://localhost:8080**

> H2 Console available at http://localhost:8080/h2-console (JDBC URL: `jdbc:h2:mem:orderdb`)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on **http://localhost:3000**

### Default Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Customer | customer | customer123 |

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login & get JWT token |
| GET | `/api/products` | Public | List all products |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/{id}` | Admin | Update product |
| DELETE | `/api/products/{id}` | Admin | Soft-delete product |
| POST | `/api/orders` | Auth | Place new order |
| GET | `/api/orders` | Auth | List orders |
| GET | `/api/orders/{id}` | Auth | Get order details |
| PUT | `/api/orders/{id}/status` | Admin | Update order status |
| GET | `/api/payments/order/{orderId}` | Auth | Get payment info |
| PUT | `/api/payments/{id}/status` | Admin | Update payment status |
| GET | `/api/tracking/order/{orderId}` | Auth | Get tracking history |

## Architecture

- **Layered Architecture**: Controller → Service → Repository → Database
- **RESTful API Design** with proper HTTP methods and status codes
- **JWT Security** with stateless session management
- **OOP Principles**: Encapsulation, inheritance, polymorphism throughout
- **Exception Handling**: Global exception handler with structured error responses
- **Transaction Management**: `@Transactional` for order processing with inventory validation
