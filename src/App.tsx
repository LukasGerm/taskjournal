import { useObserveSession } from "./lib/user.selectors";

function App() {
  const { authenticated } = useObserveSession();
  // return auth router
  if (!authenticated()) {
    return <div>loading...</div>;
  }
  // return app router
  return <></>;
}

export default App;
