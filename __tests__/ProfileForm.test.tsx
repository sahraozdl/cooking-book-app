/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfileForm from '@/components/forms/ProfileForm';

jest.mock('react', () => {
  const actual = jest.requireActual('react');
  return {
    ...actual,
    useEffect: actual.useEffect,
    useActionState: jest.fn(() => [{ success: false, message: '' }, jest.fn(), false]),
  };
});

jest.mock('@/app/actions/updateProfileAction', () => ({
  updateProfileAction: jest.fn(),
}));

jest.mock('@/components/buttons/PrimaryButton', () => ({
  __esModule: true,
  default: (props: React.PropsWithChildren<Record<string, unknown>>) => (
    <button {...props}>{props.children}</button>
  ),
}));

jest.mock('@/components/buttons/SecondaryButton', () => ({
  __esModule: true,
  default: (props: React.PropsWithChildren<Record<string, unknown>>) => (
    <button {...props}>{props.children}</button>
  ),
}));

jest.mock('@headlessui/react', () => ({
  Field: ({ children }: any) => <div>{children}</div>,
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
  Input: (props: any) => <input {...props} />,
  Description: ({ children, ...props }: any) => <small {...props}>{children}</small>,
}));

describe('ProfileForm', () => {
  const user = { id: '123', name: 'John Doe', email: 'john@example.com' };
  let mockAction: jest.Mock;
  let onClose: jest.Mock;
  let onSuccess: jest.Mock;

  beforeEach(() => {
    mockAction = jest.fn();
    onClose = jest.fn();
    onSuccess = jest.fn();
    jest.clearAllMocks();
  });

  it('renders form fields with default values', () => {
    render(<ProfileForm user={user} onClose={onClose} onSuccess={onSuccess} />);
    expect(screen.getByLabelText('Name')).toHaveValue('John Doe');
    expect(screen.getByLabelText('Email')).toHaveValue('john@example.com');
  });

  it('disables save button when pending', () => {
    (React.useActionState as jest.Mock).mockReturnValueOnce([
      { success: false, message: '' },
      mockAction,
      true,
    ]);

    render(<ProfileForm user={user} onClose={onClose} onSuccess={onSuccess} />);
    expect(screen.getByText('Saving...')).toBeDisabled();
  });

  it('shows success message and calls callbacks', async () => {
    (React.useActionState as jest.Mock).mockReturnValueOnce([
      { success: true, message: 'Profile updated' },
      jest.fn(),
      false,
    ]);

    render(<ProfileForm user={user} onClose={onClose} onSuccess={onSuccess} />);
    expect(await screen.findByText('Profile updated')).toBeInTheDocument();

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('shows error message and does not call callbacks', async () => {
    (React.useActionState as jest.Mock).mockReturnValueOnce([
      { success: false, message: 'Something went wrong' },
      jest.fn(),
      false,
    ]);

    render(<ProfileForm user={user} onClose={onClose} onSuccess={onSuccess} />);
    expect(await screen.findByText('Something went wrong')).toBeInTheDocument();

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it('submits correctly with valid data', async () => {
    (React.useActionState as jest.Mock).mockReturnValueOnce([
      { success: false, message: '' },
      mockAction,
      false,
    ]);

    render(<ProfileForm user={user} onClose={onClose} onSuccess={onSuccess} />);

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Jane Doe' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'jane@example.com' },
    });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockAction).toHaveBeenCalled();
    });
  });

  it('fails submission when email is invalid', async () => {
    const mockAction = jest.fn();
    (React.useActionState as jest.Mock).mockReturnValueOnce([
      { success: false, message: '' },
      mockAction,
      false,
    ]);

    render(<ProfileForm user={user} onSuccess={onSuccess} onClose={onClose} />);

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    expect(mockAction).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });
});
