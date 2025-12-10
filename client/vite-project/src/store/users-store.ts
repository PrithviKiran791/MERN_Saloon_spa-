import { create } from 'zustand';
import type { Iuser } from '../interfaces/index';

interface UsersState {
  user: Iuser | null;
  setUser: (payload: Iuser | null) => void;
}

const store = create<UsersState>((set) => ({
  user: null,
  setUser: (payload: Iuser | null) => set({ user: payload }),
}));

export const useUsersStore = store;
export default useUsersStore;
export type { UsersState as IUsersStore };