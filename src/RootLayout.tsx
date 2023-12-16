import { ParentComponent } from "solid-js";

export const RootLayout: ParentComponent = (props) => {
  return (
    <div class="px-4 py-4 h-screen bg-background text-gray-100 font-light">
      {props.children}
    </div>
  );
};
