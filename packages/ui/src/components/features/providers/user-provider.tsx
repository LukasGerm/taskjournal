import { createContext, useState } from "react";
import { getProfile } from "@/adapters/auth.adapter.ts";
import { AuthProfile } from "shared/src/generated";

interface GuestProfile {
  username: "Guest";
  isGuest: true;
}

export interface UserState {
  user: AuthProfile | GuestProfile;
}

function isGuest(user?: AuthProfile | GuestProfile): user is GuestProfile {
  return Boolean(
    user && "isGuest" in user && user.isGuest && user.username === "Guest",
  );
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
      if (isGuest(state?.user)) return true;
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
