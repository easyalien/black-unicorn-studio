# Black Unicorn Design Studio - Web Application Design Document

## Overview
A comprehensive Next.js web application for Black Unicorn Design Studio featuring a public landing page and private business administration system with role-based access control, user management, and advanced todo management capabilities.

## Design Analysis
Based on the provided design.png file, the brand identity includes:
- **Company Name**: Black Unicorn Design Studio
- **Tagline**: "Human centered, AI powered"
- **Logo**: Stylized black unicorn with flowing mane in black, gray, and white tones
- **Color Scheme**: Black primary, gray/slate secondary, white background
- **Typography**: 
  - **Primary Font**: Bold, geometric sans-serif (similar to Poppins Bold/Black or Montserrat ExtraBold)
  - **Secondary Font**: Clean, readable sans-serif for body text (Inter or Roboto)
  - **Characteristics**: Strong, thick letterforms with modern geometric structure
  - **Recommended Google Fonts**: 
    - Primary: "Poppins" (weights: 600, 700, 800, 900) for headings and company name
    - Secondary: "Inter" (weights: 400, 500, 600) for body text and UI elements

## Application Structure

### Public Landing Page
- Clean, minimalist design matching the brand aesthetic
- Prominent logo display (clickable for authentication)
- Company name and tagline
- Responsive design for desktop and mobile

### Authentication System
- Hidden authentication triggered by logo click
- Email and password login form
- No public registration option
- Session-based authentication

### Business Administration System
- **Role-Based Access Control**: Member and Superuser roles with appropriate permissions
- **User Management**: Superuser-only functionality for creating, editing, and managing user accounts
  - Personal information fields (First Name, Last Name, Title)
  - Role assignment and management
  - Sortable table interface with user statistics
- **Advanced Todo Management**: Comprehensive task tracking with public/private visibility
  - Category-based organization
  - Due date tracking with overdue indicators
  - Completion tracking with timestamps and user attribution
  - Public todos visible to all users, private todos only to creator
  - Sortable table interface with streamlined columns (Status, Title, Category, Due Date, Creator, Actions)
  - Interactive todo details popup with complete information display
  - Clickable todo titles for detailed view
- **Professional Interface**: Clean, consistent design with reusable AdminLayout component
  - Shared header and navigation across all admin pages
  - Consistent max-width containers and responsive layout
  - Modal popups for detailed information display

## User Flow
1. User visits landing page
2. Sees company branding and information
3. Clicking logo reveals authentication modal
4. Successful login redirects to business administration dashboard
5. **Member Role Users**: Access to todo management with public/private todo visibility
6. **Superuser Role Users**: Full access to user management, todo management, and all admin functions
7. Logout returns to landing page

## Key Features Implemented
- **Role-Based Access Control**: MEMBER and SUPERUSER enum roles with appropriate permissions
- **User Management System**: Complete CRUD operations for user accounts (Superuser-only)
  - Personal information management (firstName, lastName, title)
  - Role assignment capabilities
  - User creation with password hashing
  - Sortable table interface showing user statistics
- **Advanced Todo System**: Enhanced task management with comprehensive tracking
  - Public/private todo visibility system
  - Category-based organization
  - Due date management with overdue indicators
  - Completion tracking with timestamps and user attribution
  - Creator and completer user information
  - Streamlined sortable table interface
  - Interactive todo details popup with comprehensive information
  - Clickable titles for detailed view access
- **Component Architecture**: Reusable AdminLayout component for consistent admin page structure
  - Shared authentication handling and user context
  - Consistent header design with logo, navigation, and user controls
  - Standardized page layout and responsive design
- **Modern UI/UX**: Clean, professional interface with modal interactions

## Technical Stack
- **Framework**: Next.js 14+ with App Router and TypeScript
- **Styling**: Tailwind CSS with responsive design
- **Authentication**: Custom JWT implementation with HTTP-only cookies
- **Database**: PostgreSQL with Prisma ORM for type-safe operations
- **Security**: bcrypt password hashing, role-based access control
- **Deployment**: Vercel with Neon PostgreSQL database

## Database Schema
```sql
User {
  id          String   @id @default(cuid())
  email       String   @unique
  password    String
  firstName   String?
  lastName    String?
  title       String?
  role        UserRole @default(MEMBER)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  todos       Todo[]   @relation("TodoCreator")
  completedTodos Todo[] @relation("TodoCompleter")
}

Todo {
  id           String    @id @default(cuid())
  title        String
  description  String?
  category     String?
  completed    Boolean   @default(false)
  isPrivate    Boolean   @default(false)
  dueDate      DateTime?
  completedAt  DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  userId       String
  completedBy  String?
  user         User      @relation("TodoCreator", fields: [userId], references: [id], onDelete: Cascade)
  completedByUser User?  @relation("TodoCompleter", fields: [completedBy], references: [id])
}

enum UserRole {
  MEMBER
  SUPERUSER
}
```

## Component Architecture
- **AdminLayout**: Reusable layout component for all admin pages
  - Consistent header with logo, navigation, and user controls
  - Built-in authentication checking and loading states
  - Standardized page width and responsive design
- **Todo Details Modal**: Interactive popup for comprehensive todo information
  - Complete todo details display with organized sections
  - Status indicators and overdue warnings
  - Creator and completion tracking information
  - Responsive design with scroll support

## API Endpoints
- **Authentication**: `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`
- **Users**: `/api/users` (GET, POST), `/api/users/[id]` (PUT, DELETE) - Superuser only
- **Todos**: `/api/todos` (GET, POST), `/api/todos/[id]` (PUT, DELETE) - Role-based access