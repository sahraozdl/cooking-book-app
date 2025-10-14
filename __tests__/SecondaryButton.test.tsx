import { render, screen, fireEvent } from '@testing-library/react';
import SecondaryButton from '@/components/buttons/SecondaryButton';

describe('SecondaryButton', () => {
  it('renders children correctly', () => {
    render(<SecondaryButton>Cancel</SecondaryButton>);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<SecondaryButton onClick={handleClick}>Cancel</SecondaryButton>);
    fireEvent.click(screen.getByText('Cancel'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<SecondaryButton>Snapshot</SecondaryButton>);
    expect(asFragment()).toMatchSnapshot();
  });
});
