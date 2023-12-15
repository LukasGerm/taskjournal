import { render, fireEvent, screen } from "@solidjs/testing-library";
import LoginForm from "../LoginForm";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();

jest.mock("../hooks/useSignIn", () => {
  return {
    useSignIn: () => {
      return () =>
        Promise.resolve({
          user: {},
        });
    },
  };
});
describe("LoginForm", () => {
  it("shows error if password is too short", async () => {
    render(() => <LoginForm />);
    const email = screen.getByLabelText("E-Mail");

    fireEvent.change(email, { target: { value: "test@test.de" } });

    await user.click(screen.getByRole("button"));

    expect(screen.getByText("Password is required")).toBeVisible();
  });
  it("shows error if password does not match with confirm password", async () => {
    render(() => <LoginForm />);
    const passwordInput = screen.getByLabelText("Password");

    fireEvent.change(passwordInput, { target: { value: "123456" } });

    await user.click(screen.getByRole("button"));

    expect(screen.getByText("Email is required")).toBeVisible();
  });
});
