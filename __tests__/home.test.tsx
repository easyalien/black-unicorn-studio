import { render, screen, fireEvent } from '@testing-library/react'
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
  return function MockAuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return isOpen ? (
      <div data-testid="auth-modal">
        <button onClick={onClose}>Close</button>
      </div>
    ) : null
  }
})

describe('Home Page', () => {
  beforeEach(() => {
    // Reset viewport to default before each test
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
  })

  it('renders the main heading with proper structure', () => {
    render(<Home />)
    
    // Check if main heading exists
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    
    // Check if heading contains both parts
    expect(screen.getByText('Black Unicorn')).toBeInTheDocument()
    expect(screen.getByText('Design Studio')).toBeInTheDocument()
  })

  it('displays the tagline', () => {
    render(<Home />)
    
    expect(screen.getByText('Human centered, AI powered')).toBeInTheDocument()
  })

  it('renders the logo image', () => {
    render(<Home />)
    
    const logo = screen.getByAltText('Black Unicorn Design Studio Logo')
    expect(logo).toBeInTheDocument()
    expect(logo).toHaveAttribute('src', '/logo.png')
  })

  it('opens auth modal when logo is clicked', () => {
    render(<Home />)
    
    const logo = screen.getByAltText('Black Unicorn Design Studio Logo')
    
    // Modal should not be visible initially
    expect(screen.queryByTestId('auth-modal')).not.toBeInTheDocument()
    
    // Click logo
    fireEvent.click(logo)
    
    // Modal should now be visible
    expect(screen.getByTestId('auth-modal')).toBeInTheDocument()
  })

  it('closes auth modal when close button is clicked', () => {
    render(<Home />)
    
    const logo = screen.getByAltText('Black Unicorn Design Studio Logo')
    
    // Open modal
    fireEvent.click(logo)
    expect(screen.getByTestId('auth-modal')).toBeInTheDocument()
    
    // Close modal
    const closeButton = screen.getByText('Close')
    fireEvent.click(closeButton)
    
    // Modal should be closed
    expect(screen.queryByTestId('auth-modal')).not.toBeInTheDocument()
  })

  describe('Responsive Design', () => {
    it('applies correct CSS classes for responsive layout', () => {
      render(<Home />)
      
      const blackUnicornSpan = screen.getByText('Black Unicorn')
      const designStudioSpan = screen.getByText('Design Studio')
      
      // Check mobile classes (block)
      expect(blackUnicornSpan).toHaveClass('block', 'md:inline')
      expect(designStudioSpan).toHaveClass('block', 'md:inline', 'md:ml-2')
    })

    it('has proper responsive text sizing', () => {
      render(<Home />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toHaveClass('text-3xl', 'md:text-5xl', 'lg:text-6xl')
    })

    it('has responsive tagline sizing', () => {
      render(<Home />)
      
      const tagline = screen.getByText('Human centered, AI powered')
      expect(tagline).toHaveClass('text-xl', 'md:text-2xl')
    })
  })

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<Home />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      expect(heading).toBeInTheDocument()
    })

    it('has accessible logo with alt text', () => {
      render(<Home />)
      
      const logo = screen.getByAltText('Black Unicorn Design Studio Logo')
      expect(logo).toBeInTheDocument()
    })

    it('has proper semantic structure', () => {
      render(<Home />)
      
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
      expect(main).toHaveClass('min-h-screen')
    })
  })

  describe('Styling and Layout', () => {
    it('applies correct font families', () => {
      render(<Home />)
      
      const heading = screen.getByRole('heading', { level: 1 })
      const tagline = screen.getByText('Human centered, AI powered')
      
      expect(heading).toHaveClass('font-brand', 'font-black')
      expect(tagline).toHaveClass('font-body', 'font-medium')
    })

    it('has proper color classes', () => {
      render(<Home />)
      
      const main = screen.getByRole('main')
      const heading = screen.getByRole('heading', { level: 1 })
      const tagline = screen.getByText('Human centered, AI powered')
      
      expect(main).toHaveClass('bg-white')
      expect(heading).toHaveClass('text-black')
      expect(tagline).toHaveClass('text-gray-600')
    })

    it('has proper spacing and layout classes', () => {
      render(<Home />)
      
      const main = screen.getByRole('main')
      const heading = screen.getByRole('heading', { level: 1 })
      
      expect(main).toHaveClass('min-h-screen', 'flex', 'flex-col', 'items-center', 'justify-center', 'p-8')
      expect(heading).toHaveClass('mb-4')
    })
  })

  describe('Interactive Elements', () => {
    it('logo has proper hover and cursor classes', () => {
      render(<Home />)
      
      const logo = screen.getByAltText('Black Unicorn Design Studio Logo')
      expect(logo).toHaveClass('cursor-pointer', 'hover:opacity-80', 'transition-opacity')
    })

    it('maintains state correctly through interactions', () => {
      render(<Home />)
      
      const logo = screen.getByAltText('Black Unicorn Design Studio Logo')
      
      // Multiple open/close cycles
      fireEvent.click(logo)
      expect(screen.getByTestId('auth-modal')).toBeInTheDocument()
      
      fireEvent.click(screen.getByText('Close'))
      expect(screen.queryByTestId('auth-modal')).not.toBeInTheDocument()
      
      fireEvent.click(logo)
      expect(screen.getByTestId('auth-modal')).toBeInTheDocument()
    })
  })
})