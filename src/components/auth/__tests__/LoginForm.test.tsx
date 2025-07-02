import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "../LoginForm";
import "@testing-library/jest-dom";

// Mock window.location or router jika perlu

describe("LoginForm", () => {
  it("form login dan tombol render dengan benar", () => {
    render(<LoginForm onLogin={jest.fn()} onSwitchToRegister={jest.fn()} />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /login|masuk/i })
    ).toBeInTheDocument();
  });
});
