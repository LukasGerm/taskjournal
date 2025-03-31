import { Input } from "@/components/ui/input.tsx";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/atoms/button.tsx";
import { useSignUpEmailPassword } from "@/components/features/authentication/hooks/useSignUpEmailPassword.ts";
import { useForm } from "@tanstack/react-form";

export const SignUp = () => {
  const mutation = useSignUpEmailPassword();
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
      repeatPassword: "",
      email: "",
    },
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value);
    },
  });
  return (
    <div
      className="p-8"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-xl font-bold">Create Account</h1>
        </div>
        <form.Field
          name="email"
          children={(field) => (
            <Input
              placeholder="Email"
              required
              type="email"
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
        <form.Field
          name="username"
          children={(field) => (
            <Input
              placeholder="Username"
              required
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
        <form.Field
          name="password"
          children={(field) => (
            <Input
              placeholder="Password"
              required
              type="password"
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />
        <form.Field
          name="repeatPassword"
          children={(field) => (
            <Input
              placeholder="Repeat password"
              required
              type="password"
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          )}
        />

        <span>
          Already have an account?{" "}
          <Link
            to="/"
            search={{
              auth: "login",
            }}
            className="text-primary hover:underline"
          >
            Sign in.
          </Link>
        </span>

        <div className="flex justify-end">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting ? "..." : "Create Account"}
              </Button>
            )}
          />
        </div>
      </form>
    </div>
  );
};
