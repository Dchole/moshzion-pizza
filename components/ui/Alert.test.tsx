import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Alert } from "@/components/ui/Alert";

describe("Alert Component", () => {
  it("should render error alerts", () => {
    render(<Alert variant="error" message="Error message" />);
    expect(screen.getByText("Error message")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveClass("text-red-800");
  });

  it("should render success alerts", () => {
    render(<Alert variant="success" message="Success message" />);
    expect(screen.getByText("Success message")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveClass("text-green-800");
  });

  it("should render warning alerts", () => {
    render(<Alert variant="warning" message="Warning message" />);
    expect(screen.getByText("Warning message")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveClass("text-amber-900");
  });

  it("should render info alerts", () => {
    render(<Alert variant="info" message="Info message" />);
    expect(screen.getByText("Info message")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveClass("text-blue-900");
  });

  it("should have proper ARIA role", () => {
    render(<Alert variant="error" message="Test" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("should not render when message is empty", () => {
    const { container } = render(<Alert variant="error" message="" />);
    expect(container.querySelector('[role="alert"]')).toBeNull();
  });
});
