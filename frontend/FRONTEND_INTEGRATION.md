# Smart Campus Operations Hub - Frontend

## ✅ Complete Frontend Integration

All frontend code has been successfully integrated into the project with proper directory structure and dependencies installed.

## Project Structure

```
frontend/
├── public/                  # Static assets
├── src/
│   ├── api/
│   │   └── axiosClient.js                    # Axios instance with interceptors
│   ├── components/
│   │   ├── Header.jsx                        # Top navigation bar
│   │   ├── Footer.jsx                        # Footer component
│   │   ├── auth/
│   │   │   └── ProtectedRoute.jsx            # Route guard with role checking
│   │   ├── user/
│   │   │   ├── UserLayout.jsx                # User dashboard layout
│   │   │   ├── UserSideBar.jsx               # User navigation sidebar
│   │   │   ├── UserProfilePanel.jsx          # Profile display
│   │   │   └── ProfileSettingsModal.jsx      # Edit profile modal
│   │   ├── admin/
│   │   │   ├── AdminLayout.jsx               # Admin dashboard layout
│   │   │   └── AdminSideBar.jsx              # Admin navigation
│   │   ├── notifications/
│   │   │   └── NotificationBell.jsx          # Bell icon with unread count
│   │   ├── bookings/                         # Booking components
│   │   ├── facilities/                       # Facility components
│   │   └── incidents/                        # Incident components
│   ├── context/
│   │   └── AuthContext.jsx                   # Global auth state management
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx                 # Login page
│   │   │   ├── SignupPage.jsx                # Registration page
│   │   │   └── AuthCallbackPage.jsx          # OAuth callback handler
│   │   ├── home/
│   │   │   └── HomePage.jsx                  # Landing page
│   │   ├── user/
│   │   │   └── UserDashboard.jsx             # User dashboard
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx            # Admin dashboard
│   │   │   ├── UserManagementPage.jsx        # User management interface
│   │   │   └── NotificationPage.jsx          # Admin notification management
│   │   ├── notifications/
│   │   │   └── UserNotificationsPage.jsx     # User notifications list
│   │   ├── bookings/                         # Booking pages
│   │   ├── facilities/                       # Facility pages
│   │   └── incidents/                        # Incident pages
│   ├── services/
│   │   ├── auth/
│   │   │   ├── authApi.js                    # Login, register, OAuth
│   │   │   └── userApi.js                    # Profile management
│   │   ├── notifications/
│   │   │   └── notificationApi.js            # Notification operations
│   │   ├── admin/
│   │   │   └── adminApi.js                   # User management APIs
│   │   ├── bookings/                         # Booking service APIs
│   │   ├── facilities/                       # Facility service APIs
│   │   └── incidents/                        # Incident service APIs
│   ├── store/
│   │   └── authStore.js                      # Auth state hook
│   ├── App.jsx                               # Main app with routing
│   ├── App.css                               # App styles
│   ├── main.jsx                              # Entry point
│   └── index.css                             # Global styles
├── index.html                                # HTML template
├── package.json                              # Dependencies
├── vite.config.js                            # Vite configuration
├── tailwind.config.js                        # Tailwind CSS config
├── eslint.config.js                          # ESLint rules
└── .gitignore                                # Git ignore patterns
```

## Key Features Integrated

### 1. **Authentication System**
- ✅ Login page with email/password
- ✅ Registration page with user details
- ✅ OAuth2 integration (Google & GitHub)
- ✅ JWT token management
- ✅ Session restoration on app reload
- ✅ Protected routes with role-based access

### 2. **User Dashboard**
- ✅ User profile display
- ✅ Edit profile modal
- ✅ Notification center
- ✅ Sidebar navigation
- ✅ Logout functionality

### 3. **Admin Dashboard**
- ✅ Admin-only access control
- ✅ User management interface
- ✅ Notification broadcasting
- ✅ Admin sidebar
- ✅ Dashboard statistics

### 4. **Notification System**
- ✅ Real-time notification bell
- ✅ Unread count display
- ✅ Mark as read functionality
- ✅ Notification list page
- ✅ Admin notification sending

