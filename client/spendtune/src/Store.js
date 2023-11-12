import {create} from "zustand";
import { persist } from 'zustand/middleware';
import { getLoggedUser } from "./apiService";

const createLoggedStore = persist(
  (set, get) => ({
    logged: null,
    linkedBanks: {},
    // fetches logged user from the server and updates the store
    fetchLoggedUser: async () => {
      await getLoggedUser()
        .then(user => set({logged: user}))
    },
    // Add a function to update loggedUser
    setLoggedUser: (user) => set({logged: user}),
    // Add a function to update linkedBanks
    setLinkedBanks: (banks) => set({linkedBanks: banks}),
  }),
  // config for persist middleware storage
  {
    name: 'logged-store',
    getStorage: () => localStorage,
  }
)

export const useCombinedStore = create((...params) => ({
  ...createLoggedStore(...params)
}))