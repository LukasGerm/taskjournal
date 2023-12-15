import { getAuth, signOut } from "firebase/auth";
import { useSession } from "../lib/user.selectors";

export const Home = () => {
  const user = useSession();

  return (
    <div>
      <h1>Home</h1>
      <p>{user?.email}</p>
      <button onClick={() => signOut(getAuth())}>Sign Out</button>
    </div>
  );
};
