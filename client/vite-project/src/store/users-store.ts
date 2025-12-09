import type { Iuser } from '../interfaces/index';
import { create } from 'zustand';

export interface IUsersStore {
  user: Iuser | null;
  setUser: (payload: Iuser) => void;
}

const userGlobalStore = create<IUsersStore>((set) => ({
  user: null,
  setUser: (payload: Iuser) => set({ user: payload }),
}));

export default userGlobalStore;