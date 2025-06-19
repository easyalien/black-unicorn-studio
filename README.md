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
- **Database**: PostgreSQL (SQLite for development)
- **ORM**: Prisma
- **Authentication**: JWT-based session management

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run database migrations: `npx prisma migrate dev`
5. Start development server: `npm run dev`

## Project Structure

- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - Reusable React components
- `src/lib/` - Utility functions and database configuration
- `prisma/` - Database schema and migrations
- `public/` - Static assets including logo files

## Authentication

No public registration is available. Accounts must be created directly in the database or through the seed script.

## Design

The application follows the brand aesthetic established in the design files:
- Company: Black Unicorn Design Studio
- Tagline: "Human centered, AI powered"
- Color scheme: Black, gray, and white with modern typography