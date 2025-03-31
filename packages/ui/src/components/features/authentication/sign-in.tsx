import { Button } from "@/components/ui/atoms/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Link } from "@tanstack/react-router";

export const SignIn = () => {
  return (
    <div className="p-8">
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-xl font-bold">Welcome Back</h1>
          <h2 className="text-gray-400">Nice to see you again!</h2>
        </div>
        <Input placeholder="Username" required />
        <Input placeholder="Password" type="password" required />
        <span>
          No account yet?{" "}
          <Link
            to="/"
            search={{
              auth: "register",
            }}
            className="text-primary hover:underline"
          >
            Sign up.
          </Link>
        </span>

        <div className="flex justify-end">
          <Button>Sign In</Button>
        </div>
      </form>
    </div>
  );
};
