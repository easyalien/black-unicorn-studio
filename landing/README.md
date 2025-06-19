# Black Unicorn Design Studio

A Next.js web application for Black Unicorn Design Studio featuring a clean landing page and private todo management system.

## Features

- **Landing Page**: Professional display of company branding and information
- **Hidden Authentication**: Email/password login triggered by clicking the company logo
- **Todo Management**: Private business todo list accessible only to authenticated users
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (PostgreSQL for production)
- **ORM**: Prisma
- **Authentication**: JWT-based session management with bcrypt password hashing

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/easyalien/black-unicorn-studio.git
cd black-unicorn-studio
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Initialize the database
```bash
npx prisma migrate dev
```

5. Create an admin account
```bash
npm run db:seed your-email@example.com your-password
```

6. Start the development server
```bash
npm run dev
```

Visit http://localhost:3000 to see the application.

## Usage

1. **Public Landing Page**: Visit the home page to see the company branding
2. **Admin Access**: Click the Black Unicorn logo to open the authentication modal
3. **Todo Management**: After logging in, manage business todos from the admin dashboard

## Project Structure

- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - Reusable React components
- `src/lib/` - Utility functions and database configuration
- `src/types/` - TypeScript type definitions
- `prisma/` - Database schema and migrations
- `public/` - Static assets including logo files

## API Routes

- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - Session termination
- `GET /api/auth/me` - Current user information
- `GET /api/todos` - Fetch user todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/[id]` - Update todo
- `DELETE /api/todos/[id]` - Delete todo

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed <email> <password>` - Create new user account

## Authentication

No public registration is available. Admin accounts must be created using the seed script:

```bash
npm run db:seed admin@example.com securepassword123
```

## Design

The application follows the brand aesthetic:
- **Company**: Black Unicorn Design Studio
- **Tagline**: "Human centered, AI powered"
- **Color Scheme**: Black, gray, and white with modern typography
- **Logo**: Stylized unicorn with flowing mane

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- HTTP-only cookies for session management
- Environment-based configuration
- User-specific data access control