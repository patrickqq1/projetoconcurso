import { IAuth } from "@/@types/store";
import { IUser } from "@/@types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const authStore = create<IAuth>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user: IUser, token: string) =>
        set({
          token,
          user,
        }),
      removeUser: () =>
        set({
          token: null,
          user: null,
        }),
    }),
    {
      name: "auth",
    }
  )
);
