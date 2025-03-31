import { Outlet, redirect, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app")({
  component: () => (
    <div className="flex flex-row gap-2">
      <div>SIDENAV</div>
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
          redirect: location.href,
        },
      });
    }
  },
});
