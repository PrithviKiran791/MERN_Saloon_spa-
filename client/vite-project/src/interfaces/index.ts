export interface Iuser {
  _id: string;
  name: string;
  email: string;
  role: "user" | "owner";
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUsersStore {
  user: Iuser | null;
  setUser: (user: Iuser) => void;
}