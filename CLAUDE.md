# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Lint code**: `npm run lint`
- **Preview production build**: `npm run preview`

## Project Overview

This is a React-based recruitment management system for Pirogramming, built with Vite. The application handles job applicant management with both public and admin interfaces.

## Architecture & Technology Stack

- **Framework**: React 19.1.0 with Vite 7.0.4
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios with interceptors for request/response handling
- **Styling**: CSS modules with custom CSS variables
- **Icons**: Lucide React
- **Development**: ESLint with React-specific configurations
- **Deployment**: Netlify (configured with security headers and MIME type handling)

## Project Structure

The application follows a standard React project structure:

- `src/pages/`: Main application pages (MainPage, AdminLoginPage, RecruitingManagePage, RecruitingDetailPage)
- `src/components/`: Reusable components organized by domain
  - `common/`: Shared UI components (Button, Modal, forms)
  - `layout/`: Layout components (Header, Layout)
  - `auth/`: Authentication components (ProtectedRoute)
  - `recruiting/`: Recruiting-specific components (ApplicantCard, evaluation forms)
- `src/services/`: API services and HTTP client configuration
- `src/constants/`: Application constants (routes, recruitment configs)
- `src/data/`: Mock data for development (transitioning to API integration)
- `src/styles/`: Global styles (reset, fonts, colors, utilities)
- `src/utils/`: Utility functions (evaluation, sorting, CSV export)

## Key Application Areas

### Public Routes
- **MainPage** (`/`): Landing page with recruitment information and application links

### Admin Routes (Protected)
All admin routes require authentication via the ProtectedRoute component:
- **AdminLoginPage** (`/admin`): Admin authentication with login code
- **RecruitingManagePage** (`/admin/recruiting`): Main dashboard for managing applications
  - View applicant statistics and filtering options
  - Bulk actions for pass/fail status updates
  - CSV export functionality
  - Admin account management
- **RecruitingDetailPage** (`/admin/recruiting/:id`): Detailed view of individual applications
  - Full application data display
  - Individual pass status updates
  - AI evaluation integration

## Data Management

The application integrates with backend APIs for real-time data management:
- **Live Application Data**: Retrieved from Google Forms via webhook integration
- **Pass Status Tracking**: Admin-controlled application evaluation states (PENDING, PASS, FAIL)
- **Google Forms Integration**: Dynamic form creation, activation, and management
- **Statistics and Analytics**: Real-time applicant statistics and form-specific metrics
- **CSV Export**: Comprehensive export functionality for applicants and admin data

Mock data (`src/data/mockData.js`) available for development and testing purposes.

## Key Constants

- **RECRUITMENT_CONFIG**: Application limits, pagination, cutlines
- **RECRUITMENT_STATUS**: Active, inactive, pending states
- **APPLICANT_STATUS**: PENDING, PASS, FAIL states for application evaluation
- **SORT_OPTIONS**: Various sorting methods for applicant lists

## Styling Approach

Uses a combination of:
- Global CSS reset and base styles
- CSS custom properties for colors and fonts
- Component-specific CSS files co-located with JSX files
- Consistent styling patterns across admin and public interfaces

## Deployment Configuration

Netlify deployment with:
- Security headers (X-Frame-Options, X-XSS-Protection, Referrer-Policy)
- Proper MIME type configuration for JS/CSS assets
- SPA routing support with fallback to index.html
- Asset optimization and caching strategies

## API Specifications

The application connects to backend APIs for recruitment management. Full API specifications are available in `api-spec.md` and individual API files in the `/api` directory.

### Core API Categories
- **Admin APIs**: Authentication, user management, JWT token handling, pass status management
- **Google Form APIs**: Form creation, activation, URL management, generation tracking
- **Webhook Application APIs**: Application data retrieval, statistics, form-specific queries
- **Integration APIs**: CSV export for applicants and admin data
- **Mail APIs**: Single and bulk email sending
- **Mail Subscriber APIs**: Subscriber management with pagination
- **AI Summary APIs**: Application analysis and scoring

### Key API Endpoints (Most Used)
- **POST** `/api/admin/login` - Admin authentication with login code
- **GET** `/api/google-forms/active` - Get currently active Google Forms
- **GET** `/api/webhook/applications` - Get all applications
- **GET** `/api/webhook/applications/google-form/{id}` - Get applications by Google Form
- **PUT** `/api/admin/applications/{id}/pass-status` - Update application pass status
- **GET** `/api/integration/export/applicants/csv` - Export applicants as CSV
- **POST** `/api/admin/general/batch` - Create multiple admin accounts

