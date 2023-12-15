import { ParentComponent } from "solid-js";

export const RootLayout: ParentComponent = (props) => {
  return <div class="px-4 py-4 h-screen">{props.children}</div>;
};
