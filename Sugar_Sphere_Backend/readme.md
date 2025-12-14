# 🔧 Sugar Sphere Backend

Spring Boot REST API backend for the Sugar Sphere e-commerce platform. Provides secure authentication, product management, cart operations, order processing, and payment integration.

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.0-brightgreen?style=for-the-badge)
![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=for-the-badge)
![Maven](https://img.shields.io/badge/Maven-3.6+-blue?style=for-the-badge)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Security](#security)
- [Payment Integration](#payment-integration)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 👥 **User Management** - Registration, login, and role management
- 🍬 **Product Management** - CRUD operations for sweets
- 🛒 **Shopping Cart** - Add, update, and manage cart items
- 📦 **Order Processing** - Order creation and management
- 💳 **Payment Integration** - Razorpay payment gateway
- 📊 **Admin Features** - Admin panel with revenue tracking
- 🔒 **Role-Based Access Control** - USER and ADMIN roles
- 📝 **Input Validation** - Request validation with Jakarta Validation
- 🛡️ **Exception Handling** - Global exception handler

## 🛠️ Tech Stack

- **Spring Boot 4.0.0** - Application framework
- **Spring Security** - Authentication and authorization
- **Spring Data MongoDB** - Database integration
- **JWT (JJWT)** - Token generation and validation
- **Lombok** - Boilerplate code reduction
- **Jakarta Validation** - Input validation
- **MongoDB** - NoSQL database
- **Razorpay SDK** - Payment gateway integration
- **Maven** - Dependency management

## 📁 Project Structure

```
Sugar_Sphere_Backend/
├── src/
│   └── main/
│       ├── java/com/example/demo/
│       │   ├── config/
│       │   │   ├── SecurityConfig.java          # Spring Security configuration
│       │   │   └── AdminUserInitializer.java    # Auto admin creation
│       │   ├── controller/
│       │   │   ├── AuthController.java         # Authentication endpoints
│       │   │   ├── SweetController.java       # Product endpoints
│       │   │   ├── CartController.java         # Cart endpoints
│       │   │   ├── OrderController.java        # Order endpoints
│       │   │   └── AdminController.java        # Admin endpoints
│       │   ├── dto/
│       │   │   ├── AuthRequest.java            # Login/Register DTOs
│       │   │   ├── AuthResponse.java           # Auth response DTO
│       │   │   ├── SweetRequest.java           # Product DTO
│       │   │   └── ApiResponse.java            # Generic API response
│       │   ├── exception/
│       │   │   ├── GlobalExceptionHandler.java # Exception handling
│       │   │   ├── ResourceNotFoundException.java
│       │   │   └── BadRequestException.java
│       │   ├── model/
│       │   │   ├── User.java                   # User entity
│       │   │   ├── Sweet.java                  # Product entity
│       │   │   ├── Cart.java                   # Cart entity
│       │   │   ├── CartItem.java               # Cart item entity
│       │   │   ├── Order.java                  # Order entity
│       │   │   └── OrderItem.java              # Order item entity
│       │   ├── repository/
│       │   │   ├── UserRepository.java         # User repository
│       │   │   ├── SweetRepository.java        # Product repository
│       │   │   ├── CartRepository.java         # Cart repository
│       │   │   └── OrderRepository.java        # Order repository
│       │   ├── security/
│       │   │   ├── JwtAuthenticationFilter.java # JWT filter
│       │   │   ├── JwtTokenProvider.java       # Token utilities
│       │   │   └── UserDetailsServiceImpl.java # User details service
│       │   ├── service/
│       │   │   ├── AuthService.java            # Authentication logic
│       │   │   ├── SweetService.java           # Product logic
│       │   │   ├── CartService.java            # Cart logic
│       │   │   └── OrderService.java           # Order logic
│       │   └── SugarSphereBackendApplication.java
│       └── resources/
│           └── application.properties          # Configuration
└── pom.xml                                     # Maven dependencies
```

## 📋 Prerequisites

- **Java 17** or higher
- **Maven 3.6+**
- **MongoDB** (running locally or connection string)
- **IDE** (IntelliJ IDEA, Eclipse, or VS Code)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Sugar_Sphere-main/Sugar_Sphere_Backend
```

### 2. Install Dependencies

Maven will automatically download dependencies when you build the project:

```bash
mvn clean install
```

### 3. Configure MongoDB

Ensure MongoDB is running on your system:

```bash
# Windows
mongod

# Linux/Mac
sudo systemctl start mongod
# or
mongod
```

### 4. Configure Application

Edit `src/main/resources/application.properties` (see [Configuration](#configuration) section).

## ⚙️ Configuration

Edit `src/main/resources/application.properties`:

```properties
# Application Name
spring.application.name=Sugar_Sphere_Backend

# MongoDB Configuration
spring.data.mongodb.uri=mongodb://localhost:27017
spring.data.mongodb.database=test

# JWT Configuration
app.jwt.secret=your-very-long-and-secure-secret-key-here-minimum-256-bits
app.jwt.expiration=86400000  # 24 hours in milliseconds

# Server Configuration
server.port=8080

# CORS Configuration (handled in SecurityConfig)
# Allow all origins for development
# Restrict in production

# Razorpay Configuration
razorpay.key.id=your-razorpay-key-id
razorpay.key.secret=your-razorpay-key-secret

# Logging
logging.level.org.springframework.security=INFO
logging.level.com.example.demo=DEBUG
logging.level.org.springframework.data.mongodb=DEBUG
```

### Important Configuration Notes

1. **JWT Secret**: Use a long, random secret key (minimum 256 bits). Generate one:
   ```bash
   openssl rand -base64 32
   ```

2. **MongoDB URI**: Update if MongoDB is on a different host/port or requires authentication:
   ```
   mongodb://username:password@host:port/database
   ```

3. **Razorpay Keys**: Get from [Razorpay Dashboard](https://dashboard.razorpay.com/)

## 🏃 Running the Application

### Using Maven

```bash
mvn spring-boot:run
```

### Using IDE

1. Open the project in your IDE
2. Run `SugarSphereBackendApplication.java`
3. Application starts on `http://localhost:8080`

### Build JAR File

```bash
mvn clean package
java -jar target/Sugar_Sphere_Backend-0.0.1-SNAPSHOT.jar
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Products (Sweets)

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/sweets` | Get all sweets | No | - |
| GET | `/api/sweets/{id}` | Get sweet by ID | No | - |
| GET | `/api/sweets/search` | Search sweets | No | - |
| POST | `/api/sweets` | Create sweet | Yes | ADMIN |
| PUT | `/api/sweets/{id}` | Update sweet | Yes | ADMIN |
| DELETE | `/api/sweets/{id}` | Delete sweet | Yes | ADMIN |
| POST | `/api/sweets/{id}/restock` | Restock sweet | Yes | ADMIN |

### Cart

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/cart` | Get user's cart | Yes | USER, ADMIN |
| POST | `/api/cart/add` | Add item to cart | Yes | USER, ADMIN |
| PUT | `/api/cart/update` | Update cart item | Yes | USER, ADMIN |
| DELETE | `/api/cart/remove/{productId}` | Remove item | Yes | USER, ADMIN |
| DELETE | `/api/cart/clear` | Clear cart | Yes | USER, ADMIN |

### Orders

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/orders/create` | Create order | Yes | USER, ADMIN |
| POST | `/api/orders/verify-payment` | Verify payment | Yes | USER, ADMIN |
| GET | `/api/orders/my-orders` | Get user's orders | Yes | USER, ADMIN |
| GET | `/api/orders/admin/all` | Get all orders | Yes | ADMIN |
| GET | `/api/orders/admin/revenue` | Get revenue stats | Yes | ADMIN |
| PUT | `/api/orders/{id}/status` | Update order status | Yes | ADMIN |

### Admin

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/admin/create-admin` | Create admin user | No |

## 🗄️ Database Models

### User
- `_id` (MongoDB ObjectId)
- `username` (String, unique)
- `email` (String, unique)
- `password` (String, encrypted)
- `roles` (List<String>)

### Sweet
- `_id` (MongoDB ObjectId)
- `id` (Integer, numeric ID)
- `name` (String)
- `category` (String, optional)
- `description` (String)
- `price` (Integer)
- `quantity` (Integer)
- `imageUrl` (String)

### Cart
- `_id` (MongoDB ObjectId)
- `user` (DBRef to User)
- `items` (List<CartItem>)
- `totalAmount` (Double)
- `itemCount` (Integer)
- `createdAt` (LocalDateTime)
- `updatedAt` (LocalDateTime)

### Order
- `_id` (MongoDB ObjectId)
- `orderNumber` (String, unique)
- `user` (DBRef to User)
- `items` (List<OrderItem>)
- `totalAmount` (Double)
- `orderStatus` (String)
- `paymentId` (String)
- `createdAt` (LocalDateTime)

## 🔒 Security

### JWT Authentication
- Tokens expire after 24 hours (configurable)
- Tokens stored in HTTP-only cookies or localStorage (frontend)
- Token validation on protected endpoints

### Password Encryption
- BCrypt password hashing
- Salt rounds: 10

### Role-Based Access Control
- **USER**: Can browse, add to cart, place orders
- **ADMIN**: Full access including product management and order management

### CORS Configuration
Configured in `SecurityConfig.java` to allow frontend origin.

### Protected Endpoints
- Most endpoints require authentication
- Admin endpoints require ADMIN role
- Public endpoints: `/api/auth/**`, `/api/sweets/**` (GET), `/api/admin/create-admin`

## 💳 Payment Integration

### Razorpay Integration
- Order creation generates Razorpay order
- Payment verification after successful payment
- Stock updates after order confirmation
- Cart clearing after successful payment

### Payment Flow
1. User creates order → Backend creates Razorpay order
2. Frontend initiates Razorpay payment
3. User completes payment
4. Frontend sends payment verification to backend
5. Backend verifies payment with Razorpay
6. Backend creates order, updates stock, clears cart

## 🧪 Testing

### Manual Testing
Use Postman or curl to test endpoints:

```bash
# Register user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"password123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### Unit Testing
Create test classes in `src/test/java`:

```java
@SpringBootTest
class SweetServiceTest {
    // Test methods
}
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or `sudo systemctl start mongod`
- Check connection string in `application.properties`
- Verify MongoDB port (default: 27017)

### Port Already in Use
Change port in `application.properties`:
```properties
server.port=8081
```

### JWT Token Issues
- Verify JWT secret is set
- Check token expiration time
- Ensure token is sent in Authorization header

### CORS Errors
- Update CORS configuration in `SecurityConfig.java`
- Add frontend origin to allowed origins

### Build Errors
```bash
mvn clean install
```

### Dependency Issues
```bash
mvn dependency:resolve
```

## 📝 Admin User Setup

An admin user is automatically created on first startup:
- Username: `admin`
- Password: `admin123`
- Email: `admin@sugarshop.com`

See [CREATE_ADMIN.md](../CREATE_ADMIN.md) for more details.

## 🔄 Database Migrations

MongoDB doesn't require explicit migrations. Collections are created automatically when entities are saved.

## 📊 Logging

Logging levels configured in `application.properties`:
- `DEBUG`: Detailed debugging information
- `INFO`: General information
- `WARN`: Warning messages
- `ERROR`: Error messages

## 🚀 Deployment

### Build for Production

```bash
mvn clean package -DskipTests
```

### Production Configuration

1. Use environment variables for sensitive data
2. Change JWT secret
3. Configure production MongoDB
4. Set up HTTPS
5. Configure CORS for production domain
6. Update Razorpay keys (use live keys)

### Environment Variables

```bash
export SPRING_DATA_MONGODB_URI=mongodb://production-host:27017/dbname
export APP_JWT_SECRET=production-secret-key
export RAZORPAY_KEY_ID=production-key-id
export RAZORPAY_KEY_SECRET=production-key-secret
```

## 📚 Additional Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Razorpay Documentation](https://razorpay.com/docs/)

## 🤝 Contributing

When contributing to the backend:
1. Follow Java coding conventions
2. Add proper error handling
3. Write unit tests
4. Update API documentation
5. Follow RESTful principles

## 📄 License

This project is part of the Sugar Sphere e-commerce platform.

---

**Happy Coding! 🔧✨**
