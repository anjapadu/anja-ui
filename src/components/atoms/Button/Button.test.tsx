import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";
import { createRef } from "react";
import { Button } from "./Button";

describe("<Button /> (unit/jsdom)", () => {
  afterEach(() => {
    cleanup();
  });
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: "Click me" })
    ).toBeInTheDocument();
  });
  it("renders text", () => {
    render(<Button text="Click me" />);
    expect(
      screen.getByRole("button", { name: "Click me" })
    ).toBeInTheDocument();
  });

  it("renders text when both children and text provided", () => {
    render(<Button text="Text Click me">Click me</Button>);
    expect(
      screen.getByRole("button", { name: "Text Click me" })
    ).toBeInTheDocument();
  });

  it("applies variant + size classes", () => {
    render(
      <Button variant="primary" size="lg">
        Go
      </Button>
    );
    const btn = screen.getByRole("button", { name: "Go" });
    expect(btn).toHaveClass("bg-primary");
    expect(btn).toHaveClass("h-14", "px-6");
  });

  it("merges className (twMerge caller wins)", () => {
    render(
      <Button size="md" className="px-1 custom">
        Merge
      </Button>
    );
    const btn = screen.getByRole("button", { name: "Merge" });
    expect(btn).toHaveClass("custom", "px-1");
    expect(btn).not.toHaveClass("px-4");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("respects disabled and blocks clicks", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Submit
      </Button>
    );
    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
