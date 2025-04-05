import { AuthProfile } from "shared/src/generated";

export const USER_PROFILE_KEY = "user-profile";

export const getProfile = async (): Promise<AuthProfile> => {
  const data = await fetch(import.meta.env.VITE_API_URL + "/auth/profile", {
    credentials: "include",
  });

  return await data.json();
};

export const signUpEmailPassword = async (data: {
  email: string;
  username: string;
  password: string;
}) => {
  const res = await fetch(import.meta.env.VITE_API_URL + "/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await res.json();
};
