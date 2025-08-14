import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContext';
import Header from '../Header';

// Mock the AuthContext
const mockAuthContext = {
  user: null,
  signIn: jest.fn(),
  signOut: jest.fn(),
  loading: false,
};

// Mock the useMobile hook
jest.mock('@/hooks/use-mobile', () => ({
  useMobile: () => false,
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={mockAuthContext}>
        {component}
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderWithProviders(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('displays the logo', () => {
    renderWithProviders(<Header />);
    const logo = screen.getByAltText(/logo/i);
    expect(logo).toBeInTheDocument();
  });

  it('shows navigation menu items', () => {
    renderWithProviders(<Header />);
    
    // Check for main navigation items
    expect(screen.getByText(/about/i)).toBeInTheDocument();
    expect(screen.getByText(/services/i)).toBeInTheDocument();
    expect(screen.getByText(/contact/i)).toBeInTheDocument();
  });

  it('shows sign in button when user is not authenticated', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it('shows user menu when user is authenticated', () => {
    const authenticatedContext = {
      ...mockAuthContext,
      user: { id: '1', email: 'test@example.com', name: 'Test User' },
    };

    render(
      <BrowserRouter>
        <AuthContext.Provider value={authenticatedContext}>
          <Header />
        </AuthContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText(/test user/i)).toBeInTheDocument();
  });

  it('handles mobile menu toggle', () => {
    renderWithProviders(<Header />);
    
    const mobileMenuButton = screen.getByLabelText(/toggle menu/i);
    expect(mobileMenuButton).toBeInTheDocument();
  });

  it('applies proper accessibility attributes', () => {
    renderWithProviders(<Header />);
    
    const header = screen.getByRole('banner');
    expect(header).toHaveAttribute('aria-label', 'Main navigation');
  });
});
