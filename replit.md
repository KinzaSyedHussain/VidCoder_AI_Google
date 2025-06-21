# VidCoder AI

## Overview

This is a full-stack web application that allows users to upload content files (videos, images, PDFs) containing programming code and extract, refine, and download the code using AI processing. The application features a clean, modern React frontend with a Flask backend, designed for seamless user interaction and file processing workflows.

## System Architecture

The application follows a client-server architecture with clear separation of concerns:

- **Frontend**: React with Vite build system, styled with Tailwind CSS and shadcn/ui components
- **Backend**: Python Flask server for API endpoints and file handling
- **Database**: PostgreSQL with Drizzle ORM for data persistence
- **File Storage**: Local file system with multer for upload handling
- **Development Environment**: Configured for Replit with hot reloading and development workflows

## Key Components

### Frontend Architecture
- **React SPA**: Single-page application using Wouter for client-side routing
- **Component Library**: Comprehensive shadcn/ui component system with Radix UI primitives
- **State Management**: React Query (TanStack Query) for server state management
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite with TypeScript support and development optimizations

### Backend Architecture
- **Flask Server**: RESTful API with Python
- **File Upload**: Flask file handling with python-multipart for multipart uploads
- **Storage Strategy**: In-memory storage with local file system for uploads
- **Development Tools**: Python with Flask development server and hot reloading

### Database Schema
Three main entities managed through Drizzle ORM:
- **Users**: Basic user management with username/password authentication
- **Files**: File metadata including original name, file name, MIME type, size, and upload timestamp
- **Code Extractions**: Extracted code content with language detection, improvement status, and processing metadata

## Data Flow

1. **File Upload**: Users drag/drop or select files through the React frontend
2. **File Validation**: Frontend validates file type and size before upload
3. **Upload Processing**: Backend receives file via multer, stores to filesystem, creates database record
4. **Code Extraction**: AI processing extracts code from uploaded content (currently mock implementation)
5. **Code Improvement**: Secondary AI processing refines the extracted code
6. **Download**: Users can download the final processed code

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React 18 with TypeScript support
- **Component Library**: Comprehensive Radix UI primitives (@radix-ui/*)
- **Styling**: Tailwind CSS with class-variance-authority for component variants
- **State Management**: TanStack React Query for server state
- **Form Handling**: React Hook Form with Zod resolvers for validation
- **Date Handling**: date-fns for date manipulation
- **Icons**: Lucide React for consistent iconography

### Backend Dependencies
- **Runtime**: Python with Flask framework
- **File Handling**: python-multipart for multipart uploads, werkzeug for file utilities
- **Storage**: In-memory storage implementation
- **CORS**: flask-cors for cross-origin requests
- **Development**: Flask development server with debug mode

### Build and Development Tools
- **Build System**: Vite with React plugin and TypeScript support
- **TypeScript**: Full type safety across frontend and backend
- **Database Migrations**: Drizzle Kit for schema management
- **Code Quality**: ESBuild for production bundling

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

### Development Mode
- **Frontend**: Vite build serves static files through Flask
- **Backend**: Python Flask server with debug mode and auto-reload
- **Storage**: In-memory storage for development
- **Port Configuration**: Flask serves on port 5000, serving both API and static frontend

### Production Build
- **Frontend**: Vite builds static assets to dist/public
- **Backend**: ESBuild bundles server code to dist/index.js
- **Deployment**: Autoscale deployment target with npm build/start scripts
- **Static Serving**: Express serves built frontend assets in production

### Environment Configuration
- **Database**: Automatic DATABASE_URL provisioning through Replit
- **File Storage**: Local uploads directory with gitignore exclusion
- **Session Management**: PostgreSQL-backed sessions for user state

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

## Recent Changes

- June 21, 2025: Initial setup with React frontend and Express backend
- June 21, 2025: UI refinements and rebrand to "VidCoder AI"
  - Removed workflow progress bar for cleaner interface
  - Increased file upload limit to 200MB
  - Enhanced placeholder AI logic with more realistic code extraction and improvement
  - Fixed TypeScript compilation errors
  - Updated branding throughout application
- June 21, 2025: Complete conversion from Node.js to Python Flask
  - Converted entire backend from Express.js/TypeScript to Python Flask
  - Maintained identical UI and functionality
  - Preserved all API endpoints and response formats
  - Updated deployment configuration for Python runtime