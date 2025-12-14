# 🎨 Sugar Sphere Frontend

React.js frontend application for the Sugar Sphere e-commerce platform. Built with modern web technologies for a smooth, responsive user experience.

![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-5.0.8-purple?style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.6-38bdf8?style=for-the-badge)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Configuration](#configuration)
- [Components](#components)
- [Services](#services)
- [Routing](#routing)
- [Styling](#styling)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## ✨ Features

- 🏠 **Homepage** - Beautiful landing page with featured products
- 🛍️ **Product Dashboard** - Browse and search sweets
- 🛒 **Shopping Cart** - Add, update, and manage cart items
- 💳 **Checkout** - Secure payment processing with Razorpay
- 👤 **Authentication** - User login and registration
- 🎛️ **Admin Panel** - Complete admin interface for managing the store
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🎨 **Modern UI** - Beautiful gradient designs with Tailwind CSS

## 🛠️ Tech Stack

- **React 18.2.0** - UI library
- **React Router DOM 6.30.2** - Client-side routing
- **Axios 1.13.2** - HTTP client for API calls
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Vite 5.0.8** - Fast build tool and dev server
- **PostCSS & Autoprefixer** - CSS processing

## 📁 Project Structure

```
SugarSphere/
├── public/                 # Static assets
├── src/
│   ├── components/        # React components
│   │   ├── HomePage.jsx   # Landing page
│   │   ├── Dashboard.jsx  # Product browsing
│   │   ├── CartPage.jsx   # Shopping cart
│   │   ├── Checkout.jsx   # Payment checkout
│   │   ├── Login.jsx      # User login
│   │   ├── Register.jsx   # User registration
│   │   ├── AdminPanel.jsx # Admin dashboard
│   │   ├── Navbar.jsx     # Navigation bar
│   │   └── SweetCard.jsx  # Product card component
│   ├── context/           # React Context
│   │   └── AuthContext.jsx # Authentication context
│   ├── services/          # API services
│   │   ├── api.js         # Axios instance & interceptors
│   │   ├── authService.js # Authentication API
│   │   ├── sweetService.js # Products API
│   │   ├── cartService.js # Cart API
│   │   └── orderService.js # Orders API
│   ├── App.jsx            # Main app component
│   ├── App.css            # Global styles
│   └── main.jsx           # Entry point
├── index.html             # HTML template
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── postcss.config.js      # PostCSS configuration
```

## 📋 Prerequisites

- **Node.js 16+** and **npm** (or **yarn**)
- Backend server running on `http://localhost:8080`

## 🚀 Installation

### 1. Navigate to Frontend Directory

```bash
cd SugarSphere_frontend/SugarSphere
```

### 2. Install Dependencies

```bash
npm install
```

or

```bash
yarn install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173`

## 📜 Available Scripts

### Development

```bash
npm run dev
```

Starts the development server with hot module replacement (HMR).

### Build for Production

```bash
npm run build
```

Creates an optimized production build in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

Previews the production build locally.

## ⚙️ Configuration

### API Base URL

The API base URL is configured in `src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  // ...
});
```

Update this if your backend runs on a different port or domain.

### Tailwind CSS

Tailwind is configured in `tailwind.config.js`. Customize colors, fonts, and other design tokens here.

## 🧩 Components

### HomePage
- Landing page with hero section
- Featured products showcase
- Call-to-action sections
- Responsive design

### Dashboard
- Product grid display
- Search functionality
- Add to cart
- Buy now option
- Protected route (requires login)

### CartPage
- View cart items
- Update quantities
- Remove items
- Calculate totals
- Navigate to checkout

### Checkout
- Order summary
- Razorpay payment integration
- Order confirmation
- Redirect after payment

### Login/Register
- User authentication forms
- Form validation
- Error handling
- Redirect after login

### AdminPanel
- **Manage Sweets Tab**: CRUD operations for products
- **View Orders Tab**: All orders with status management
- **Revenue Dashboard Tab**: Sales statistics

### Navbar
- Navigation links
- User authentication status
- Cart button
- Admin panel link (for admins)
- Back button
- Centered logo

## 🔌 Services

### api.js
Centralized Axios instance with:
- Base URL configuration
- Request interceptors (adds JWT token)
- Response interceptors (handles errors)
- Error handling

### authService.js
- `register(userData)` - Register new user
- `login(credentials)` - User login
- `getCurrentUser()` - Get current user info

### sweetService.js
- `getAllSweets()` - Get all products
- `getSweetById(id)` - Get product by ID
- `searchSweets(...)` - Search products
- `createSweet(data)` - Create product (Admin)
- `updateSweet(id, data)` - Update product (Admin)
- `deleteSweet(id)` - Delete product (Admin)
- `restockSweet(id, quantity)` - Restock product (Admin)

### cartService.js
- `getCart()` - Get user's cart
- `addToCart(productId, quantity)` - Add item to cart
- `updateCartItem(productId, quantity)` - Update cart item
- `removeFromCart(productId)` - Remove item from cart
- `clearCart()` - Clear cart

### orderService.js
- `createOrder(orderData)` - Create order
- `verifyPayment(paymentData)` - Verify Razorpay payment
- `getMyOrders()` - Get user's orders
- `getAllOrders()` - Get all orders (Admin)
- `getRevenueStats()` - Get revenue statistics (Admin)
- `updateOrderStatus(orderId, status)` - Update order status (Admin)

## 🛣️ Routing

Routes are defined in `App.jsx`:

- `/` - HomePage (public)
- `/login` - Login page (public)
- `/register` - Registration page (public)
- `/dashboard` - Product dashboard (protected)
- `/cart` - Shopping cart (protected)
- `/checkout` - Checkout page (protected)
- `/admin` - Admin panel (admin only)

### Protected Routes
Routes wrapped in `<ProtectedRoute>` require authentication.

### Admin Routes
Routes wrapped in `<AdminRoute>` require admin role.

## 🎨 Styling

### Tailwind CSS
The project uses Tailwind CSS for styling. Key features:
- Utility-first approach
- Custom color palette (pink/purple gradients)
- Responsive design utilities
- Custom animations

### Custom Styles
Additional styles in `App.css`:
- Loading spinners
- Smooth scroll
- Custom scrollbar
- Button hover effects
- Card animations
- Gradient text

### Color Scheme
- Primary: Pink (#ec4899) to Purple (#a855f7) gradients
- Background: Light pink/purple tones
- Text: Gray scale with white for contrast

## 🔐 Authentication

### AuthContext
Global authentication state managed via React Context:
- User information
- Login/logout functions
- Admin role check
- Token management

### Token Storage
JWT tokens are stored in `localStorage` and automatically included in API requests.

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Access in code:
```javascript
import.meta.env.VITE_API_BASE_URL
```

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is in use, Vite will automatically try the next available port.

### API Connection Errors
- Ensure backend is running on `http://localhost:8080`
- Check CORS configuration in backend
- Verify API base URL in `api.js`

### Build Errors
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

### Styling Issues
- Ensure Tailwind is properly configured
- Check `tailwind.config.js` for content paths
- Verify PostCSS configuration

### Authentication Issues
- Check token in localStorage
- Verify token expiration
- Ensure backend JWT secret matches

## 📦 Build for Production

1. Update API base URL for production
2. Build the application:
   ```bash
   npm run build
   ```
3. Deploy the `dist` folder to your hosting service

## 🔄 Updating Dependencies

```bash
npm update
```

Check for security vulnerabilities:
```bash
npm audit
```

Fix vulnerabilities:
```bash
npm audit fix
```

## 📝 Development Tips

1. **Hot Reload**: Changes automatically reflect in the browser
2. **React DevTools**: Install browser extension for debugging
3. **Console Logging**: Use `console.log` for debugging (remove in production)
4. **Error Boundaries**: Consider adding error boundaries for better error handling

## 🤝 Contributing

When contributing to the frontend:
1. Follow React best practices
2. Use functional components and hooks
3. Maintain consistent code style
4. Add comments for complex logic
5. Test components before committing

## 📄 License

This project is part of the Sugar Sphere e-commerce platform.

---

**Happy Coding! 🎨✨**
ghyhnj
