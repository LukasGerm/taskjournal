import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createSignal } from "solid-js";

export const useSession = () => {
  const auth = getAuth();

  return auth.currentUser;
};

export const useObserveSession = () => {
  const [authenticated, setAuthenticated] = createSignal<boolean | undefined>(
    undefined
  );
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      setAuthenticated(true);
      // ...
    } else {
      setAuthenticated(false);
    }
  });

  return { authenticated };
};
