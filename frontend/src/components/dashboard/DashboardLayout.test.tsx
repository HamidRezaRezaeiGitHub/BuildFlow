import { render, screen } from '@testing-library/react';
import { DashboardLayout, DashboardSection } from './DashboardLayout';
import '@testing-library/jest-dom';

describe('DashboardLayout', () => {
  describe('Basic Rendering', () => {
    test('renders without crashing', () => {
      render(
        <DashboardLayout>
          <div>Content</div>
        </DashboardLayout>
      );
    });

    test('renders children content', () => {
      render(
        <DashboardLayout>
          <div data-testid="test-content">Test Content</div>
        </DashboardLayout>
      );
      
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('Title and Subtitle', () => {
    test('renders title when provided', () => {
      render(
        <DashboardLayout title="Dashboard Title">
          <div>Content</div>
        </DashboardLayout>
      );
      
      expect(screen.getByText('Dashboard Title')).toBeInTheDocument();
    });

    test('renders subtitle when provided', () => {
      render(
        <DashboardLayout 
          title="Dashboard"
          subtitle={<p>Welcome back, User!</p>}
        >
          <div>Content</div>
        </DashboardLayout>
      );
      
      expect(screen.getByText('Welcome back, User!')).toBeInTheDocument();
    });

    test('renders without title and subtitle', () => {
      const { container } = render(
        <DashboardLayout>
          <div>Content</div>
        </DashboardLayout>
      );
      
      // Should not have the header section
      const h1Elements = container.querySelectorAll('h1');
      expect(h1Elements).toHaveLength(0);
    });
  });

  describe('Layout Variants', () => {
    test('applies single column variant by default', () => {
      const { container } = render(
        <DashboardLayout>
          <div>Content</div>
        </DashboardLayout>
      );
      
      // Should have space-y-8 but not grid classes
      const sectionsContainer = container.querySelector('.space-y-8');
      expect(sectionsContainer).toBeInTheDocument();
    });

    test('applies single column variant explicitly', () => {
      const { container } = render(
        <DashboardLayout variant="single">
          <div>Content</div>
        </DashboardLayout>
      );
      
      const sectionsContainer = container.querySelector('.space-y-8');
      expect(sectionsContainer).toBeInTheDocument();
    });

    test('applies grid variant when specified', () => {
      const { container } = render(
        <DashboardLayout variant="grid">
          <div>Content</div>
        </DashboardLayout>
      );
      
      const sectionsContainer = container.querySelector('.md\\:grid');
      expect(sectionsContainer).toBeInTheDocument();
    });

    test('applies custom grid columns', () => {
      const { container } = render(
        <DashboardLayout variant="grid" gridCols={3}>
          <div>Content</div>
        </DashboardLayout>
      );
      
      const sectionsContainer = container.querySelector('.md\\:grid-cols-3');
      expect(sectionsContainer).toBeInTheDocument();
    });
  });

  describe('Safe Area and Spacing', () => {
    test('applies minimum bottom padding for navbar clearance', () => {
      const { container } = render(
        <DashboardLayout>
          <div>Content</div>
        </DashboardLayout>
      );
      
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('pb-24');
    });

    test('applies safe-area-inset-bottom via inline style', () => {
      const { container } = render(
        <DashboardLayout>
          <div>Content</div>
        </DashboardLayout>
      );
      
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer.style.paddingBottom).toContain('env(safe-area-inset-bottom)');
    });

    test('applies minimum height to fill screen', () => {
      const { container } = render(
        <DashboardLayout>
          <div>Content</div>
        </DashboardLayout>
      );
      
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('min-h-screen');
    });

    test('applies background color class', () => {
      const { container } = render(
        <DashboardLayout>
          <div>Content</div>
        </DashboardLayout>
      );
      
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('bg-background');
    });
  });

  describe('Responsive Container', () => {
    test('applies container with responsive padding', () => {
      const { container } = render(
        <DashboardLayout>
          <div>Content</div>
        </DashboardLayout>
      );
      
      const contentContainer = container.querySelector('.container');
      expect(contentContainer).toBeInTheDocument();
      expect(contentContainer).toHaveClass('mx-auto', 'px-4');
    });
  });

  describe('Custom Classes', () => {
    test('applies custom className', () => {
      const { container } = render(
        <DashboardLayout className="custom-class">
          <div>Content</div>
        </DashboardLayout>
      );
      
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('custom-class');
    });

    test('maintains default classes when custom className is provided', () => {
      const { container } = render(
        <DashboardLayout className="custom-class">
          <div>Content</div>
        </DashboardLayout>
      );
      
      const mainContainer = container.firstChild as HTMLElement;
      expect(mainContainer).toHaveClass('min-h-screen', 'bg-background', 'pb-24', 'custom-class');
    });
  });

  describe('Multiple Sections', () => {
    test('renders multiple child sections', () => {
      render(
        <DashboardLayout>
          <DashboardSection title="Section 1">
            <div>Content 1</div>
          </DashboardSection>
          <DashboardSection title="Section 2">
            <div>Content 2</div>
          </DashboardSection>
        </DashboardLayout>
      );
      
      expect(screen.getByText('Section 1')).toBeInTheDocument();
      expect(screen.getByText('Section 2')).toBeInTheDocument();
      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });
  });
});

describe('DashboardSection', () => {
  describe('Basic Rendering', () => {
    test('renders without crashing', () => {
      render(
        <DashboardSection>
          <div>Content</div>
        </DashboardSection>
      );
    });

    test('renders children content', () => {
      render(
        <DashboardSection>
          <div data-testid="section-content">Section Content</div>
        </DashboardSection>
      );
      
      expect(screen.getByTestId('section-content')).toBeInTheDocument();
      expect(screen.getByText('Section Content')).toBeInTheDocument();
    });
  });

  describe('Title and Description', () => {
    test('renders title when provided', () => {
      render(
        <DashboardSection title="Section Title">
          <div>Content</div>
        </DashboardSection>
      );
      
      expect(screen.getByText('Section Title')).toBeInTheDocument();
    });

    test('renders description when provided', () => {
      render(
        <DashboardSection 
          title="Section Title"
          description="Section description"
        >
          <div>Content</div>
        </DashboardSection>
      );
      
      expect(screen.getByText('Section description')).toBeInTheDocument();
    });

    test('renders without header when no title, description, or actions', () => {
      const { container } = render(
        <DashboardSection>
          <div>Content</div>
        </DashboardSection>
      );
      
      const h2Elements = container.querySelectorAll('h2');
      expect(h2Elements).toHaveLength(0);
    });
  });

  describe('Actions', () => {
    test('renders action buttons when provided', () => {
      render(
        <DashboardSection
          title="Section"
          actions={<button>Action Button</button>}
        >
          <div>Content</div>
        </DashboardSection>
      );
      
      expect(screen.getByText('Action Button')).toBeInTheDocument();
    });

    test('renders multiple actions', () => {
      render(
        <DashboardSection
          title="Section"
          actions={
            <>
              <button>Action 1</button>
              <button>Action 2</button>
            </>
          }
        >
          <div>Content</div>
        </DashboardSection>
      );
      
      expect(screen.getByText('Action 1')).toBeInTheDocument();
      expect(screen.getByText('Action 2')).toBeInTheDocument();
    });
  });

  describe('Section ID', () => {
    test('applies custom id when provided', () => {
      const { container } = render(
        <DashboardSection id="projects-section">
          <div>Content</div>
        </DashboardSection>
      );
      
      const section = container.querySelector('#projects-section');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Custom Classes', () => {
    test('applies custom className', () => {
      const { container } = render(
        <DashboardSection className="custom-section">
          <div>Content</div>
        </DashboardSection>
      );
      
      const section = container.firstChild as HTMLElement;
      expect(section).toHaveClass('custom-section');
    });

    test('maintains default spacing classes with custom className', () => {
      const { container } = render(
        <DashboardSection className="custom-section">
          <div>Content</div>
        </DashboardSection>
      );
      
      const section = container.firstChild as HTMLElement;
      expect(section).toHaveClass('space-y-4', 'custom-section');
    });
  });

  describe('Header Layout', () => {
    test('renders header with title and actions in flex layout', () => {
      const { container } = render(
        <DashboardSection
          title="Section"
          actions={<button>Action</button>}
        >
          <div>Content</div>
        </DashboardSection>
      );
      
      // Check for responsive flex layout
      const headerContainer = container.querySelector('.flex.flex-col.gap-2');
      expect(headerContainer).toBeInTheDocument();
      expect(headerContainer).toHaveClass('sm:flex-row', 'sm:items-center', 'sm:justify-between');
    });
  });

  describe('Accessibility', () => {
    test('uses semantic section element', () => {
      const { container } = render(
        <DashboardSection title="Section">
          <div>Content</div>
        </DashboardSection>
      );
      
      const section = container.querySelector('section');
      expect(section).toBeInTheDocument();
    });

    test('uses semantic heading for title', () => {
      render(
        <DashboardSection title="Section Title">
          <div>Content</div>
        </DashboardSection>
      );
      
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Section Title');
    });
  });
});
