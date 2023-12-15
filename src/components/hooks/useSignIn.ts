import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export const useSignIn = () => {
  return (fields: { email: string; password: string }) => {
    const { email, password } = fields;
    const auth = getAuth();
    return signInWithEmailAndPassword(auth, email, password);
  };
};
