import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getLoggedUser } from './apiService';
import { TUser } from './types/types';

type TStore = {
  logged: TUser | null;
  fetchLoggedUser: () => void;
  setLoggedUser: (user: TUser | null) => void;
};

const createLoggedStore = persist<TStore>(
  (set) => ({
    logged: null,
    // fetches logged user from the server and updates the store
    fetchLoggedUser: async () => {
      await getLoggedUser().then((user) => set({ logged: user }));
    },
    // Add a function to update loggedUser
    setLoggedUser: (user) => set({ logged: user }),
  }),
  // config for persist middleware storage
  {
    name: 'logged-store',
    getStorage: () => localStorage,
  }
);

export const useCombinedStore = create<TStore>((...params) => ({
  ...createLoggedStore(...params),
}));