### 5. **API Integration**
- ✅ Axios client with interceptors
- ✅ Automatic JWT token injection
- ✅ Global 401 error handling
- ✅ Base URL: `http://localhost:8080`

### 6. **Global State Management**
- ✅ AuthContext for user state
- ✅ useAuthStore hook
- ✅ Persistent login (localStorage)
- ✅ Role-based access

## Dependencies Installed

```
Core:
- react@19.2.0
- react-dom@19.2.0
- react-router-dom@7.13.1

UI & Styling:
- tailwindcss@4.2.1
- clsx@2.1.1
- lucide-react@0.577.0

API & Auth:
- axios@1.13.6
- jwt-decode@4.0.0
- @react-oauth/google@0.13.4

Development:
- vite@7.3.1
- eslint@9.39.1
- @vitejs/plugin-react@5.1.1
```

## Running the Frontend

### Development Mode
```bash
cd frontend
npm run dev
```
Frontend starts on `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Linting
```bash
npm run lint
```

## API Endpoints Connected

### Auth
- POST `/api/users/register` - Register new user
- POST `/api/users/login` - Login user
- POST `/oauth2/authorization/google` - Google OAuth
- POST `/oauth2/authorization/github` - GitHub OAuth
- GET `/api/users/me` - Get current user
- PUT `/api/users/me` - Update profile
- DELETE `/api/users/me` - Delete account

### Notifications
- GET `/api/notifications` - List user notifications
- GET `/api/notifications/bell` - Last 5 notifications
- GET `/api/notifications/unread-count` - Unread count
- PUT `/api/notifications/{id}/read` - Mark as read
- PUT `/api/notifications/read-all` - Mark all as read
- DELETE `/api/notifications/{id}` - Delete notification
- POST `/api/notifications/send` - Send notification (admin)
- GET `/api/notifications/admin/all` - All notifications (admin)
- PUT `/api/notifications/admin/{id}` - Edit notification (admin)
- DELETE `/api/notifications/admin/{id}` - Delete notification (admin)

### User Management (Admin)
- GET `/api/users` - List users
- GET `/api/users/{id}` - Get user by ID
- PUT `/api/users/{id}/role` - Assign role
- DELETE `/api/users/{id}` - Delete user

## Environment Configuration

The frontend is configured to connect to:
- Backend: `http://localhost:8080`
- Frontend Dev Server: `http://localhost:5173`

### CORS Setup
Backend is configured with CORS for:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (alternative dev port)

## Authentication Flow

1. User visits home page
2. Click "Get Started" or navigate to `/login`
3. Enter credentials or use OAuth
4. JWT token stored in localStorage
5. Token automatically attached to all API requests
6. Dashboard loads based on user role
7. Token validated on app refresh
8. 401 response = auto logout and redirect to login

## Key Components Explained

### ProtectedRoute
- Checks if user is authenticated
- Validates user role
- Shows loading spinner during auth check
- Redirects unauthorized users

### AuthContext
- Global auth state
- Restores session on app load
- Provides login/logout functions
- Role-based access control

### Axios Interceptors
- Request: Adds JWT token to all requests
- Response: Catches 401 errors and logs out

## Testing the Integration

1. **Start Backend**: `java -jar backend/target/project-0.0.1-SNAPSHOT.jar`
2. **Start Frontend**: `npm run dev`
3. **Visit**: `http://localhost:5173`
4. **Test Flow**:
   - Go to `/signup` - Register new account
   - Go to `/login` - Login
   - Access `/user/dashboard` - User features
   - Try `/admin/dashboard` - Admin features (if admin)

## Next Steps

1. ✅ Backend running on port 8080
2. ✅ Frontend installed and ready
3. ⏳ Start frontend dev server: `npm run dev`
4. ⏳ Test login/signup flow
5. ⏳ Test notifications
6. ⏳ Test admin features (if admin)

## Notes

- All pages are properly routed
- All API services configured
- Global error handling in place
- Loading states implemented
- Responsive design with Tailwind CSS
- ESLint configured for code quality

---

**Status**: ✅ COMPLETE - Frontend fully integrated and ready to run!
