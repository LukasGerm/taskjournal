import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { UserState } from "@/components/features/providers/user-provider.tsx";

interface RootRouteContext {
  user: UserState | null;
  isAuthenticated: () => Promise<boolean>;
}

export const Route = createRootRouteWithContext<RootRouteContext>()({
  component: () => (
    <div>
      <div className="w-full h-full">
        <Outlet />
      </div>
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  ),
});
