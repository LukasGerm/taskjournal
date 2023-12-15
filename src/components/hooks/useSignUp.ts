import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

export const useSignUp = () => {
  return (fields: { email: string; password: string }) => {
    const { email, password } = fields;
    const auth = getAuth();
    return createUserWithEmailAndPassword(auth, email, password);
  };
};
