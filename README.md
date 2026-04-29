
# Smart Campus Operations Hub

## Project Description
Smart Campus Operations Hub is a full-stack web platform designed for university operations management. It enables efficient handling of facility and asset bookings, maintenance and incident ticketing, and real-time notifications, all secured with robust authentication and role-based access control. The system is modular, scalable, and production-inspired, supporting both manual and OAuth-based user flows.

## Technology Stack
- **Backend:** Java (Spring Boot) REST API
- **Frontend:** React (Vite, Tailwind CSS)
- **Database:** MySQL / PostgreSQL / MongoDB (configurable)
- **Authentication:** OAuth 2.0 (Google, GitHub), JWT
- **CI/CD:** GitHub Actions

---

## Module Overview & Functionalities

### 1. Facilities & Assets Catalogue
**Backend:**
- Manage bookable resources (lecture halls, labs, equipment)
- Store and update metadata (type, capacity, location, status)
- REST endpoints for search, filter, and CRUD operations

**Frontend:**
- Facility catalogue UI with advanced search/filter
- Facility details and status display
- Admin forms for adding/editing facilities

### 2. Booking Management
**Backend:**
- Booking request workflow (PENDING → APPROVED/REJECTED/CANCELLED)
- Prevent scheduling conflicts
- Endpoints for booking creation, approval, cancellation, and history

**Frontend:**
- Booking forms and calendar views
- User booking history and status tracking
- Admin dashboard for booking approvals

### 3. Maintenance & Incident Ticketing
**Backend:**
- Incident ticket creation with image attachments
- Ticket workflow (OPEN → IN_PROGRESS → RESOLVED → CLOSED)
- Technician assignment and resolution notes

**Frontend:**
- Ticket submission forms (with image upload)
- Ticket status tracking and updates
- Technician/admin interface for ticket management

### 4. Notifications
**Backend:**
- Real-time notification system (booking/ticket status, admin broadcasts)
- Unread/read tracking, notification deletion
- Admin notification broadcasting (to users, roles, or all)

**Frontend:**
- Notification bell with unread count
- Notification panel and list views
- Mark as read, delete, and admin send notification UI

### 5. Authentication & Authorization
**Backend:**
- OAuth 2.0 (Google, GitHub) and manual registration/login
- JWT-based session management
- Role-based access control (USER, ADMIN, TECHNICIAN, etc.)

**Frontend:**
- Login, registration, and OAuth flows
- Protected routes and role-based UI
- Profile management and account deletion

---

## Repository Structure
- `/backend`: Spring Boot REST API (see BACKEND_INTEGRATION_SUMMARY.md for details)
- `/frontend`: React frontend (see FRONTEND_INTEGRATION.md for details)
- `/.github`: GitHub Actions workflows
- `/docs`: Project documentation and reports

---
*Each module is implemented with at least four REST API endpoints and corresponding UI components.*

## Group Member Allocation

### Member 1: Facilities & Assets Catalogue
- **Module A: Facilities & Assets Catalogue**
- Maintain bookable resources (lecture halls, labs, equipment).
- Manage metadata (type, capacity, location, status).
- Implement search and filtering functionalities.

### Member 2: Booking Management
- **Module B: Booking Management**
- Booking request workflow (PENDING → APPROVED/REJECTED/CANCELLED).
- Scheduling conflict prevention.
- Admin review/approval interface.

### Member 3: Maintenance & Incident Ticketing
- **Module C: Maintenance & Incident Ticketing**
- Incident ticket creation with image attachments (up to 3).
- Ticket workflow (OPEN → IN_PROGRESS → RESOLVED → CLOSED).
- Technician assignment and resolution notes.

### Member 4: Notifications & Security
- **Module D: Notifications**
- Booking and ticket status change notifications.
- Accessible notification panel in Web UI.
- **Module E: Authentication & Authorization**
- OAuth 2.0 integration (Google Sign-in).
- Role-based Access Control (USER, ADMIN, TECHNICIAN, etc.).

## Repository Structure
- `/backend`: Spring Boot REST API
- `/frontend`: React Frontend
- `/.github`: GitHub Actions workflows
- `/docs`: Project documentation and reports

---
*Note: Each member must implement at least four (4) REST API endpoints and their corresponding UI components.*
