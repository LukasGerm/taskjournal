import { useMutation } from "@tanstack/react-query";
import { signUpEmailPassword } from "@/adapters/auth.adapter.ts";

export const useSignUpEmailPassword = () => {
  return useMutation({
    mutationFn: (data: { email: string; username: string; password: string }) =>
      signUpEmailPassword(data),
  });
};
