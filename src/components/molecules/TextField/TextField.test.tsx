// src/components/molecules/TextField/TextField.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TextField } from "./TextField";

describe("TextField", () => {
  it("renders in floating variant by default with blank placeholder and visible label", () => {
    const { container } = render(<TextField id="name" label="Name" />);

    expect(container.firstChild).toHaveClass("relative");

    const input = container.querySelector("input") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.placeholder).toBe(" ");

    const label = screen.getByText("Name");
    expect(label).toBeInTheDocument();
    expect(label).not.toHaveClass("hidden");
    expect(screen.getByLabelText("Name")).toBe(input);
  });

  it("renders placeholder variant: hides label visually and uses label as placeholder", () => {
    const { container } = render(
      <TextField id="email" label="Email" labelBehavior="placeholder" />
    );

    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.placeholder).toBe("Email");

    const label = screen.getByText("Email");
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass("hidden");
  });

  it("applies size-based padding classes on input for floating variant", () => {
    const { container: cm } = render(
      <TextField id="m" label="Medium" inputSize="md" />
    );
    const im = cm.querySelector("input")!;
    expect(im.className).toContain("pt-4");

    const { container: cl } = render(
      <TextField id="l" label="Large" inputSize="lg" />
    );
    const il = cl.querySelector("input")!;
    expect(il.className).toContain("pt-5");
  });

  it("renders hint when provided", () => {
    render(<TextField id="phone" label="Phone" hint="Include country code" />);
    expect(screen.getByText("Include country code")).toBeInTheDocument();
  });

  it("renders error when provided (and does not remove hint if both are present)", () => {
    render(
      <TextField
        id="pwd"
        label="Password"
        hint="Use at least 8 characters"
        error="Required"
      />
    );
    expect(screen.getByText("Use at least 8 characters")).toBeInTheDocument();
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("does not crash without label and still renders an input", () => {
    const { container } = render(<TextField id="nolabel" />);
    const input = container.querySelector("input");
    expect(input).toBeInTheDocument();
  });
});
