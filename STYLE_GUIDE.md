# Black Unicorn Design Studio - Clean & Simple Style Guide

## Overview
This style guide documents the existing clean, minimal design system used throughout the Black Unicorn Design Studio application. The design emphasizes simplicity, clarity, and functionality with a light, professional aesthetic.

## Design Philosophy
- **Clean & Minimal**: Simple, uncluttered interfaces that focus on content and functionality
- **Professional**: Business-ready styling that conveys trust and competence
- **Accessible**: High contrast, clear typography, and intuitive interactions
- **Consistent**: Unified visual language across all pages and components

## Color Palette

### Primary Colors
- **White**: `#ffffff` - Primary background color
- **Black**: `#000000` - Primary text color and accents
- **Light Gray**: `#f9fafb` (gray-50) - Secondary background for pages

### Text Colors
- **Primary Text**: `#000000` (black) - Main headings and important text
- **Secondary Text**: `#4b5563` (gray-600) - Body text and secondary information
- **Muted Text**: `#9ca3af` (gray-400) - Placeholder text and subtle elements

### Interactive Colors
- **Blue**: `#2563eb` (blue-600) - Primary action color for links and buttons
- **Blue Light**: `#dbeafe` (blue-100) - Background for blue icon containers
- **Green**: `#059669` (green-600) - Success states and positive actions
- **Green Light**: `#dcfce7` (green-100) - Background for green icon containers
- **Red**: `#dc2626` (red-600) - Error states and destructive actions
- **Purple**: `#7c3aed` (purple-600) - Special status indicators

### Border Colors
- **Light Border**: `#d1d5db` (gray-300) - Form inputs and card borders
- **Subtle Border**: `#e5e7eb` (gray-200) - Table borders and dividers

## Typography

### Font Families
- **Headings**: Poppins (via `font-heading`, `font-brand`)
  - Used for: Page titles, card titles, section headers
  - Weights: 400 (normal), 600 (semibold), 900 (black)
- **Body Text**: Inter (via `font-body`, default sans)
  - Used for: Body text, form labels, descriptions
  - Weights: 400 (normal), 500 (medium), 600 (semibold)

### Text Scales
- **Large Display**: `text-3xl md:text-5xl lg:text-6xl` - Main brand title
- **Page Headers**: `text-3xl` - Admin page titles
- **Section Headers**: `text-2xl` - Component section titles
- **Card Titles**: `text-xl` - Individual card/component titles
- **Body Text**: `text-base` - Default body text
- **Small Text**: `text-sm` - Secondary information
- **Tiny Text**: `text-xs` - Status badges, timestamps

## Layout System

### Spacing
- **Page Padding**: `p-6` or `p-8` - Consistent page margins
- **Component Spacing**: `space-y-6` - Vertical spacing between major components
- **Form Spacing**: `space-y-4` - Vertical spacing in forms
- **Grid Gaps**: `gap-4` to `gap-6` - Spacing in grid layouts

### Container Widths
- **Max Width**: `max-w-6xl mx-auto` - Main content container
- **Form Width**: `max-w-4xl mx-auto` - Forms and input containers
- **Full Width**: `w-full` - Tables and lists

### Grid Systems
- **Card Grids**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- **Form Grids**: `grid grid-cols-1 md:grid-cols-2 gap-4`
- **Table Layouts**: Full-width responsive tables

## Component Patterns

### Cards
```css
.card {
  @apply bg-white rounded-lg shadow-sm border p-6;
}

.card-interactive {
  @apply bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer;
}
```

### Buttons
```css
.btn-primary {
  @apply bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-md transition-colors;
}

.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-md transition-colors;
}

.btn-success {
  @apply bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors;
}

.btn-danger {
  @apply bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs transition-colors;
}
```

### Form Elements
```css
.form-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black;
}
```

### Status Badges
```css
.badge {
  @apply inline-flex px-2 py-1 text-xs font-semibold rounded-full;
}

.badge-purple {
  @apply bg-purple-100 text-purple-800;
}

.badge-blue {
  @apply bg-blue-100 text-blue-800;
}

.badge-gray {
  @apply bg-gray-100 text-gray-800;
}
```

