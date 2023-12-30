import { getAuth, signOut } from "firebase/auth";
import { Todos } from "../components/organisms/Todos";
import { Route, Router } from "@solidjs/router";
import { ParentComponent } from "solid-js";
import { Button } from "../components/atoms/Button";
import { RootLayout } from "../RootLayout";

const Layout: ParentComponent = (props) => {
  return (
    <div>
      <div class="flex justify-end w-full absolute box-border items-end px-4 py-4">
        <div>
          <Button onClick={() => signOut(getAuth())}>Sign out</Button>
        </div>
      </div>
      <RootLayout>{props.children}</RootLayout>
    </div>
  );
};

export const Home = () => {
  return (
    <Router root={Layout}>
      <Route path="/" component={Todos} />
    </Router>
  );
};
