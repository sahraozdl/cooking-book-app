import { render, screen } from '@testing-library/react';
import FullPageLoader from '@/components/FullPageLoader';

describe('FullPageLoader', () => {
  it('renders loader text and icon', () => {
    render(<FullPageLoader />);
    expect(screen.getByText('Firing up the kitchen...')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<FullPageLoader />);
    expect(asFragment()).toMatchSnapshot();
  });
});
