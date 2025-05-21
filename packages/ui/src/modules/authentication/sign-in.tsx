import { Button } from "@/components/ui/atoms/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useNavigate } from "@tanstack/react-router";
import { useUpdateUser } from "@/modules/providers/hooks/user.hooks.ts";

export const SignIn = () => {
  const navigate = useNavigate();
  const updateUser = useUpdateUser();

  const handleGuestLogin = async () => {
    await updateUser({
      user: {
        username: "Guest",
        isGuest: true,
      },
    });
    await navigate({
      href: "/app",
    });
  };

  return (
    <div className="p-8">
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-xl font-bold">Welcome Back</h1>
          <h2 className="text-gray-400">Nice to see you again!</h2>
        </div>
        <Input placeholder="https://mysyncserver.com" required />
        <Input placeholder="Username" required />
        <Input placeholder="Password" type="password" required />
        <span>
          No account?{" "}
          <span
            onClick={handleGuestLogin}
            className="text-primary hover:underline cursor-pointer"
          >
            Continue as guest
          </span>
        </span>

        <div className="flex justify-end">
          <Button>Sign In</Button>
        </div>
      </form>
    </div>
  );
};
