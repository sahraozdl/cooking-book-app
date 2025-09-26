import { render, screen, fireEvent } from '@testing-library/react';
import ActionIconButton from '@/components/buttons/ActionIconButton';
import { HeartIcon } from '@phosphor-icons/react';

describe('ActionIconButton', () => {
  it('renders the button with icon and label', () => {
    render(
      <ActionIconButton
        onClick={() => {}}
        label="Like"
        icon={<HeartIcon data-testid="icon" size={16} />}
        count={5}
      />
    );

    expect(screen.getByLabelText('Like')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders activeIcon when active', () => {
    render(
      <ActionIconButton
        onClick={() => {}}
        label="Like"
        icon={<HeartIcon data-testid="icon" size={16} />}
        activeIcon={<HeartIcon data-testid="active-icon" weight="fill" size={16} />}
        active
      />
    );

    expect(screen.getByTestId('active-icon')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<ActionIconButton onClick={handleClick} label="Like" icon={<HeartIcon size={16} />} />);

    fireEvent.click(screen.getByRole('button', { name: /Like/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <ActionIconButton onClick={() => {}} label="Like" icon={<HeartIcon size={16} />} count={3} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
