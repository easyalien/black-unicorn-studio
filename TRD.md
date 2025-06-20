# Technical Requirements Document (TRD)
## Black Unicorn Design Studio Web Application

### 1. Project Overview
**Objective**: Create a comprehensive Next.js web application with a public landing page and private business administration system featuring role-based access control, user management, and advanced todo management for Black Unicorn Design Studio.

### 2. Functional Requirements

#### 2.1 Landing Page
- **FR-001**: Display company logo, name, and tagline
- **FR-002**: Responsive design for desktop and mobile devices
- **FR-003**: Logo must be clickable to trigger authentication
- **FR-004**: Clean, professional design matching brand aesthetic

#### 2.2 Authentication System
- **FR-005**: Email and password authentication
- **FR-006**: No public account creation functionality
- **FR-007**: Authentication modal triggered by logo click
- **FR-008**: Session persistence for authenticated users with JWT tokens
- **FR-009**: Secure logout functionality with token invalidation
- **FR-010**: Role-based authentication with MEMBER and SUPERUSER roles

#### 2.3 Business Administration System
- **FR-011**: Dashboard with card-based navigation to different modules
- **FR-012**: Advanced Todo Management System
  - **FR-012a**: Create, read, update, delete business tasks with comprehensive tracking
  - **FR-012b**: Public/private todo visibility system (public visible to all, private only to creator)
  - **FR-012c**: Category-based organization and filtering
  - **FR-012d**: Due date management with overdue indicators
  - **FR-012e**: Completion tracking with timestamps and user attribution
  - **FR-012f**: Streamlined sortable table interface with essential columns
  - **FR-012g**: Interactive todo details popup with comprehensive information display
  - **FR-012h**: Clickable todo titles for detailed view access
- **FR-013**: User Management System (Superuser-only access)
  - **FR-013a**: Create, read, update, delete user accounts
  - **FR-013b**: Personal information management (firstName, lastName, title)
  - **FR-013c**: Role assignment and management (MEMBER/SUPERUSER)
  - **FR-013d**: Password management with secure hashing
  - **FR-013e**: User statistics tracking (todo counts)
  - **FR-013f**: Sortable table interface with user search and filtering
- **FR-014**: Role-Based Access Control
  - **FR-014a**: MEMBER role - Access to todo management only
  - **FR-014b**: SUPERUSER role - Full access to all admin functions
  - **FR-014c**: Page-level access restrictions based on user role
- **FR-015**: Client Management - Manage client relationships and contacts (Future)
- **FR-016**: Project Management - Manage client projects and deliverables (Future)
- **FR-017**: Settings - Configure application preferences (Future)
- **FR-018**: Reports & Analytics - Generate business reports and analytics (Future)
- **FR-019**: All business functions only accessible to authenticated users
- **FR-020**: Reusable Component Architecture
  - **FR-020a**: AdminLayout component for consistent admin page structure
  - **FR-020b**: Shared authentication handling and user context management
  - **FR-020c**: Modal components for detailed information display

### 3. Technical Requirements

#### 3.1 Frontend
- **TR-001**: Next.js 14+ with App Router
- **TR-002**: TypeScript for type safety
- **TR-003**: Tailwind CSS for styling with CSS custom properties
- **TR-004**: Google Fonts integration (Poppins for headings/brand, Inter for body text)
- **TR-005**: Responsive design (mobile-first approach)
- **TR-006**: Client-side routing for SPA experience
- **TR-007**: Reusable component architecture with shared layouts
- **TR-008**: Modal and popup components for enhanced user interactions
- **TR-009**: Clean, minimal design system documented in comprehensive style guide
- **TR-010**: Comprehensive test suite with Jest and React Testing Library for responsive design validation

#### 3.2 Authentication & Authorization
- **TR-011**: JWT tokens with HTTP-only cookies for session management
- **TR-012**: Secure password handling with bcrypt hashing (salt rounds: 12)
- **TR-013**: Authentication state management with user context
- **TR-014**: Route protection for authenticated pages
- **TR-015**: Role-based access control implementation
- **TR-016**: Superuser-only API endpoint protection
- **TR-017**: User role validation on both client and server side

#### 3.3 Data Management
- **TR-018**: PostgreSQL database for production with Neon hosting
- **TR-019**: Prisma ORM for type-safe database operations and migrations
- **TR-020**: Comprehensive database schema with User and Todo entities
- **TR-021**: User-Todo relational data with creator and completer tracking
- **TR-022**: API routes for CRUD operations across all business modules
- **TR-023**: Role-based data access control in API endpoints
- **TR-024**: Public/private todo visibility implementation
- **TR-025**: Client-side state management (React state/context) for UI state only
- **TR-026**: Form validation for authentication and business data inputs
- **TR-027**: Database indexing for optimal query performance

#### 3.4 Security
- **TR-028**: HTTPS enforcement in production
- **TR-029**: Input sanitization and validation on all endpoints
- **TR-030**: CSRF protection with HTTP-only cookies
- **TR-031**: Secure storage of authentication credentials in database
- **TR-032**: Password hashing with bcrypt (salt rounds: 12)
- **TR-033**: Environment variables for sensitive configuration
- **TR-034**: Role-based data access control with server-side validation
- **TR-035**: SQL injection prevention through Prisma ORM
- **TR-036**: XSS protection through proper data sanitization

#### 3.5 Testing
- **TR-037**: Comprehensive test suite using Jest and React Testing Library
- **TR-038**: Unit tests for responsive design and component functionality
- **TR-039**: Cross-viewport testing for mobile, tablet, and desktop breakpoints
- **TR-040**: Accessibility testing with proper semantic structure validation
- **TR-041**: 100% test coverage for critical user interface components

