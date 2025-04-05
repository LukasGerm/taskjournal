import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignIn } from "@/components/features/authentication/sign-in.tsx";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  pendingComponent: () => <div>Loading...</div>,
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({
        to: "/app",
      });
    }
    const authenticated = await context.isAuthenticated();

    if (authenticated) {
      throw redirect({
        to: "/app",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

function RouteComponent() {
  return (
    <div className="w-full h-screen flex items-center justify-center mr-auto ml-auto">
      <div className="w-[400px] bg-card rounded">
        <SignIn />
      </div>
    </div>
  );
}
