import { Component } from "solid-js";
import { createStore } from "solid-js/store";
import { useSignUp } from "./hooks/useSignUp";
import { Input } from "./atoms/Input";
import { Button } from "./atoms/Button";

const useSubmitForm = () => {
  const [errors, setErrors] = createStore<{
    password?: string;
    confirmPassword?: string;
    signUp?: string;
  }>();

  const signUp = useSignUp();

  const validate = (fields: {
    email: FormDataEntryValue | null;
    password: FormDataEntryValue | null;
    confirmPassword: FormDataEntryValue | null;
  }) => {
    if (!fields.confirmPassword) {
      setErrors({ confirmPassword: "Confirm password is required" });
      return false;
    }

    if (!fields.password) {
      setErrors({ password: "Password is required" });
      return false;
    }
    setErrors({ password: undefined });
    if (fields.password && fields.password.toString().length < 6) {
      setErrors({ password: "Password must be at least 6 characters" });
      return false;
    }
    if (fields.password !== fields.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return false;
    }
    setErrors({ confirmPassword: undefined });

    return true;
  };

  const onSubmit = (e: Event) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (!validate({ email, password, confirmPassword })) {
      return;
    }

    signUp({ email: email as string, password: password as string }).catch(
      (e) => {
        const errorMessage = e.message;
        setErrors({ signUp: errorMessage });
      }
    );
  };
  return { onSubmit, errors };
};

const RegisterForm: Component = () => {
  const { onSubmit, errors } = useSubmitForm();

  return (
    <div class="flex gap-5 flex-col">
      <h1 class="text-2xl text-gray-100">Register</h1>
      {errors.signUp && <p class="text-red-500 text-xs">{errors.signUp}</p>}
      <form onSubmit={onSubmit}>
        <div class="mb-4">
          <Input
            label="E-Mail"
            name="email"
            type="email"
            placeholder="joe@test.com"
          />
        </div>

        <div class="mb-4">
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="******************"
            error={errors.password}
          />
        </div>
        <div class="mb-6">
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="******************"
            error={errors.confirmPassword}
          />
        </div>
        <div class="flex items-center justify-between">
          <a
            class="inline-block align-baseline font-bold text-sm text-gray-100 "
            href="/"
          >
            Already got an account?
          </a>
          <Button type="submit">Register</Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
