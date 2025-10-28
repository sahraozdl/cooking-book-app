import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavbarView } from '@/components/NavbarView';
import '@testing-library/jest-dom';
import { UserTypes } from '@/types';

describe('NavbarView', () => {
  const mockLogout = jest.fn();
  const mockToggleMenu = jest.fn();

  it('shows Login link when user is not logged in', () => {
    render(
      <NavbarView
        user={null}
        isMenuOpen={false}
        onLogout={mockLogout}
        onToggleMenu={mockToggleMenu}
      />
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('shows Profile and Logout when user is logged in', () => {
    const user: UserTypes = { id: '1', name: 'Sahra', email: 'sahra@example.com' };

    render(
      <NavbarView
        user={user}
        isMenuOpen={false}
        onLogout={mockLogout}
        onToggleMenu={mockToggleMenu}
      />
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.queryByText('Login')).not.toBeInTheDocument();
  });

  it('calls onLogout when Logout button is clicked', () => {
    const user: UserTypes = { id: '1', name: 'Sahra', email: 'sahra@example.com' };

    render(
      <NavbarView
        user={user}
        isMenuOpen={false}
        onLogout={mockLogout}
        onToggleMenu={mockToggleMenu}
      />
    );

    fireEvent.click(screen.getByText('Logout'));
    expect(mockLogout).toHaveBeenCalled();
  });
  it('calls onToggleMenu when hamburger button is clicked', () => {
    render(
      <NavbarView
        user={null}
        isMenuOpen={false}
        onLogout={mockLogout}
        onToggleMenu={mockToggleMenu}
      />
    );

    const button = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(button);
    expect(mockToggleMenu).toHaveBeenCalled();
  });
});