### API Response Format
```javascript
// Success Response
{
  "success": true,
  "data": {...},
  "message": "Success message",
  "status": 200,
  "code": 0,
  "time": "2025-01-15T10:30:00"
}

// Error Response  
{
  "success": false,
  "data": null,
  "message": "Error message",
  "status": 400,
  "code": 2201,
  "time": "2025-01-15T10:30:00"
}

// Authentication Response
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

## HTTP Client Configuration

The application uses Axios with a centralized configuration in `src/services/api.js`:
- Base URL: `https://localhost:8080` for backend API (configurable via API_BASE_URL constant)
- 30-second timeout for all requests
- Request/response interceptors for comprehensive logging and error handling
- JWT token automatically added to authenticated requests
- Advanced error handling including Blob response parsing and CSV export considerations
- Automatic token cleanup and logout on authentication failures

## Authentication System

The application uses a dual authentication approach:

### Admin Authentication
- **Login-code based authentication**: Admins use login codes to authenticate
- **JWT token management**: Access and refresh tokens stored in localStorage
- **Multi-admin system**: Support for creating and managing multiple admin accounts
- **Token expiration handling**: Automatic logout on token expiration
- **Protected routes**: Admin pages require authentication via ProtectedRoute component

### Authentication Flow
1. Admin enters login code on `/admin`
2. System exchanges login code for JWT tokens via `/api/admin/login`
3. Tokens stored in localStorage (accessToken, refreshToken, expiresIn)
4. API client automatically adds Bearer token to authenticated requests
5. Automatic logout and redirect on 401 responses

### Admin Management Features
- Create multiple general admin accounts with expiration dates
- View all admin accounts via CSV export
- Delete expired or all admin accounts
- API key exchange for alternative authentication

## Component Architecture

The project follows a strict component organization strategy based on usage patterns and domain separation:

### Component Categories
- **`common/`**: App-wide reusable UI components (Button, Modal, Pagination) - must be used in 3+ different features
- **`layout/`**: Structural components for page layout (Header, Footer, NavigationHeader, HeroSection)
- **`recruiting/`**: Domain-specific components with business logic
  - `applicant/`: ApplicantCard, ApplicantFilters, ApplicantModal
  - `evaluation/`: EvaluationForm
  - `stats/`: StatsSection
- **`pages/`**: Page-specific components with low reusability
  - Each page has its own subdirectory with `detail/` and `modals/` subfolders
- **`admin/`**: Admin-only components (AdminHeader)
- **`auth/`**: Authentication components (ProtectedRoute)

### Component Placement Decision Flow
1. Used in 3+ features? → `common/`
2. Layout/structural element? → `layout/`
3. Recruiting domain related? → `recruiting/` (with appropriate subdirectory)
4. Admin-only? → `admin/`
5. Authentication related? → `auth/`
6. Page-specific? → `pages/[PageName]/`

### CSS Naming Conventions
- **BEM methodology**: `.component-name__element--modifier`
- **Component prefixes**: Each component uses kebab-case naming
- **Modular CSS**: Component-specific CSS files co-located with JSX
- **CSS splitting**: Large CSS files split into logical modules (BaseModal.css, EmailModal.css, etc.)

## API Architecture

Centralized API management with domain-based organization:

### Service Structure
- **`api/core/`**: Core HTTP client configuration (`apiClient.js`)
- **`api/domains/`**: Domain-specific API modules
  - `admin/`: Authentication, user management, Google Forms APIs
  - `applications/`: Application data and status management
  - `evaluation/`: AI summary and evaluation APIs
  - `integration/`: CSV export and bulk operations
  - `mail/`: Email sending and subscriber management

### HTTP Client Features
- Automatic JWT token injection for authenticated requests
- Request/response logging via custom logger utility
- Blob response error handling for CSV exports
- 30-second timeout with automatic token cleanup on 401 responses
- Base URL: `http://localhost:8080` (configurable via API_BASE_URL)

## Modular CSS Architecture

Large CSS files are systematically split into logical modules:
- **Base styles**: Core modal, button, and layout styles
- **Feature-specific**: Email modals, application modals, evaluation forms
- **Responsive**: Dedicated responsive CSS modules for different breakpoints
- **Animations**: Separated animation definitions
- **Import structure**: Main CSS files use `@import` to include modular components

## Development Notes

- Backend fully integrated with comprehensive API coverage
- ESLint configured with React hooks and refresh plugins
- Vite configured with asset chunking and file naming strategies for optimal builds
- Branch-based development workflow
- Comprehensive logging system with environment-based log levels
- Google Forms integration for recruitment management
- CSV export functionality for applicant and admin data
- Component architecture follows strict domain separation and reusability patterns