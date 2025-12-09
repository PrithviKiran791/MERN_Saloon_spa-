import type { Iuser } from '../interfaces';
import { create } from 'zustand';

// Define and export the store's interface
export interface IUsersStore {
  user: Iuser | null;
  setUser: (payload: Iuser) => void;
}

// Create the store with the defined interface
const useUserGlobalStore = create<IUsersStore>((set) => ({
  user : null,
  setUser: (payload:Iuser) => set({ user: payload }),
}));

export default useUserGlobalStore;
