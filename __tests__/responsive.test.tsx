import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { priority, ...rest } = props
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...rest} />
  },
}))

// Mock AuthModal component
jest.mock('@/components/AuthModal', () => {
  return function MockAuthModal() {
    return null
  }
})

describe('Responsive Design Tests', () => {
  describe('Mobile Viewport (< 768px)', () => {
    beforeEach(() => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 667,
      })
    })

    it('applies mobile-first responsive classes', () => {
      render(<Home />)
      
      const blackUnicornSpan = screen.getByText('Black Unicorn')
      const designStudioSpan = screen.getByText('Design Studio')
      
      // Should have block class for mobile (displays on separate lines)
      expect(blackUnicornSpan).toHaveClass('block')
      expect(designStudioSpan).toHaveClass('block')
      
      // Should also have md:inline for larger screens
      expect(blackUnicornSpan).toHaveClass('md:inline')
      expect(designStudioSpan).toHaveClass('md:inline')
    })

    it('uses appropriate text sizes for mobile', () => {
      render(<Home />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      const tagline = screen.getByText('Human centered, AI powered')
      
      // Mobile text sizes
      expect(heading).toHaveClass('text-3xl') // Base mobile size
      expect(tagline).toHaveClass('text-xl') // Base mobile size
    })
  })

  describe('Tablet Viewport (768px - 1023px)', () => {
    beforeEach(() => {
      // Mock tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      })
    })

    it('should have md: classes that activate at tablet breakpoint', () => {
      render(<Home />)
      
      const blackUnicornSpan = screen.getByText('Black Unicorn')
      const designStudioSpan = screen.getByText('Design Studio')
      const heading = screen.getByRole('heading', { level: 1 })
      const tagline = screen.getByText('Human centered, AI powered')
      
      // Should have inline classes for tablet+ (single line)
      expect(blackUnicornSpan).toHaveClass('md:inline')
      expect(designStudioSpan).toHaveClass('md:inline', 'md:ml-2')
      
      // Should have medium text sizes
      expect(heading).toHaveClass('md:text-5xl')
      expect(tagline).toHaveClass('md:text-2xl')
    })
  })

  describe('Desktop Viewport (1024px+)', () => {
    beforeEach(() => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      })
    })

    it('should have lg: classes that activate at desktop breakpoint', () => {
      render(<Home />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      
      // Should have large text size for desktop
      expect(heading).toHaveClass('lg:text-6xl')
    })
  })

  describe('Wide Desktop Viewport (1280px+)', () => {
    beforeEach(() => {
      // Mock wide desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1280,
      })
    })

    it('maintains proper layout at wide screen sizes', () => {
      render(<Home />)
      
      const main = screen.getByRole('main')
      const heading = screen.getByRole('heading', { level: 1 })
      
      // Should maintain centering and proper layout
      expect(main).toHaveClass('flex', 'items-center', 'justify-center')
      expect(heading).toHaveClass('lg:text-6xl')
    })
  })

  describe('Breakpoint Behavior Verification', () => {
    it('has all necessary responsive classes for heading text', () => {
      render(<Home />)
      
      const blackUnicornSpan = screen.getByText('Black Unicorn')
      const designStudioSpan = screen.getByText('Design Studio')
      
      // Verify the exact classes that handle responsive behavior
      expect(blackUnicornSpan.className).toContain('block md:inline')
      expect(designStudioSpan.className).toContain('block md:inline md:ml-2')
    })

    it('has responsive text sizing across all breakpoints', () => {
      render(<Home />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      const tagline = screen.getByText('Human centered, AI powered')
      
      // Verify progressive text sizing
      expect(heading.className).toContain('text-3xl md:text-5xl lg:text-6xl')
      expect(tagline.className).toContain('text-xl md:text-2xl')
    })

    it('ensures proper spacing is maintained across breakpoints', () => {
      render(<Home />)
      
      const designStudioSpan = screen.getByText('Design Studio')
      
      // Should have margin on medium+ screens to separate words
      expect(designStudioSpan).toHaveClass('md:ml-2')
    })
  })

  describe('CSS Grid and Flexbox Responsiveness', () => {
    it('uses flexbox for proper centering', () => {
      render(<Home />)
      
      const main = screen.getByRole('main')
      const contentDiv = main.firstChild as HTMLElement
      
      expect(main).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center')
      expect(contentDiv).toHaveClass('flex', 'flex-col', 'items-center', 'text-center')
    })

    it('maintains proper padding across screen sizes', () => {
      render(<Home />)
      
      const main = screen.getByRole('main')
      
      // Should have consistent padding
      expect(main).toHaveClass('p-8')
    })
  })

  describe('Text Content Integrity', () => {
    it('preserves complete brand name across all viewports', () => {
      render(<Home />)
      
      // Both parts should always be present regardless of layout
      expect(screen.getByText('Black Unicorn')).toBeInTheDocument()
      expect(screen.getByText('Design Studio')).toBeInTheDocument()
      
      // Tagline should always be complete
      expect(screen.getByText('Human centered, AI powered')).toBeInTheDocument()
    })

    it('maintains semantic structure across breakpoints', () => {
      render(<Home />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      const blackUnicornSpan = screen.getByText('Black Unicorn')
      const designStudioSpan = screen.getByText('Design Studio')
      
      // Both spans should be children of the h1
      expect(heading).toContainElement(blackUnicornSpan)
      expect(heading).toContainElement(designStudioSpan)
    })
  })
})