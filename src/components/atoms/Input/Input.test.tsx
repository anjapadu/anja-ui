import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { Input } from "./Input";

describe("<Input /> (unit/jsdom)", () => {
  afterEach(() => {
    cleanup();
  });
  it("renders with placeholder and has role textbox", () => {
    render(<Input placeholder="Your email" />);
    const el = screen.getByRole("textbox", { name: "" });
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute("placeholder", "Your email");
  });

  it("applies default variants (variant=default, inputSize=sm)", () => {
    render(<Input />);
    const el = screen.getByRole("textbox");
    expect(el).toHaveClass("h-field-sm");
    expect(el).toHaveClass("text-sm");
    expect(el).toHaveClass("outline-neutral-300");
    expect(el).toHaveClass("border");
  });

  it("applies size + variant classes", () => {
    render(<Input inputSize="md" variant="error" />);
    const el = screen.getByRole("textbox");
    expect(el).toHaveClass("h-field-md", "text-md", "field-radius");
    expect(el).toHaveClass("outline-danger", "border-danger");
  });

  it("merges className via twMerge (caller wins on conflicts)", () => {
    render(<Input inputSize="sm" className="h-8 custom" />);
    const el = screen.getByRole("textbox");
    expect(el).toHaveClass("custom", "h-8");
    expect(el).not.toHaveClass("h-10");
  });

  it("forwards ref to the native input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("passes through native props (type, disabled)", () => {
    render(<Input type="email" disabled />);
    const el = screen.getByRole("textbox");
    expect(el).toHaveAttribute("type", "email");
    expect(el).toBeDisabled();
  });

  it("fires onChange when typing (controlled)", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input value="" onChange={onChange} />);
    const el = screen.getByRole("textbox");
    await user.type(el, "hi");
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("accepts defaultValue (uncontrolled)", async () => {
    const user = userEvent.setup();
    render(<Input defaultValue="foo" />);
    const el = screen.getByDisplayValue("foo") as HTMLInputElement;
    await user.type(el, "bar");
    expect(el.value).toBe("foobar");
  });
});
