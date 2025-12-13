# Postman Testing Guide for Sweet Shop Management System

## Base URL
```
http://localhost:8080
```

## Authentication Setup

### 1. Register a New User

**Endpoint:** `POST /api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "CUSTOMER"
}
```

**Note:** Role can be `CUSTOMER` or `ADMIN`. If not provided, defaults to `CUSTOMER`.

**Expected Response (200 OK):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "CUSTOMER"
  }
}
```

---

### 2. Login

**Endpoint:** `POST /api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Expected Response (200 OK):**
```json
{
  "message": "Login successful",
  "role": "CUSTOMER",
  "username": "john_doe"
}
```

**Important:** After login, Postman will automatically store the `authToken` cookie. Make sure to:
1. Enable cookies in Postman settings
2. The cookie will be sent automatically in subsequent requests

**Postman Cookie Settings:**
- Go to Settings → General → Cookies
- Enable "Automatically manage cookies"

---

## Sweet Management Endpoints

### 3. Add a New Sweet (Protected - Requires Authentication)

**Endpoint:** `POST /api/sweets`

**Headers:**
```
Content-Type: application/json
Cookie: authToken=<your_token_here>
```

**Request Body:**
```json
{
  "name": "Gulab Jamun",
  "category": "Indian Sweets",
  "price": 20.00,
  "quantity": 50
}
```

**Expected Response (201 Created):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Gulab Jamun",
  "category": "Indian Sweets",
  "price": 20.00,
  "quantity": 50
}
```

---

### 4. Get All Sweets (Protected)

**Endpoint:** `GET /api/sweets`

**Headers:**
```
Cookie: authToken=<your_token_here>
```

**Expected Response (200 OK):**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "Gulab Jamun",
    "category": "Indian Sweets",
    "price": 20.00,
    "quantity": 50
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "name": "Jalebi",
    "category": "Indian Sweets",
    "price": 15.00,
    "quantity": 40
  }
]
```

---

### 5. Search Sweets (Protected)

**Endpoint:** `GET /api/sweets/search`

**Headers:**
```
Cookie: authToken=<your_token_here>
```

**Query Parameters (all optional):**
- `name` - Search by name (partial match)
- `category` - Filter by category
- `minPrice` - Minimum price
- `maxPrice` - Maximum price

**Examples:**

Search by name:
```
GET /api/sweets/search?name=Gulab
```

Search by category:
```
GET /api/sweets/search?category=Indian Sweets
```

Search by price range:
```
GET /api/sweets/search?minPrice=10&maxPrice=25
```

Combined search:
```
GET /api/sweets/search?category=Indian Sweets&minPrice=15&maxPrice=30
```

**Expected Response (200 OK):**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "Gulab Jamun",
    "category": "Indian Sweets",
    "price": 20.00,
    "quantity": 50
  }
]
```

---

### 6. Update a Sweet (Protected)

**Endpoint:** `PUT /api/sweets/{id}`

**Headers:**
```
Content-Type: application/json
Cookie: authToken=<your_token_here>
```

**URL Parameter:**
- `id` - Sweet ID (MongoDB ObjectId)

**Request Body (all fields optional):**
```json
{
  "name": "Gulab Jamun Deluxe",
  "category": "Premium Sweets",
  "price": 25.00,
  "quantity": 45
}
```

**Expected Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Gulab Jamun Deluxe",
  "category": "Premium Sweets",
  "price": 25.00,
  "quantity": 45
}
```

---

### 7. Delete a Sweet (Protected - Admin Only)

**Endpoint:** `DELETE /api/sweets/{id}`

**Headers:**
```
Cookie: authToken=<admin_token_here>
```

**URL Parameter:**
- `id` - Sweet ID

**Expected Response (200 OK):**
```json
{
  "message": "Sweet deleted successfully"
}
```

**Error Response (403 Forbidden) if not admin:**
```json
{
  "error": "Admin access required"
}
```

---

### 8. Purchase a Sweet (Protected - Decreases Quantity)

