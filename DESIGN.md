# Black Unicorn Design Studio - Web Application Design Document

## Overview
A Next.js web application for Black Unicorn Design Studio featuring a public landing page and private todo management system.

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

### Private Todo Management
- Authenticated-only access
- Business todo list functionality
- CRUD operations for tasks
- Clean, professional interface

## User Flow
1. User visits landing page
2. Sees company branding and information
3. Clicking logo reveals authentication modal
4. Successful login redirects to todo management dashboard
5. Logout returns to landing page

## Technical Stack
- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS for rapid development
- **Authentication**: Next-auth or custom JWT implementation
- **Database**: Local storage or serverless database
- **Deployment**: Vercel (recommended for Next.js)

## File Structure
```
buds/
├── design.png              # Design reference
├── logo-files/
│   ├── logo.png           # Main logo file
│   └── favicon-32x32.png  # Favicon
├── src/
│   ├── app/               # Next.js App Router
│   ├── components/        # Reusable components
│   ├── lib/              # Utilities and auth
│   └── styles/           # Global styles
└── public/               # Static assets
```