import { createContext, useState } from "react";
import { AuthProfile } from "shared/src/types/auth.types.ts";
import { getProfile } from "@/adapters/auth.adapter.ts";

export interface UserState {
  user: AuthProfile;
}

export const UserContext = createContext<{
  user: UserState | null;
  updateUser: (user: UserState) => void;
  isAuthenticated: () => Promise<boolean>;
} | null>(null);

export const UserProvider = (props: React.PropsWithChildren) => {
  const [state, setState] = useState<UserState | null>(null);

  const updateUser = (user: UserState) => {
    setState(user);
  };

  const isAuthenticated = async () => {
    try {
      const data = await getProfile();
      updateUser({ user: data });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  return (
    <UserContext.Provider
      value={{
        updateUser,
        user: state,
        isAuthenticated,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
