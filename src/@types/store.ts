import { IUser } from "./user";

export interface IAuth {
  user: IUser | null;
  token: string | null;
  setUser: (user: IUser, token: string) => void;
  removeUser: () => void;
}
