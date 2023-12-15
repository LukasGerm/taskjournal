import { useObserveSession } from "./lib/user.selectors";
import { Auth } from "./routes/Auth";
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
  const { authenticated } = useObserveSession();
  // return auth router
  if (!authenticated()) {
    return <Auth />;
  }
  // return app router
  return <></>;
};
