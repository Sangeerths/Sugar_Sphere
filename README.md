# 🍬 Sugar Sphere - E-Commerce Platform for Sweets

A full-stack e-commerce application for selling sweets, chocolates, and confections. Built with React.js frontend and Spring Boot backend, featuring user authentication, shopping cart, order management, payment integration, and admin panel.

![Sugar Sphere](https://img.shields.io/badge/Sugar-Sphere-pink?style=for-the-badge)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.0-brightgreen?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=for-the-badge)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Admin Access](#admin-access)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### User Features
- 🏠 **Beautiful Homepage** - Modern, responsive landing page with featured products
- 🛍️ **Product Browsing** - Browse and search through available sweets
- 🛒 **Shopping Cart** - Add items to cart, update quantities, and manage cart items
- 💳 **Payment Integration** - Secure payment processing via Razorpay
- 📦 **Order Management** - View order history and track order status
- 👤 **User Authentication** - Secure login and registration with JWT tokens
- 🔐 **Protected Routes** - Secure access to user-specific pages

### Admin Features
- 🎛️ **Admin Panel** - Comprehensive dashboard for managing the store
- 🍬 **Product Management** - Add, edit, delete, and restock sweets
- 📊 **Order Management** - View all orders and update order status
- 💰 **Revenue Dashboard** - Track sales, revenue, and order statistics
- 👥 **User Management** - Manage user accounts and roles

## 🛠️ Tech Stack

### Frontend
- **React.js 18.2.0** - UI library
- **React Router DOM 6.30.2** - Routing
- **Axios 1.13.2** - HTTP client
- **Tailwind CSS 3.3.6** - Styling
- **Vite 5.0.8** - Build tool

### Backend
- **Spring Boot 4.0.0** - Framework
- **Spring Security** - Authentication & Authorization
- **Spring Data MongoDB** - Database integration
- **JWT** - Token-based authentication
- **Lombok** - Boilerplate reduction
- **Razorpay** - Payment gateway integration

### Database
- **MongoDB** - NoSQL database

## 📁 Project Structure

```
Sugar_Sphere-main/
├── Sugar_Sphere_Backend/          # Spring Boot Backend
│   ├── src/
│   │   └── main/
│   │       ├── java/com/example/demo/
│   │       │   ├── config/        # Configuration classes
│   │       │   ├── controller/    # REST Controllers
│   │       │   ├── dto/           # Data Transfer Objects
│   │       │   ├── exception/     # Exception handlers
│   │       │   ├── model/         # Entity models
│   │       │   ├── repository/    # MongoDB repositories
│   │       │   ├── security/      # Security configuration
│   │       │   └── service/       # Business logic
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
│
├── SugarSphere_frontend/
│   └── SugarSphere/               # React Frontend
│       ├── src/
│       │   ├── components/        # React components
│       │   ├── context/           # Context providers
│       │   ├── services/         # API services
│       │   └── App.jsx
│       ├── package.json
│       └── vite.config.js
│
├── CREATE_ADMIN.md               # Admin setup guide
└── README.md                     # This file
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17** or higher
- **Node.js 16+** and **npm** or **yarn**
- **MongoDB** (running locally or connection string)
- **Maven 3.6+** (for backend)
- **Git** (for cloning the repository)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Sugar_Sphere-main
```

### 2. Backend Setup

Navigate to the backend directory and follow the instructions in [Backend README](./Sugar_Sphere_Backend/README.md).

```bash
cd Sugar_Sphere_Backend
```

### 3. Frontend Setup

Navigate to the frontend directory and follow the instructions in [Frontend README](./SugarSphere_frontend/SugarSphere/README.md).

```bash
cd SugarSphere_frontend/SugarSphere
```

## ⚙️ Configuration

### Backend Configuration

Edit `Sugar_Sphere_Backend/src/main/resources/application.properties`:

```properties
# MongoDB Configuration
spring.data.mongodb.uri=mongodb://localhost:27017
spring.data.mongodb.database=test

# JWT Configuration
app.jwt.secret=your-secret-key-here
app.jwt.expiration=86400000

# Server Configuration
server.port=8080

# Razorpay Configuration (Get from Razorpay Dashboard)
razorpay.key.id=your-razorpay-key-id
razorpay.key.secret=your-razorpay-key-secret
```

### Frontend Configuration

The frontend is configured to connect to `http://localhost:8080` by default. Update the API base URL in `src/services/api.js` if needed.

## 🏃 Running the Application

### 1. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
# or
mongod
```

### 2. Start Backend Server

```bash
cd Sugar_Sphere_Backend
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Start Frontend Development Server

```bash
cd SugarSphere_frontend/SugarSphere
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Product Endpoints
- `GET /api/sweets` - Get all sweets (public)
- `GET /api/sweets/{id}` - Get sweet by ID
- `GET /api/sweets/search` - Search sweets
- `POST /api/sweets` - Create sweet (Admin only)
- `PUT /api/sweets/{id}` - Update sweet (Admin only)
- `DELETE /api/sweets/{id}` - Delete sweet (Admin only)
- `POST /api/sweets/{id}/restock` - Restock sweet (Admin only)

### Cart Endpoints
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/{productId}` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Order Endpoints
- `POST /api/orders/create` - Create order
- `POST /api/orders/verify-payment` - Verify Razorpay payment
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/admin/all` - Get all orders (Admin only)
- `GET /api/orders/admin/revenue` - Get revenue stats (Admin only)
- `PUT /api/orders/{id}/status` - Update order status (Admin only)

## 👨‍💼 Admin Access

For detailed instructions on creating an admin user and accessing the admin panel, see [CREATE_ADMIN.md](./CREATE_ADMIN.md).

**Quick Setup:**
1. Start the backend application
2. An admin user is automatically created with:
   - Username: `admin`
   - Password: `admin123`
   - Email: `admin@sugarshop.com`
3. Login and access the Admin Panel

## 🎨 Features Overview

### Homepage
- Modern, responsive design
- Featured products showcase
- Call-to-action sections
- Smooth animations

### Dashboard
- Product browsing and search
- Add to cart functionality
- Buy now option
- Responsive grid layout

### Shopping Cart
- View cart items
- Update quantities
- Remove items
- Calculate totals
- Proceed to checkout

### Checkout & Payment
- Razorpay integration
- Secure payment processing
- Order confirmation
- Automatic cart clearing

### Admin Panel
- **Manage Sweets**: CRUD operations for products
- **View Orders**: All orders with status management
- **Revenue Dashboard**: Sales statistics and metrics

## 🔒 Security Features

- JWT-based authentication
- Password encryption (BCrypt)
- Role-based access control (USER, ADMIN)
- Protected API endpoints
- Secure payment processing

## 🐛 Troubleshooting

### Backend Issues
- Ensure MongoDB is running
- Check port 8080 is not in use
- Verify JWT secret is set
- Check application.properties configuration

### Frontend Issues
- Clear browser cache
- Check API base URL in `api.js`
- Verify backend is running
- Check browser console for errors

### Database Issues
- Ensure MongoDB is accessible
- Check connection string
- Verify database name matches configuration

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the amazing library
- MongoDB for the database solution
- Razorpay for payment gateway integration
- Tailwind CSS for the utility-first CSS framework

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

**Made with ❤️ and lots of 🍬**
