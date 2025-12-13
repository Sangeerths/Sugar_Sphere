# Postman Cookie Authentication Troubleshooting

## Issue: 401 Unauthorized After Login

If login works but protected endpoints return 401, follow these steps:

### Step 1: Verify Cookie is Set After Login

1. After successful login, check the **Cookies** tab in the response
2. You should see a cookie named `authToken`
3. Verify the cookie has:
   - **Name:** `authToken`
   - **Value:** A JWT token (starts with `eyJ...`)
   - **Domain:** `localhost` or empty
   - **Path:** `/`

### Step 2: Enable Cookie Management in Postman

1. Go to **Settings** (gear icon) → **General**
2. Make sure **"Automatically manage cookies"** is **ENABLED**
3. Restart Postman if needed

### Step 3: Check Cookie is Sent in Next Request

1. After login, make a request to a protected endpoint (e.g., `GET /api/sweets`)
2. Go to the **Headers** tab
3. Look for a **Cookie** header
4. It should contain: `authToken=eyJ...`

### Step 4: Manual Cookie Setup (If Automatic Doesn't Work)

If cookies aren't being sent automatically:

1. After login, copy the token from the response body (if included) or from Cookies tab
2. In your protected endpoint request:
   - Go to **Headers** tab
   - Add a new header:
     - **Key:** `Cookie`
     - **Value:** `authToken=YOUR_TOKEN_HERE`
   - Make sure it's **checked/enabled**

### Step 5: Use Postman Environment Variables

1. Create an environment in Postman
2. After login, use a **Test Script** to save the token:
   ```javascript
   // In login request's Tests tab
   if (pm.response.code === 200) {
       const response = pm.response.json();
       if (response.token) {
           pm.environment.set("authToken", response.token);
       }
   }
   ```
3. In protected requests, add a **Pre-request Script**:
   ```javascript
   // Set cookie from environment variable
   const token = pm.environment.get("authToken");
   if (token) {
       pm.request.headers.add({
           key: 'Cookie',
           value: `authToken=${token}`
       });
   }
   ```

### Step 6: Check Server Logs

Check your Spring Boot console for:
- `Extracted token: ...` - Should show token was found
- `Token validation failed` - Indicates token is invalid
- `No token found in cookies` - Cookie wasn't sent

### Step 7: Verify Token Format

The token should:
- Start with `eyJ`
- Be a long string (usually 200+ characters)
- Be a valid JWT format

### Common Issues and Solutions

#### Issue: Cookie Not Persisting
**Solution:** 
- Clear all cookies: **Cookies** → **Manage Cookies** → Delete all
- Login again
- Check if cookie appears in response

#### Issue: Cookie Domain Mismatch
**Solution:**
- Make sure you're using `localhost` not `127.0.0.1`
- Or vice versa - be consistent

#### Issue: Token Expired
**Solution:**
- Tokens expire after 1 hour
- Login again to get a new token

#### Issue: Multiple Cookies with Same Name
**Solution:**
- Clear all cookies
- Login fresh
- Only one `authToken` cookie should exist

### Testing Flow

1. **Register User:**
   ```
   POST http://localhost:8080/api/auth/register
   Body: { "username": "test", "email": "test@test.com", "password": "test123", "role": "CUSTOMER" }
   ```

2. **Login:**
   ```
   POST http://localhost:8080/api/auth/login
   Body: { "username": "test", "password": "test123" }
   ```
   - Check **Cookies** tab - should see `authToken`
   - Check **Body** - should see success message

3. **Test Protected Endpoint:**
   ```
   GET http://localhost:8080/api/sweets
   ```
   - Check **Headers** tab - should see `Cookie: authToken=...`
   - Should get 200 OK with sweets list

### Alternative: Use Authorization Header (If Cookies Don't Work)

If cookies continue to fail, you can modify the filter to also accept Bearer tokens:

1. In Postman, go to **Authorization** tab
2. Select **Bearer Token**
3. Paste your token

**Note:** This requires modifying the filter to check both cookies and Authorization header.

