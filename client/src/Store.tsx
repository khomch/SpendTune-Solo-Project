import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// import { getLoggedUser } from './apiService';
import { TUser } from './types/types';

type TStore = {
  logged: TUser | null;
  token: string | null;
  // fetchLoggedUser: () => void;
  setLoggedUser: (
    userData: { user: TUser | null; token: string } | null
  ) => void;
};

const createLoggedStore = persist<TStore>(
  (set) => ({
    logged: null,
    token: null,
    // fetches logged user from the server and updates the store
    // fetchLoggedUser: async () => {
    //   await getLoggedUser().then((user) => {
    //     console.log('user: ', user);
    //     set({ logged: user });
    //   });
    // },
    // Add a function to update loggedUser
    setLoggedUser: (userData) => {
      console.log('user: ', userData);
      set({ logged: userData?.user, token: userData?.token });
    },
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