**Endpoint:** `POST /api/sweets/{id}/purchase`

**Headers:**
```
Content-Type: application/json
Cookie: authToken=<your_token_here>
```

**URL Parameter:**
- `id` - Sweet ID

**Request Body:**
```json
{
  "quantity": 5
}
```

**Expected Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Gulab Jamun",
  "category": "Indian Sweets",
  "price": 20.00,
  "quantity": 45
}
```

**Note:** Quantity is decreased by the purchased amount.

---

### 9. Restock a Sweet (Protected - Admin Only)

**Endpoint:** `POST /api/sweets/{id}/restock`

**Headers:**
```
Content-Type: application/json
Cookie: authToken=<admin_token_here>
```

**URL Parameter:**
- `id` - Sweet ID

**Request Body:**
```json
{
  "quantity": 10
}
```

**Expected Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Gulab Jamun",
  "category": "Indian Sweets",
  "price": 20.00,
  "quantity": 55
}
```

**Note:** Quantity is increased by the restock amount.

---

## Cart Management Endpoints

### 10. Get Cart Item Count (Protected)

**Endpoint:** `GET /api/cart/items/count`

**Headers:**
```
Cookie: authToken=<your_token_here>
```

**Expected Response (200 OK):**
```json
5
```

---

### 11. Get All Cart Items (Protected)

**Endpoint:** `GET /api/cart/items`

**Headers:**
```
Cookie: authToken=<your_token_here>
```

**Expected Response (200 OK):**
```json
{
  "username": "john_doe",
  "role": "CUSTOMER",
  "cart": {
    "sweets": [
      {
        "sweet_id": "507f1f77bcf86cd799439011",
        "name": "Gulab Jamun",
        "category": "Indian Sweets",
        "price_per_unit": 20.00,
        "quantity": 2,
        "total_price": 40.00
      }
    ],
    "overall_total_price": 40.00
  }
}
```

---

### 12. Add Item to Cart (Protected)

**Endpoint:** `POST /api/cart/add`

**Headers:**
```
Content-Type: application/json
Cookie: authToken=<your_token_here>
```

**Request Body:**
```json
{
  "sweetId": "507f1f77bcf86cd799439011",
  "quantity": 2
}
```

**Expected Response (201 Created):**
```json
{
  "message": "Item added to cart successfully"
}
```

---

### 13. Update Cart Item Quantity (Protected)

**Endpoint:** `PUT /api/cart/update`

**Headers:**
```
Content-Type: application/json
Cookie: authToken=<your_token_here>
```

**Request Body:**
```json
{
  "sweetId": "507f1f77bcf86cd799439011",
  "quantity": 3
}
```

**Expected Response (200 OK):**
```json
{
  "message": "Cart item updated successfully"
}
```

---

### 14. Delete Cart Item (Protected)

**Endpoint:** `DELETE /api/cart/delete`

**Headers:**
```
Content-Type: application/json
Cookie: authToken=<your_token_here>
```

**Request Body:**
```json
{
  "sweetId": "507f1f77bcf86cd799439011"
}
```

**Expected Response (200 OK):**
```json
{
  "message": "Item removed from cart successfully"
}
```

---

## Payment Endpoints

### 15. Create Payment Order (Protected)

**Endpoint:** `POST /api/payment/create`

**Headers:**
```
Content-Type: application/json
Cookie: authToken=<your_token_here>
```

**Request Body:**
```json
{
  "totalAmount": 100.00,
  "cartItems": [
    {
      "sweetId": "507f1f77bcf86cd799439011",
      "quantity": 2,
      "price": 20.00
    },
    {
      "sweetId": "507f1f77bcf86cd799439012",
      "quantity": 4,
      "price": 15.00
    }
  ]
}
```

**Expected Response (200 OK):**
```json
{
  "razorpayOrderId": "order_xxxxxxxxxxxxx"
}
```

**Note:** Requires Razorpay credentials in `application.properties`:
```
razorpay.key_id=your_key_id
razorpay.key_secret=your_key_secret
```

