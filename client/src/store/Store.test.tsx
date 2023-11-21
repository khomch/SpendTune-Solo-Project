// store.test.ts
import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { useCombinedStore } from './Store';

const MOCK_USER = {
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

describe('Zustand Store Tests', () => {
  it('should set and get logged user', () => {
    const { result } = renderHook(() => useCombinedStore());
    expect(result.current.logged).toBeNull();
    act(() => {
      result.current.setLoggedUser(MOCK_USER);
    });
    expect(result.current.logged).toEqual(MOCK_USER);
  });

  it('should set and get auth token', () => {
    const { result } = renderHook(() => useCombinedStore());
    expect(result.current.token).toBeNull();
    act(() => {
      result.current.setAuthToken('your-auth-token');
    });
    expect(result.current.token).toBe('your-auth-token');
  });
});
