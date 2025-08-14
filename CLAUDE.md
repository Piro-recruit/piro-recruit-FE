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

- `src/pages/`: Main application pages (Main, Application, Admin pages)
- `src/components/`: Reusable components organized by domain (common, layout)
- `src/services/`: API services and HTTP client configuration
- `src/constants/`: Application constants (routes, recruitment configs)
- `src/data/`: Mock data for development (transitioning to API integration)
- `src/context/`: React context providers for state management
- `src/hooks/`: Custom React hooks
- `src/styles/`: Global styles (reset, fonts, colors)
- `src/utils/`: Utility functions (evaluation, sorting)

## Key Application Areas

### Public Routes
- **MainPage** (`/`): Landing page
- **ApplicationPage** (`/apply`): Job application form with Layout wrapper

### Admin Routes
- **AdminLoginPage** (`/admin`): Admin authentication
- **RecruitingManagePage** (`/admin/recruiting`): Dashboard for managing applications
- **RecruitingDetailPage** (`/admin/recruiting/:id`): Detailed view of individual applications

## Data Management

Currently uses mock data (`src/data/mockData.js`) for applicant information including:
- Basic applicant details (name, email, university, skills)
- AI evaluation scores and summaries
- Application status tracking
- Detailed application responses

## Key Constants

- **RECRUITMENT_CONFIG**: Application limits, pagination, cutlines
- **RECRUITMENT_STATUS**: Active, inactive, pending states
- **APPLICANT_STATUS**: Reviewing, passed, failed states
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

The application connects to backend APIs for recruitment management. Full API specification is available in `api-spec.json`.

### Core API Categories
- **Admin APIs**: Authentication, user management, JWT token handling
- **AI Summary APIs**: Application analysis and scoring
- **Google Form APIs**: Form management and statistics
- **Mail APIs**: Single and bulk email sending
- **Mail Subscriber APIs**: Subscriber management with pagination
- **Webhook Application APIs**: Application data handling and status tracking

### Key API Endpoints (Most Used)
- **POST** `/api/ai-summary/analyze` - Analyze application data
- **POST** `/mail/bulk` - Send bulk emails to all subscribers
- **POST** `/mail/subscribers` - Register new email subscriber
- **GET** `/mail/subscribers/count` - Get total subscriber count
- **GET** `/api/webhook/applications` - Get all applications
- **GET** `/api/webhook/applications/form-id/{formId}` - Get applications by form

### API Response Format
```javascript
// Success Response
{
  "success": true,
  "data": {...},
  "message": "Success message",
  "status": 200,
  "code": "SUCCESS",
  "time": "2024-01-01T10:00:00"
}

// Error Response
{
  "success": false,
  "data": null,
  "message": "Error message", 
  "status": 400,
  "code": "BAD_REQUEST",
  "time": "2024-01-01T10:00:00"
}
```

## HTTP Client Configuration

The application uses Axios with a centralized configuration in `src/services/api.js`:
- Base URL: `http://localhost:8080` for backend API
- 30-second timeout for all requests
- Request/response interceptors for logging and error handling
- Prepared for future authentication token integration
- Common error handling for 401 (authentication) and 500 (server) errors

## Development Notes

- Backend integration in progress (transitioning from mock data)
- ESLint configured with React hooks and refresh plugins
- Vite configured with asset chunking and file naming strategies
- Branch-based development workflow
- Current services: `api.js` (HTTP client), `mailService.js` (email functionality)
- Mock data still used in some components during API transition