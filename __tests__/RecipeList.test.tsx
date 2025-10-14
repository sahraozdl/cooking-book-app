import { render, screen } from '@testing-library/react';
import RecipeList from '@/components/RecipeList';
import { RecipeWithID } from '@/types';

jest.mock('@/components/EntryCard', () => {
  return function MockEntryCard({ entry }: { entry: RecipeWithID }) {
    return <div data-testid="entry-card">{entry.strMeal}</div>;
  };
});

const mockRecipes: Partial<RecipeWithID>[] = [
  { id: '1', strMeal: 'Pizza' },
  { id: '2', strMeal: 'Pasta' },
];

describe('RecipeList component', () => {
  it('shows loading state', () => {
    render(<RecipeList recipes={[]} loading />);
    expect(screen.getByText('Loading recipes...')).toBeInTheDocument();
  });

  it('shows empty state', () => {
    render(<RecipeList recipes={[]} />);
    expect(screen.getByText('No recipes found.')).toBeInTheDocument();
  });

  it('renders recipes', () => {
    render(<RecipeList recipes={mockRecipes as RecipeWithID[]} />);
    expect(screen.getAllByTestId('entry-card')).toHaveLength(2);
  });

  it('matches snapshot', () => {
    const { asFragment } = render(<RecipeList recipes={mockRecipes as RecipeWithID[]} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
