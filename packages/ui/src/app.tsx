import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./index.css";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import {
  useIsAuthenticated,
  useUser,
} from "@/modules/providers/hooks/user.hooks.ts";
import { Providers } from "@/modules/providers.tsx"; // Updated import path

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    user: null,
    isAuthenticated: () => Promise.resolve(false),
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
const root = ReactDOM.createRoot(rootElement);

const InnerApp = () => {
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  return <RouterProvider router={router} context={{ user, isAuthenticated }} />;
};

root.render(
  <StrictMode>
    <Providers>
      {" "}
      {/* Use the Providers component to wrap InnerApp */}
      <InnerApp />
    </Providers>
  </StrictMode>
);
