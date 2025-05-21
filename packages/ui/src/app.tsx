import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./index.css";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "@/modules/providers/user-provider.tsx";
import {
  useIsAuthenticated,
  useUser,
} from "@/modules/providers/hooks/user.hooks.ts";

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

const client = new QueryClient();

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
    <QueryClientProvider client={client}>
      <UserProvider>
        <InnerApp />
      </UserProvider>
    </QueryClientProvider>
  </StrictMode>
);
