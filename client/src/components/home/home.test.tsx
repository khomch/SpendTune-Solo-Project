import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useCombinedStore } from '../../store/Store';
import { MOCK_USER } from '../../../mock/mockData';
import Home from './home';

// Mock the store
jest.mock('../../store/Store');

describe('Home Component', () => {
  // Mock the useCombinedStore implementation
  const mockUseCombinedStore = useCombinedStore as unknown as jest.Mock;

  // Mock a logged-in user for testing
  const mockLoggedUser = {
    // Define your mock user data here
    id: 1,
    username: 'testuser',
    transactions: MOCK_USER.transactions,
    categories: ['taxi'],
  };

  beforeEach(() => {
    // Reset the mock state before each test
    mockUseCombinedStore.mockReturnValue({
      logged: mockLoggedUser,
      token: 'dsadda',
    });
  });

  it('renders dashboard when user is logged in', () => {
    render(<Home />);

    expect(screen.getByTestId('test-dashboard')).toBeInTheDocument();
  });
});
