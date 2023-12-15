import { Component, ParentComponent, lazy } from "solid-js";

import { Route, Router } from "@solidjs/router";

const LoginForm = lazy(() => import("../components/LoginForm"));
const RegisterForm = lazy(() => import("../components/RegisterForm"));

const Layout: ParentComponent = (props) => {
  return (
    <div class="h-full flex flex-col gap-2 justify-center">
      {props.children}
    </div>
  );
};

export const Auth: Component = () => {
  return (
    <Router root={Layout}>
      <Route path="/" component={LoginForm} />
      <Route path="/register" component={RegisterForm} />
    </Router>
  );
};