---

### 16. Verify Payment (Protected)

**Endpoint:** `POST /api/payment/verify`

**Headers:**
```
Content-Type: application/json
Cookie: authToken=<your_token_here>
```

**Request Body:**
```json
{
  "razorpayOrderId": "order_xxxxxxxxxxxxx",
  "razorpayPaymentId": "pay_xxxxxxxxxxxxx",
  "razorpaySignature": "signature_xxxxxxxxxxxxx"
}
```

**Expected Response (200 OK):**
```json
{
  "message": "Payment verified successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Payment verification failed"
}
```

---

## Order Endpoints

### 17. Get User Orders (Protected)

**Endpoint:** `GET /api/orders`

**Headers:**
```
Cookie: authToken=<your_token_here>
```

**Expected Response (200 OK):**
```json
{
  "username": "john_doe",
  "role": "CUSTOMER",
  "sweets": [
    {
      "order_id": "order_xxxxxxxxxxxxx",
      "quantity": 2,
      "total_price": 40.00,
      "sweet_id": "507f1f77bcf86cd799439011",
      "name": "Gulab Jamun",
      "category": "Indian Sweets",
      "price_per_unit": 20.00
    }
  ]
}
```

---

## Postman Collection Setup Tips

### 1. Environment Variables
Create a Postman environment with:
- `base_url`: `http://localhost:8080`
- `auth_token`: (will be set automatically after login)

### 2. Cookie Management
- Enable automatic cookie management in Postman settings
- Cookies are stored per domain automatically
- The `authToken` cookie will be sent with all authenticated requests

### 3. Pre-request Script (Optional)
For requests that need authentication, you can add this to verify token exists:
```javascript
if (!pm.cookies.has('authToken')) {
    console.log('Warning: No auth token found. Please login first.');
}
```

### 4. Test Scripts (Optional)
Add test scripts to verify responses:
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has required fields", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
});
```

---

## Testing Workflow

### Complete Testing Flow:

1. **Register a new user**
   ```
   POST /api/auth/register
   ```

2. **Login to get authentication token**
   ```
   POST /api/auth/login
   ```
   (Token stored in cookie automatically)

3. **Add sweets (as ADMIN or CUSTOMER)**
   ```
   POST /api/sweets
   ```

4. **View all sweets**
   ```
   GET /api/sweets
   ```

5. **Add items to cart**
   ```
   POST /api/cart/add
   ```

6. **View cart**
   ```
   GET /api/cart/items
   ```

7. **Create payment order**
   ```
   POST /api/payment/create
   ```

8. **Verify payment** (after payment in Razorpay)
   ```
   POST /api/payment/verify
   ```

9. **View orders**
   ```
   GET /api/orders
   ```

---

## Common Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized access"
}
```
**Solution:** Login first to get authentication token

### 403 Forbidden
```json
{
  "error": "Admin access required"
}
```
**Solution:** Use an ADMIN account for admin-only endpoints

### 400 Bad Request
```json
{
  "error": "Invalid request data"
}
```
**Solution:** Check request body format and required fields

### 404 Not Found
```json
{
  "error": "Sweet not found"
}
```
**Solution:** Verify the ID exists in the database

---

## Notes

1. **Cookie-based Authentication:** The API uses HTTP-only cookies for authentication. Make sure Postman is configured to handle cookies automatically.

2. **CORS:** The API allows requests from:
   - `http://localhost:3000`
   - `http://localhost:5173`
   - `http://localhost:5174`

3. **MongoDB:** Ensure MongoDB is running on `localhost:27017` with database `Sweet_Sphere`

4. **Razorpay:** Payment endpoints require valid Razorpay credentials. For testing without Razorpay, you can mock the payment verification.

5. **Role-based Access:**
   - `CUSTOMER`: Can view, purchase sweets, manage cart, make payments
   - `ADMIN`: All customer permissions + can add/update/delete sweets, restock inventory

