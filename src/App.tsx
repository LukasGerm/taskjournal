import { Match, Switch } from "solid-js";
import { Auth } from "./routes/Auth";
import { Home } from "./routes/Home";
import { useObserveSession } from "./components/hooks/user.selectors";

// type ValidationFunction = ({ value }: { value: string }) => Promise<unknown>;

/* declare module "solid-js" {
  namespace JSX {
    interface Directives {
      formSubmit: (form: HTMLFormElement) => void;
      validate: ValidationFunction[];
    }
  }
}*/

export const App = () => {
  const state = useObserveSession();

  return (
    <Switch fallback={<Auth />}>
      <Match when={state.loading}>
        <p>Loading...</p>
      </Match>
      <Match when={state.error}>
        <p>ERROR</p>
      </Match>
      <Match when={state.data}>
        <Home />
      </Match>
    </Switch>
  );
};
