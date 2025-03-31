import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { SocketConnector } from "../components/features/socket-connector.tsx";
import { BrowserPermissionProvider } from "../components/features/providers/browser-permission-provider.tsx";
import { UserState } from "@/components/features/providers/user-provider.tsx";

interface RootRouteContext {
  user: UserState | null;
  isAuthenticated: () => Promise<boolean>;
}

export const Route = createRootRouteWithContext<RootRouteContext>()({
  component: () => (
    <BrowserPermissionProvider>
      <SocketConnector />
      <div className="w-full h-full">
        <Outlet />
      </div>
      <TanStackRouterDevtools position="bottom-right" />
    </BrowserPermissionProvider>
  ),
});
