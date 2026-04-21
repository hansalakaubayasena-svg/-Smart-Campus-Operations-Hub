# Backend Integration Summary

## Overview
Successfully integrated comprehensive backend code from the source project (Smart Campus - Notification & User Management System) into the target project (Smart Campus Operations Hub).

## What Was Integrated

### 1. **Core Configuration** (`core/config/`)
- **AppConfig.java** - Spring Bean configuration for BCryptPasswordEncoder (cost factor 12)
- **CorsConfig.java** - CORS configuration supporting multiple origins
- **SecurityConfig.java** - Spring Security configuration with JWT and OAuth2 support
- **DataSeeder.java** - CommandLineRunner for seeding default admin user

### 2. **Exception Handling** (`core/exception/`)
- **CustomExceptions.java** - Custom exception classes with appropriate HTTP status codes:
  - ResourceNotFoundException (404)
  - ResourceConflictException (409)
  - BadRequestException (400)
  - ForbiddenException (403)
  - UnauthorizedException (401)
  - And others...
- **GlobalExceptionHandler.java** - Centralized exception handling with detailed error responses

### 3. **Utilities** (`core/util/`)
- **ApiResponse.java** - Standardized API response wrapper with success/error helpers
- **Constants.java** - Application constants (JWT_HEADER, JWT_PREFIX, roles)

### 4. **DTOs (Data Transfer Objects)**

#### Auth DTOs (`dto/auth/`)
- **LoginRequest.java** - Email and password validation for login
- **RegisterRequest.java** - Full name, email, password, and optional role
- **AuthResponse.java** - Standard auth response with token and user info
- **UpdateProfileRequest.java** - Profile update with optional password change
- **DeleteAccountRequest.java** - Account deletion confirmation

#### Notification DTOs (`dto/notifications/`)
- **NotificationResponse.java** - Notification with derived category field
- **SendNotificationRequest.java** - Admin notification sending with targeting options
- **UnreadCountResponse.java** - Simple unread count response

### 5. **Models**

#### Auth Model (`model/auth/`)
- **User.java** - Complete user entity with:
  - Enum-based roles (STUDENT, LECTURER, TECHNICIAN, MANAGER, ADMINISTRATOR)
  - Support for both manual and OAuth authentication
  - Timestamps for audit trail

#### Notifications Model (`model/notifications/`)
- **Notification.java** - Rich notification model with:
  - NotificationType enum (BOOKING_*, TICKET_*, GENERAL)
  - Reference fields for linking to bookings/tickets
  - Read/unread tracking
  - Creation timestamps

### 6. **Security** (`security/`)
- **JwtUtil.java** - JWT generation and validation with HS256 algorithm
- **JwtAuthFilter.java** - OncePerRequestFilter for JWT authentication on each request
- **CustomOAuth2UserService.java** - OAuth2 user provider integration (Google & GitHub)
- **OAuth2SuccessHandler.java** - OAuth2 success handler with JWT generation and redirect

### 7. **Services**

#### User Service (`service/auth/UserService.java`)
- User registration (manual + OAuth)
- User login
- Profile retrieval and updates
- Role management (admin only)
- Account deletion
- Password change with current password verification

#### Notification Service (`service/notifications/NotificationService.java`)
- User notification retrieval with pagination
- Mark as read / mark all as read
- Notification deletion
- Admin notification broadcasting (USER, SELECTED, ROLE, ALL targets)
- Admin notification management
- Integration method for other modules

### 8. **Repositories**

#### UserRepository (`repository/auth/UserRepository.java`)
- findByEmail() - Find user by email
- findByOauthProviderId() - Find OAuth user by provider ID
- findByRole() - Find all users with specific role
- existsByEmail() - Check email uniqueness

#### NotificationRepository (`repository/notifications/NotificationRepository.java`)
- User notification queries with ordering
- Admin filtered search
- Bulk mark-as-read operations

### 9. **Controllers**

#### UserController (`controller/auth/UserController.java`)
- **Public endpoints:**
  - POST `/api/users/register` - User registration
  - POST `/api/users/login` - User login
  - GET `/api/users/me` - Current user profile
  - PUT `/api/users/me` - Update own profile
  - DELETE `/api/users/me` - Delete own account
- **Admin endpoints:**
  - GET `/api/users` - List all users with optional role filter
  - GET `/api/users/{id}` - Get specific user
  - PUT `/api/users/{id}/role` - Update user role
  - DELETE `/api/users/{id}` - Delete user

#### NotificationController (`controller/notifications/NotificationController.java`)
- **User endpoints:**
  - GET `/api/notifications` - Get all notifications
  - GET `/api/notifications/bell` - Get last 5 for bell icon
  - GET `/api/notifications/unread-count` - Get unread count
  - PUT `/api/notifications/{id}/read` - Mark as read
  - PUT `/api/notifications/read-all` - Mark all as read
  - DELETE `/api/notifications/{id}` - Delete notification
- **Admin endpoints:**
  - POST `/api/notifications/send` - Send notifications to users/roles/all
  - GET `/api/notifications/admin/all` - View all with filters
  - PUT `/api/notifications/admin/{id}` - Edit notification
  - DELETE `/api/notifications/admin/{id}` - Delete any notification

### 10. **Configuration Files**

#### application.properties
- Database configuration (H2 for dev, MySQL for production)
- JWT settings (secret, expiration)
- CORS configuration
- OAuth2 provider configuration (Google, GitHub)
- H2 console enablement

#### .env.example
- Template for environment variables
- JWT_SECRET
- OAuth2 credentials
- Database configuration

#### pom.xml
**New dependencies added:**
- `spring-boot-starter-hateoas` - HATEOAS support
- `jjwt-api`, `jjwt-impl`, `jjwt-jackson` - JWT library (v0.12.3)

