import { Component } from "solid-js";
import { createStore } from "solid-js/store";

const useSubmitForm = () => {
  const [errors, setErrors] = createStore<{
    password?: string;
    confirmPassword?: string;
  }>();

  const validate = (fields: {
    email: string;
    password: string;
    confirmPassword: string;
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
    if (fields.password.length < 6) {
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
    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
      confirmPassword: { value: string };
    };

    const email = target.email.value;
    const password = target.password.value;
    const confirmPassword = target.confirmPassword.value;

    console.log(target);

    if (!validate({ email, password, confirmPassword })) {
      return;
    }

    console.log(email, password, confirmPassword);
  };
  return { onSubmit, errors };
};

export const RegisterForm: Component = () => {
  const { onSubmit, errors } = useSubmitForm();

  return (
    <div class="flex gap-5 flex-col h-full">
      <h1 class="text-2xl">Register</h1>
      <form onSubmit={onSubmit}>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            E-Mail
          </label>
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            name="email"
            placeholder="joe@test.com"
          />
        </div>
        <div class="mb-4">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="password"
          >
            Password
          </label>
          <input
            class={
              "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            }
            id="password"
            type="password"
            name="password"
            placeholder="******************"
          />
          {errors.password && (
            <p class="text-red-500 text-xs italic">{errors.password}</p>
          )}
        </div>
        <div class="mb-6">
          <label
            class="block text-gray-700 text-sm font-bold mb-2"
            for="confirmPassword"
          >
            Confirm Password
          </label>
          <input
            class={
              "shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            }
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="******************"
          />
          {errors.confirmPassword && (
            <p class="text-red-500 text-xs italic">{errors.confirmPassword}</p>
          )}
        </div>
        <div class="flex items-center justify-end">
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};
