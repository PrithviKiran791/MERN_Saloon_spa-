import type { Iuser } from '../interfaces/index';
import { create } from 'zustand';

const userGlobalStore = create((set) => ({
  user : null,
  setUser: () => set((payload:Iuser) => set(() => ({ user: payload })),

}));

export default userGlobalStore ;