### 11. **Main Application**
- **ProjectApplication.java** - Updated to load .env file before Spring startup

## Directory Structure Created

```
backend/
├── src/main/java/com/paf/project/
│   ├── core/
│   │   ├── config/
│   │   │   ├── AppConfig.java
│   │   │   ├── CorsConfig.java
│   │   │   ├── SecurityConfig.java
│   │   │   └── DataSeeder.java
│   │   ├── exception/
│   │   │   ├── CustomExceptions.java
│   │   │   └── GlobalExceptionHandler.java
│   │   └── util/
│   │       ├── ApiResponse.java
│   │       └── Constants.java
│   ├── dto/
│   │   ├── auth/
│   │   │   ├── LoginRequest.java
│   │   │   ├── RegisterRequest.java
│   │   │   ├── AuthResponse.java
│   │   │   ├── UpdateProfileRequest.java
│   │   │   └── DeleteAccountRequest.java
│   │   └── notifications/
│   │       ├── NotificationResponse.java
│   │       ├── SendNotificationRequest.java
│   │       └── UnreadCountResponse.java
│   ├── model/
│   │   ├── auth/
│   │   │   └── User.java (updated)
│   │   └── notifications/
│   │       └── Notification.java (updated)
│   ├── security/
│   │   ├── JwtUtil.java
│   │   ├── JwtAuthFilter.java
│   │   ├── CustomOAuth2UserService.java
│   │   └── OAuth2SuccessHandler.java
│   ├── service/
│   │   ├── auth/
│   │   │   └── UserService.java
│   │   └── notifications/
│   │       └── NotificationService.java
│   ├── repository/
│   │   ├── auth/
│   │   │   └── UserRepository.java (updated)
│   │   └── notifications/
│   │       └── NotificationRepository.java (updated)
│   ├── controller/
│   │   ├── auth/
│   │   │   ├── AuthController.java (existing)
│   │   │   └── UserController.java (new)
│   │   └── notifications/
│   │       └── NotificationController.java (new)
│   ├── ProjectApplication.java (updated)
├── src/main/resources/
│   └── application.properties (updated)
├── .env.example (new)
└── pom.xml (updated)
```

## Key Features

### Authentication & Authorization
- JWT-based stateless authentication
- OAuth2 integration (Google & GitHub)
- Role-based access control (RBAC) with 5 roles
- Automatic user provisioning on first OAuth login
- Password encryption with BCrypt (cost 12)

### User Management
- Manual registration with email/password
- User profile management
- Role assignment (admin only)
- Account deletion with confirmation
- OAuth-only accounts (no password needed)

### Notifications System
- Real-time notification creation
- Unread count tracking
- Bulk notification sending (by user, role, or all)
- Read/unread status management
- Reference tracking (booking/ticket linking)
- Admin filtering and management

### API Standards
- RESTful design
- Consistent error responses with status codes
- HATEOAS support with links
- Validation error details
- Centralized exception handling

### Security
- CORS configuration for frontend
- JWT token validation on each request
- Method-level authorization (@PreAuthorize)
- SQL injection protection via JPA
- Password verification for sensitive operations

## Configuration Steps

### 1. Environment Variables
Create a `.env` file in the backend root (copy from `.env.example`):
```bash
cp .env.example .env
```

Generate a JWT secret:
```bash
python3 -c "import base64; import secrets; print(base64.b64encode(secrets.token_bytes(32)).decode())"
```

### 2. OAuth2 Setup (Optional)

**Google OAuth:**
1. Go to https://console.cloud.google.com/
2. Create OAuth 2.0 credentials (Web application)
3. Add redirect URI: `http://localhost:8080/login/oauth2/code/google`
4. Copy Client ID and Secret to `.env`

**GitHub OAuth:**
1. Go to https://github.com/settings/developers
2. Create new OAuth App
3. Set Authorization callback URL: `http://localhost:8080/login/oauth2/code/github`
4. Copy Client ID and Secret to `.env`

### 3. Run the Application
```bash
cd backend
mvn spring-boot:run
```

Application runs on `http://localhost:8080`

## Integration Points for Other Modules

### For Bookings Module
When a booking status changes, call:
```java
notificationService.notify(
    bookingUserId,
    NotificationType.BOOKING_APPROVED,
    "Your booking for Lab A has been approved",
    bookingId,
    "BOOKING"
);
```

### For Incidents/Tickets Module
When ticket status changes, call:
```java
notificationService.notify(
    ticketUserId,
    NotificationType.TICKET_RESOLVED,
    "Your ticket has been resolved",
    ticketId,
    "TICKET"
);
```

## Notes

- Default admin user is created automatically on first run:
  - Email: `admin@smartcampus.lk`
  - Password: `Admin123`

- JWT tokens expire after 24 hours by default
- All timestamps are stored in UTC
- Database uses H2 in-memory for development (auto-reset on restart)
- For production, switch to MySQL in `application.properties`

## Testing the API

### Register User
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Login User
```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Get Current User Profile
```bash
curl -X GET http://localhost:8080/api/users/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Notifications
```bash
curl -X GET http://localhost:8080/api/notifications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Troubleshooting

**Port 8080 already in use:**
```bash
# Find and kill process or change port in application.properties
server.port=8081
```

**JWT secret too short:**
- Ensure JWT_SECRET in .env is at least 256 bits (Base64 encoded)
- Use the provided command to generate a valid secret

**OAuth redirect not working:**
- Ensure redirect URIs in OAuth provider match your `application.properties`
- For development: `http://localhost:8080/login/oauth2/code/{provider}`

---

**Integration completed successfully!** All backend code is now properly integrated into your project structure.
