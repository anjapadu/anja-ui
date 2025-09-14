import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Typography from "./Typography";

describe("<Typography />", () => {
  it("renders with defaults (variant=body → <p>, color=primary, align=left)", () => {
    render(<Typography>hello</Typography>);
    const el = screen.getByText("hello");
    expect(el.tagName).toBe("P");
    const cls = el.className;
    expect(cls).toContain("text-base");
    expect(cls).toContain("font-normal");
    expect(cls).toContain("text-font-primary");
    expect(cls).toContain("text-left");
  });

  it("renders default element per variant", () => {
    const { rerender } = render(<Typography variant="h1">A</Typography>);
    expect(screen.getByText("A").tagName).toBe("H1");

    rerender(<Typography variant="h2">B</Typography>);
    expect(screen.getByText("B").tagName).toBe("H2");

    rerender(<Typography variant="h3">C</Typography>);
    expect(screen.getByText("C").tagName).toBe("H3");

    rerender(<Typography variant="caption">D</Typography>);
    expect(screen.getByText("D").tagName).toBe("SPAN");
  });

  it("allows overriding element with `as`", () => {
    render(
      <Typography variant="h1" as="p">
        heading in p
      </Typography>
    );
    const el = screen.getByText("heading in p");
    expect(el.tagName).toBe("P");
    expect(el.className).toContain("text-4xl");
    expect(el.className).toContain("font-bold");
  });

  it("merges custom className with variant classes (tailwind-merge compatible)", () => {
    render(
      <Typography variant="h2" className="mt-2 text-center">
        styled
      </Typography>
    );
    const el = screen.getByText("styled");
    const cls = el.className;
    expect(cls).toContain("text-3xl");
    expect(cls).toContain("font-semibold");
    expect(cls).toContain("text-center");
  });

  it("applies color and align variants", () => {
    render(
      <Typography variant="body" color="danger" align="right">
        colored
      </Typography>
    );
    const el = screen.getByText("colored");
    const cls = el.className;
    expect(cls).toContain("text-danger");
    expect(cls).toContain("text-right");
  });

  it("prioritizes `text` over `children`", () => {
    render(<Typography text="from text">from children</Typography>);
    expect(screen.getByText("from text")).toBeInTheDocument();
    expect(screen.queryByText("from children")).toBeNull();
  });

  it("renders children when `text` is undefined", () => {
    render(<Typography>only children</Typography>);
    expect(screen.getByText("only children")).toBeInTheDocument();
  });

  it("forwards ref to the rendered element", () => {
    const ref = createRef<HTMLHeadingElement>();
    render(
      <Typography variant="h1" ref={ref}>
        ref target
      </Typography>
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe("H1");
    expect(ref.current?.textContent).toBe("ref target");
  });

  it("passes through arbitrary props and event handlers", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Typography
        variant="caption"
        as="button"
        id="typo-btn"
        data-testid="typo"
        onClick={onClick}
      >
        press
      </Typography>
    );

    const btn = screen.getByTestId("typo");
    expect(btn.tagName).toBe("BUTTON");
    expect(btn).toHaveAttribute("id", "typo-btn");

    await user.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
