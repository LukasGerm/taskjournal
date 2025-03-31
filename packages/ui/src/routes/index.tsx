import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignIn } from "@/components/features/authentication/sign-in.tsx";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (context.user) {
      throw redirect({
        to: "/app",
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
