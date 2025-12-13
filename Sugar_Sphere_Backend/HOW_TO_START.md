# How to Start the Spring Boot Application

## Prerequisites

1. **Java 17** - Make sure Java 17 is installed
   ```bash
   java -version
   ```

2. **Maven** - Make sure Maven is installed (or use the Maven wrapper)
   ```bash
   mvn -version
   ```

3. **MongoDB** - Make sure MongoDB is running on `localhost:27017`
   - Check if MongoDB is running:
     ```bash
     # Windows
     net start MongoDB
     
     # Or check if the service is running
     services.msc
     ```

## Steps to Start the Application

### Option 1: Using Maven Wrapper (Recommended)

**Windows:**
```bash
.\mvnw.cmd spring-boot:run
```

**Linux/Mac:**
```bash
./mvnw spring-boot:run
```

### Option 2: Using Maven (if installed)

```bash
mvn spring-boot:run
```

### Option 3: Using IDE (IntelliJ IDEA / Eclipse / VS Code)

1. **IntelliJ IDEA:**
   - Right-click on `SugarSphereBackendApplication.java`
   - Select "Run 'SugarSphereBackendApplication.main()'"

2. **Eclipse:**
   - Right-click on the project
   - Run As → Spring Boot App

3. **VS Code:**
   - Open the Java file
   - Click "Run" button or press F5

### Option 4: Build and Run JAR

```bash
# Build the project
mvn clean package

# Run the JAR
java -jar target/Sugar_Sphere_Backend-0.0.1-SNAPSHOT.jar
```

## Verify Application is Running

Once started, you should see:
```
Started SugarSphereBackendApplication in X.XXX seconds
```

You can verify by:
1. Opening browser: `http://localhost:8080` (might show error, but connection works)
2. Check logs for: "Tomcat started on port(s): 8080"

## Common Issues and Solutions

### Issue 1: Port 8080 Already in Use

**Error:** `Port 8080 is already in use`

**Solution:**
- Change port in `application.properties`:
  ```
  server.port=8081
  ```
- Or kill the process using port 8080:
  ```bash
  # Windows
  netstat -ano | findstr :8080
  taskkill /PID <PID> /F
  
  # Linux/Mac
  lsof -ti:8080 | xargs kill
  ```

### Issue 2: MongoDB Connection Failed

**Error:** `Cannot connect to MongoDB`

**Solution:**
1. Make sure MongoDB is running:
   ```bash
   # Windows
   net start MongoDB
   
   # Check MongoDB status
   mongosh
   ```

2. Verify MongoDB URI in `application.properties`:
   ```
   spring.data.mongodb.uri=mongodb://localhost:27017/Sweet_Sphere
   ```

3. If MongoDB is on a different port, update the URI

### Issue 3: Java Version Mismatch

**Error:** `Unsupported class file major version`

**Solution:**
- Make sure Java 17 is installed and set as JAVA_HOME
- Check Java version: `java -version`
- Should show: `openjdk version "17"` or similar

### Issue 4: Maven Dependencies Not Downloaded

**Error:** `Could not resolve dependencies`

**Solution:**
```bash
# Clean and download dependencies
mvn clean install

# Or force update
mvn clean install -U
```

### Issue 5: Security Configuration Errors

**Error:** `Bean creation failed` or security-related errors

**Solution:**
- Make sure `SecurityConfig.java` is in the correct package
- Check that all imports are correct
- Restart the application

## Testing After Startup

Once the application is running, test with Postman:

1. **Register User:**
   ```
   POST http://localhost:8080/api/auth/register
   ```

2. **Login:**
   ```
   POST http://localhost:8080/api/auth/login
   ```

## Application Logs

Watch the console for:
- ✅ `Filter Started.` - Authentication filter loaded
- ✅ `Started SugarSphereBackendApplication` - Application ready
- ✅ `Tomcat started on port(s): 8080` - Server listening

If you see errors, check:
- MongoDB connection
- Missing dependencies
- Configuration issues

