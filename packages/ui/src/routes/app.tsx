import { Outlet, redirect, createFileRoute } from "@tanstack/react-router";
import { ChannelOverview } from "@/components/features/channel-overview/channel-overview.tsx";

export const Route = createFileRoute("/app")({
  component: () => (
    <div className="flex flex-row gap-2">
      <ChannelOverview />
      <Outlet />
    </div>
  ),
  pendingComponent: () => <div>Loading...</div>,
  beforeLoad: async ({ context }) => {
    const authenticated = await context.isAuthenticated();

    if (!authenticated) {
      throw redirect({
        to: "/",
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.href,
        },
      });
    }
  },
});
