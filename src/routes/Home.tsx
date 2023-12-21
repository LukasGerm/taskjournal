import { getAuth, signOut } from "firebase/auth";
import { useSession } from "../components/hooks/user.selectors";
import { Todos } from "./Todos";

export const Home = () => {
  const user = useSession();

  return (
    <div>
      <h1>Home</h1>
      <p>{user?.email}</p>
      <Todos />
      <button onClick={() => signOut(getAuth())}>Sign Out</button>
    </div>
  );
};
