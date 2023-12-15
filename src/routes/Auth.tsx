import { Component, createSignal } from "solid-js";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";

export const Auth: Component = () => {
  const [currentPage, setCurrentPage] = createSignal<"login" | "register">(
    "login"
  );
  return (
    <div class="h-full flex flex-col gap-2 justify-center">
      <div>{currentPage() === "login" ? <LoginForm /> : <RegisterForm />}</div>
      <div
        onclick={() => {
          setCurrentPage((prev) => {
            return prev === "login" ? "register" : "login";
          });
        }}
      >
        {currentPage() === "login" ? "Or register" : "Or login"}
      </div>
    </div>
  );
};
