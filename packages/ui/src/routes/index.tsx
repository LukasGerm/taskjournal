import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignIn } from "@/components/features/authentication/sign-in.tsx";
import z from "zod";
import { SignUp } from "@/components/features/authentication/sign-up.tsx";

const authenticationSearchValidator = z.object({
  auth: z.enum(["login", "register"]).catch("login"),
});

export const Route = createFileRoute("/")({
  component: RouteComponent,
  validateSearch: authenticationSearchValidator,
  beforeLoad: ({ context }) => {
    if (context.user) {
      throw redirect({
        to: "/app",
      });
    }
  },
});

function RouteComponent() {
  const { auth } = Route.useSearch();
  return (
    <div className="w-full h-screen flex items-center justify-center mr-auto ml-auto">
      <div className="w-[400px] bg-card rounded">
        {auth === "login" ? <SignIn /> : <SignUp />}
      </div>
    </div>
  );
}
