import {create} from "zustand";
import { persist } from 'zustand/middleware';
import { getLoggedUser } from "./apiService";

const createLoggedStore = persist(
  (set, get) => ({
    logged: null,
    // fetches logged user from the server
    fetchLoggedUser: async () => {
      await getLoggedUser()
        .then(user => set({logged: user}))
        .then(()=> console.log(get().logged))
    },
    // sets logged user
    setLogged: (user) => {
      set({logged: user});
      console.log(get().logged);
    },
    // sets logged user to null
    storeLogout: () => {
      set({logged: null});
      console.log(get().logged);
    }
  }),
  {
    name: 'logged-store',
    getStorage: () => localStorage,
  }
)

export const useCombinedStore = create((...params) => ({
  ...createLoggedStore(...params)
}))