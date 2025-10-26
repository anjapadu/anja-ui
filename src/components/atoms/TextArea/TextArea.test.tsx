import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { TextArea } from "./TextArea";

describe("<TextArea /> (unit/jsdom)", () => {
  afterEach(() => {
    cleanup();
  });
  it("renders with placeholder and has role textbox", () => {
    render(<TextArea placeholder="Your message" />);
    const el = screen.getByRole("textbox", { name: "" });
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute("placeholder", "Your message");
  });

  it("applies default variants (appearance=default, textAreaSize=sm)", () => {
    render(<TextArea />);
    const el = screen.getByRole("textbox");
    expect(el).toHaveClass("min-h-[80px]");
    expect(el).toHaveClass("text-sm");
    expect(el).toHaveClass("outline-neutral-300");
    expect(el).toHaveClass("border");
  });

  it("is non-resizable by default", () => {
    render(<TextArea />);
    const el = screen.getByRole("textbox");
    expect(el).toHaveClass("resize-none");
  });

  it("can be made resizable via resizable prop", () => {
    render(<TextArea resizable />);
    const el = screen.getByRole("textbox");
    expect(el).not.toHaveClass("resize-none");
  });

  it("applies size + variant classes", () => {
    render(<TextArea textAreaSize="md" appearance="error" />);
    const el = screen.getByRole("textbox");
    expect(el).toHaveClass("min-h-[120px]", "text-md", "field-radius");
    expect(el).toHaveClass("outline-danger", "border-danger");
  });

  it("merges className via twMerge (caller wins on conflicts)", () => {
    render(<TextArea textAreaSize="sm" className="min-h-20 custom" />);
    const el = screen.getByRole("textbox");
    expect(el).toHaveClass("custom", "min-h-20");
    expect(el).not.toHaveClass("min-h-[80px]");
  });

  it("forwards ref to the native textarea element", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<TextArea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("passes through native props (disabled)", () => {
    render(<TextArea disabled />);
    const el = screen.getByRole("textbox");
    expect(el).toBeDisabled();
  });

  it("fires onChange when typing (controlled)", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TextArea value="" onChange={onChange} />);
    const el = screen.getByRole("textbox");
    await user.type(el, "hi");
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("accepts defaultValue (uncontrolled)", async () => {
    const user = userEvent.setup();
    render(<TextArea defaultValue="foo" />);
    const el = screen.getByDisplayValue("foo") as HTMLTextAreaElement;
    await user.type(el, "bar");
    expect(el.value).toBe("foobar");
  });
});
