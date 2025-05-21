import { Outlet, redirect, createFileRoute } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { AppSideBar } from "@/modules/side-bar/app-side-bar.tsx";

export const Route = createFileRoute("/app")({
  component: () => (
    <div className="flex flex-row gap-2">
      <SidebarProvider>
        <AppSideBar />
        <div className="flex gap-2 p-4">
          <SidebarTrigger />
          <Outlet />
        </div>
      </SidebarProvider>
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
