import { render, fireEvent, screen, waitFor } from "@solidjs/testing-library";
import { RegisterForm } from "../RegisterForm";
import userEvent from "@testing-library/user-event";
const user = userEvent.setup();

describe("RegisterForm", () => {
  it("shows error if password is too short", async () => {
    render(() => <RegisterForm />);
    const email = screen.getByLabelText("E-Mail");
    const passwordInput = screen.getByLabelText("Password");
    const conformPassword = screen.getByLabelText("Confirm Password");

    fireEvent.change(passwordInput, { target: { value: "123" } });
    fireEvent.change(conformPassword, { target: { value: "123" } });
    fireEvent.change(email, { target: { value: "test@test.de" } });

    await user.click(screen.getByRole("button"));

    expect(
      screen.getByText("Password must be at least 6 characters")
    ).toBeVisible();
  });
  it("shows error if password does not match with confirm password", async () => {
    render(() => <RegisterForm />);
    const email = screen.getByLabelText("E-Mail");
    const passwordInput = screen.getByLabelText("Password");
    const conformPassword = screen.getByLabelText("Confirm Password");

    fireEvent.change(passwordInput, { target: { value: "123456" } });
    fireEvent.change(conformPassword, { target: { value: "1234567" } });
    fireEvent.change(email, { target: { value: "test@test.de" } });

    await user.click(screen.getByRole("button"));

    expect(screen.getByText("Passwords do not match")).toBeVisible();
  });
});
