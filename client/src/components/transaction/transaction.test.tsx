import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Transaction from './transaction';
import { MOCK_USER } from '../../../mock/mockData';
import { TTransaction } from '../../types/types';
import * as StoreModule from '../../store/Store';

const MOCK_LOGGED_USER = {
  email: 'aaa@gmail.com',
  password: '123',
  firstName: 'Joe',
  lastName: 'Doe',
  accessToken: 'dasd34r2wfs',
  linkedBanks: {},
  next_cursor: 'dsada',
  transactions: [],
  transactionsCategorized: [],
  categories: [],
};

describe('Transaction Component', () => {
  const mockTransaction: TTransaction = {
    ...MOCK_USER.transactions[0],
    user_category: 'Uncategorised',
  };

  it('renders transaction details and category dropdown with default value', () => {
    render(<Transaction transaction={mockTransaction} />);

    // Check if transaction details are rendered
    expect(screen.getByText('Uber 063015 SF**POOL**')).toBeInTheDocument();
    expect(screen.getByText('5.4 GBP')).toBeInTheDocument();
    expect(screen.getByText('2023-08-28')).toBeInTheDocument();

    // Check if the category dropdown is rendered with the default value
    const categoryDropdown = screen.getByRole('combobox');
    expect(categoryDropdown).toBeInTheDocument();
    expect(screen.getByDisplayValue('Uncategorised')).toBeInTheDocument();
  });
});
