# Smart Campus Operations Hub - IT3030 Assignment 2026

## Project Overview
A production-inspired web system for a real-world business scenario for a university. This platform manages facility and asset bookings, maintenance/incident handling, and features role-based access control with strong auditability.

## Technology Stack
- **Backend:** Java (Spring Boot) REST API
- **Frontend:** React-based client web application
- **Database:** MySQL/PostgreSQL/MongoDB (Choice to be finalized)
- **Authentication:** OAuth 2.0 (Google Sign-in)
- **CI/CD:** GitHub Actions

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
