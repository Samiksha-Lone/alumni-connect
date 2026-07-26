import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthPage from '../pages/AuthPage';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider } from '../context/AuthContext';

describe('AuthPage experience', () => {
  it('renders the login form and allows switching to sign-up mode', () => {
    render(
      <MemoryRouter>
        <ToastProvider>
          <AuthProvider>
            <AuthPage />
          </AuthProvider>
        </ToastProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('jane@college.edu')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    expect(screen.getByText(/create your account/i)).toBeInTheDocument();
  });

  it('shows the validation guidance for incomplete registration data', () => {
    render(
      <MemoryRouter>
        <ToastProvider>
          <AuthProvider>
            <AuthPage />
          </AuthProvider>
        </ToastProvider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    expect(screen.getByText(/create your account/i)).toBeInTheDocument();
    expect(screen.getByText(/join the network/i)).toBeInTheDocument();
  });
});