### 4. Non-Functional Requirements

#### 4.1 Performance
- **NFR-001**: Page load time < 3 seconds
- **NFR-002**: Lighthouse performance score > 90
- **NFR-003**: Optimized images and assets

#### 4.2 Usability
- **NFR-004**: Intuitive user interface
- **NFR-005**: Accessible design (WCAG 2.1 AA compliance)
- **NFR-006**: Cross-browser compatibility (Chrome, Firefox, Safari, Edge)

#### 4.3 Scalability
- **NFR-007**: Modular component architecture
- **NFR-008**: Easily extensible codebase
- **NFR-009**: Environment-based configuration

### 5. Technical Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Framework | Next.js | 14+ |
| Language | TypeScript | 5+ |
| Styling | Tailwind CSS | 3+ |
| Fonts | Google Fonts (Poppins, Inter) | Latest |
| Database | PostgreSQL (SQLite for dev) | Latest |
| ORM | Prisma | 5+ |
| Authentication | JWT + bcrypt | Latest |
| Testing | Jest + React Testing Library | Latest |
| Runtime | Node.js | 18+ |
| Package Manager | npm | Latest |
| Hosting | Vercel | Latest |
| Database Hosting | Neon PostgreSQL | Latest |

### 6. Project Structure
```
buds/
├── public/
│   ├── logo.png
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── logout/route.ts
│   │   │   │   └── me/route.ts
│   │   │   ├── todos/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   └── users/
│   │   │       ├── route.ts
│   │   │       └── [id]/route.ts
│   │   ├── page.tsx (landing page)
│   │   ├── admin/
│   │   │   ├── page.tsx (dashboard)
│   │   │   ├── todos/page.tsx (implemented)
│   │   │   ├── users/page.tsx (implemented - superuser only)
│   │   │   ├── clients/page.tsx (future)
│   │   │   ├── projects/page.tsx (future)
│   │   │   ├── settings/page.tsx (future)
│   │   │   └── reports/page.tsx (future)
│   │   └── layout.tsx
│   ├── components/
│   │   ├── AuthModal.tsx
│   │   └── AdminLayout.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts (User, Todo, UserRole interfaces)
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── __tests__/
│   ├── home.test.tsx
│   └── responsive.test.tsx
├── STYLE_GUIDE.md
├── jest.config.js
├── jest.setup.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

### 7. Development Phases

#### Phase 1: Setup and Landing Page
1. Initialize Next.js project with TypeScript
2. Configure Tailwind CSS
3. Implement landing page with logo and branding
4. Add responsive design

#### Phase 2: Authentication System
1. Create authentication modal component
2. Implement login functionality
3. Add session management
4. Create route protection

#### Phase 3: Business Administration System
1. Create dashboard with card-based navigation
2. Implement todo management with CRUD operations
3. Add database persistence with Prisma
4. Create modular admin page structure for future expansion

#### Phase 4: Typography and UI Polish
1. Integrate Google Fonts (Poppins for headings, Inter for body)
2. Implement CSS custom properties for flexible font management
3. Apply responsive design and visual hierarchy
4. Optimize performance and user experience

#### Phase 5: Testing and Quality Assurance
1. Implement comprehensive test suite with Jest and React Testing Library
2. Create responsive design tests for mobile, tablet, and desktop viewports
3. Add accessibility and component functionality tests
4. Achieve 100% test coverage for critical UI components

#### Phase 6: Deployment and Production
1. Configure Neon PostgreSQL database
2. Deploy to Vercel with environment variables
3. Set up domain pointing and SSL
4. Create production admin accounts

### 8. Success Criteria
- ✅ Landing page displays correctly on all devices with proper typography
- ✅ Logo click triggers authentication modal
- ✅ Valid credentials grant access to business administration system
- ✅ Dashboard provides card-based navigation to all business modules
- ✅ Role-based access control implemented (MEMBER/SUPERUSER roles)
- ✅ User Management system fully functional (Superuser-only access)
  - ✅ User CRUD operations with personal information fields
  - ✅ Role assignment and management capabilities
  - ✅ Sortable table interface with user statistics
- ✅ Advanced Todo Management system implemented
  - ✅ Public/private todo visibility system
  - ✅ Category-based organization and due date tracking
  - ✅ Completion tracking with user attribution and timestamps
  - ✅ Streamlined sortable table interface with essential columns
  - ✅ Interactive todo details popup with comprehensive information display
  - ✅ Clickable todo titles for detailed view access
- ✅ Session persists across page refreshes with JWT tokens
- ✅ Application is secure with bcrypt hashing and role-based access control
- ✅ Typography matches brand design with Poppins and Inter fonts
- ✅ Application deployed to production with Neon PostgreSQL database
- ✅ Modular architecture supports future business module expansion
- ✅ Comprehensive database schema with User-Todo relationships
- ✅ API endpoints secured with role-based authorization
- ✅ Reusable AdminLayout component for consistent admin page structure
- ✅ Modal components for enhanced user interactions and detailed information display
- ✅ Clean, minimal design system documented in comprehensive style guide
- ✅ Responsive design with proper mobile layout (heading breaks to two lines on small screens)
- ✅ Comprehensive test suite with 100% coverage for responsive design functionality
- ✅ Cross-viewport testing ensuring proper display on mobile, tablet, and desktop devices
- ✅ Accessibility compliance with proper semantic structure and ARIA attributes