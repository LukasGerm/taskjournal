import { Outlet, redirect, createFileRoute } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { AppSideBar } from "@/modules/side-bar/app-side-bar.tsx";

const SidebarSkeleton = () => (
  <div className="w-64 h-screen bg-muted/40 p-4 animate-pulse">
    {/* Header Skeleton */}
    <div className="flex items-center gap-2 mb-6">
      <div className="w-10 h-10 rounded-full bg-muted"></div>
      <div className="w-24 h-4 rounded bg-muted"></div>
    </div>
    {/* Menu Item Skeletons */}
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-muted"></div>
          <div className="w-full h-4 rounded bg-muted"></div>
        </div>
      ))}
    </div>
  </div>
);

// Skeleton component for the content area
const ContentSkeleton = () => (
  <div className="flex-1 p-6 animate-pulse">
    <div className="w-3/4 h-8 mb-6 rounded bg-muted"></div>
    <div className="space-y-4">
      <div className="w-full h-4 rounded bg-muted"></div>
      <div className="w-full h-4 rounded bg-muted"></div>
      <div className="w-5/6 h-4 rounded bg-muted"></div>
      <div className="w-full h-4 rounded bg-muted"></div>
      <div className="w-1/2 h-4 rounded bg-muted"></div>
    </div>
  </div>
);

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
  pendingComponent: () => (
    <div className="flex flex-row min-h-screen">
      <SidebarSkeleton />
      <div className="flex-1 flex flex-col">
        <ContentSkeleton />
      </div>
    </div>
  ),
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
