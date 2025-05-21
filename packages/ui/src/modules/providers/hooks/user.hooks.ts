import { useContext } from "react";
import { UserContext } from "@/modules/providers/user-provider.tsx";

export const useUser = () => {
  const user = useContext(UserContext);
  if (!user) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return user.user!;
};

export const useUpdateUser = () => {
  const user = useContext(UserContext);
  if (!user) {
    throw new Error("useUpdateUser must be used within a UserProvider");
  }
  return user.updateUser;
};

export const useIsAuthenticated = () => {
  const user = useContext(UserContext);
  if (!user) {
    throw new Error("useIsAuthenticated must be used within a UserProvider");
  }
  return user.isAuthenticated;
};
