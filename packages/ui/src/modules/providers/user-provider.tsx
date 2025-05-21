import { createContext, useState } from "react";
import { getProfile } from "@/adapters/auth.adapter.ts";
import { AuthProfile } from "shared/src/generated";
import { getValue, setValue, removeValue } from "@/adapters/store.adapter.ts";

export const USER_PROFILE_KEY = "user-profile";

interface GuestProfile {
  username: "Guest";
  isGuest: true;
  id: "0";
}

export const GUEST_PROFILE: UserState = {
  user: {
    username: "Guest",
    isGuest: true,
    id: "0",
  },
};

export interface UserState {
  user: AuthProfile | GuestProfile;
}

export const UserContext = createContext<{
  user: UserState | null;
  updateUser: (user: UserState) => Promise<void>;
  isAuthenticated: () => Promise<boolean>;
  logout: () => Promise<void>;
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

      if (!userState) {
        const profile = await getProfile();
        userState = { user: profile };
      }

      if (userState) {
        await updateUser(userState);
        return true;
      }

      await updateUser(GUEST_PROFILE);
      return false;
    } catch (e) {
      console.error("Authentication check failed:", e);
      await updateUser(GUEST_PROFILE);
      return false;
    }
  };

  const logout = async () => {
    await removeValue(USER_PROFILE_KEY);

    setState(null);
  };

  return (
    <UserContext.Provider
      value={{
        updateUser,
        user: state,
        isAuthenticated,
        logout,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
