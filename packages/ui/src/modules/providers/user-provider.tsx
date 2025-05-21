import { createContext, useState } from "react";
import { getProfile } from "@/adapters/auth.adapter.ts";
import { AuthProfile } from "shared/src/generated";
import { getValue, setValue } from "@/adapters/store.adapter.ts";

export const USER_PROFILE_KEY = "user-profile";

interface GuestProfile {
  username: "Guest";
  isGuest: true;
}

export interface UserState {
  user: AuthProfile | GuestProfile;
}

export const UserContext = createContext<{
  user: UserState | null;
  updateUser: (user: UserState) => Promise<void>;
  isAuthenticated: () => Promise<boolean>;
} | null>(null);

export const UserProvider = (props: React.PropsWithChildren) => {
  const [state, setState] = useState<UserState | null>(null);

  const updateUser = async (user: UserState) => {
    await setValue(USER_PROFILE_KEY, user);
    setState(user);
  };

  const isAuthenticated = async () => {
    try {
      let userState = await getValue<UserState>(USER_PROFILE_KEY);
      // If nothing is in local storage, fetch from server
      if (!userState) {
        const profile = await getProfile();
        userState = { user: profile };
      }

      await updateUser(userState);
      return true;
    } catch (e) {
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