### Tables
```css
.table-header {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}

.table-cell {
  @apply px-6 py-4 whitespace-nowrap text-sm;
}

.table-row {
  @apply hover:bg-gray-50;
}
```

## Icon Usage

### Icon Containers
- **Blue Icons**: Used for primary actions (todos, tasks)
- **Green Icons**: Used for user/people related functions
- **Purple Icons**: Used for client/relationship functions
- **Orange Icons**: Used for project management
- **Red Icons**: Used for reports/analytics
- **Gray Icons**: Used for settings/configuration

### Icon Sizes
- **Large Icons**: `w-6 h-6` - Main action icons in cards
- **Small Icons**: `w-5 h-5` - Navigation arrows and secondary actions
- **Tiny Icons**: `w-4 h-4` - Form elements and inline actions

## Interaction States

### Hover Effects
- **Cards**: `hover:shadow-md transition-shadow`
- **Buttons**: Color darkening with `transition-colors`
- **Links**: `hover:text-blue-800` for text links
- **Table Rows**: `hover:bg-gray-50`
- **Icons**: `group-hover:text-gray-600 transition-colors`

### Focus States
- **Form Inputs**: `focus:outline-none focus:ring-2 focus:ring-black`
- **Interactive Elements**: Clear, accessible focus indicators

## Responsive Design

### Breakpoints
- **Mobile First**: Base styles for mobile
- **md**: `md:` prefix for tablet and up (768px+)
- **lg**: `lg:` prefix for desktop and up (1024px+)

### Responsive Patterns
- **Grid Collapse**: 3-column → 2-column → 1-column
- **Typography Scaling**: Larger text on larger screens
- **Spacing Adjustments**: More generous spacing on larger screens
- **Content Hiding**: Hide secondary text elements on mobile for cleaner headers
  - Landing page: Heading breaks into two lines on mobile
  - Admin headers: Hide brand text and welcome messages on small screens

## Accessibility Guidelines

### Contrast Requirements
- All text meets WCAG AA contrast requirements
- Interactive elements have clear visual states
- Focus indicators are prominent and consistent

### Typography
- Minimum 16px base font size
- Clear hierarchy with appropriate heading levels
- Sufficient line spacing for readability

### Interactive Elements
- All buttons and links have adequate touch targets (44px minimum)
- Clear hover and focus states
- Descriptive button text and alt attributes

## Usage Examples

### Page Structure
```jsx
<div className="min-h-screen bg-gray-50">
  <header className="bg-white shadow-sm border-b">
    {/* Header content */}
  </header>
  <main className="max-w-6xl mx-auto p-6">
    <h1 className="text-3xl font-heading font-bold text-black text-center mb-8">
      Page Title
    </h1>
    <div className="space-y-6">
      {/* Page content */}
    </div>
  </main>
</div>
```

### Responsive Header Structure
```jsx
<header className="bg-white shadow-sm border-b">
  <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
    <div className="flex items-center gap-4">
      <Image src="/logo.png" alt="Logo" width={40} height={40} />
      {/* Hide brand text on mobile */}
      <h1 className="hidden md:block text-2xl font-brand font-bold">
        Brand Name
      </h1>
    </div>
    <div className="flex items-center gap-4">
      {/* Hide welcome message on mobile */}
      <span className="hidden md:inline text-gray-600">
        Welcome, User
      </span>
      <button className="btn btn-secondary">Logout</button>
    </div>
  </div>
</header>
```

### Form Structure
```jsx
<div className="bg-white rounded-lg shadow-sm border p-6">
  <h2 className="text-xl font-semibold mb-4">Form Title</h2>
  <form className="space-y-4">
    <input
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
      placeholder="Input placeholder..."
    />
    <button className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-md transition-colors">
      Submit
    </button>
  </form>
</div>
```

### Card Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow cursor-pointer">
    <div className="p-3 bg-blue-100 rounded-lg mb-4">
      {/* Icon */}
    </div>
    <h3 className="text-xl font-heading font-semibold text-black mb-2">Card Title</h3>
    <p className="text-gray-600">Card description</p>
  </div>
</div>
```

This clean, simple design system provides a solid foundation for a professional business application while maintaining excellent usability and accessibility.