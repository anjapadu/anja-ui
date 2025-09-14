import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Badge } from "./Badge";

describe("<Badge />", () => {
  it("renders text prop", () => {
    const { getByText } = render(<Badge text="Hello" />);
    expect(getByText("Hello")).toBeInTheDocument();
  });

  it("renders children when text is not provided", () => {
    const { getByText } = render(<Badge>Child text</Badge>);
    expect(getByText("Child text")).toBeInTheDocument();
  });

  it("prefers text over children when both are provided", () => {
    const { queryByText, getByText } = render(
      <Badge text="From text">From children</Badge>
    );
    expect(getByText("From text")).toBeInTheDocument();
    expect(queryByText("From children")).toBeNull();
  });

  it("renders dot when hasDot is true with correct size/color classes", () => {
    const { container } = render(
      <Badge hasDot size="sm" color="red" text="With dot" />
    );
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
    expect(svg!.getAttribute("class")).toContain("size-1.5");
    expect(svg!.getAttribute("class")).toContain("fill-red-500");
    expect(svg!.getAttribute("aria-hidden")).toBe("true");
  });

  it("does not render dot when hasDot is false", () => {
    const { container } = render(<Badge text="No dot" />);
    expect(container.querySelector("svg")).toBeNull();
  });

  it("applies rounded, size, color and variant classes", () => {
    const { getByText } = render(
      <Badge
        text="Styled"
        rounded="full"
        size="md"
        color="red"
        variant="bordered"
      />
    );
    const el = getByText("Styled").closest("span")!;
    const cls = el.className;

    // rounded
    expect(cls).toContain("rounded-full");
    // text size
    expect(cls).toContain("text-sm");
    // variant bits (from base + bordered)
    expect(cls).toContain("inset-ring");
    expect(cls).toContain("bg-[var(--bg-badge-color)]");
    expect(cls).toContain("text-[var(--text-badge-color)]");
    // color tokens (CSS vars for red)
    expect(cls).toContain("[--bg-badge-color:var(--color-red-50)]");
    expect(cls).toContain("[--badge-ring:var(--color-red-600)]");
    expect(cls).toContain("[--text-badge-color:var(--color-red-700)]");
  });

  it("is clickable when onClick is provided and merges cursor classes correctly", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { getByText } = render(<Badge text="Click me" onClick={onClick} />);
    const el = getByText("Click me").closest("span")!;
    expect(el.className).toContain("cursor-pointer");
    expect(el.className).not.toContain("cursor-default");

    await user.click(el);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is not clickable when onClick is not provided", () => {
    const { getByText } = render(<Badge text="Static" />);
    const el = getByText("Static").closest("span")!;
    expect(el.className).toContain("cursor-default");
    expect(el.className).not.toContain("cursor-pointer");
  });

  it("applies flat variant without ring classes", () => {
    const { getByText } = render(
      <Badge text="Flat" variant="flat" color="gray" />
    );
    const el = getByText("Flat").closest("span")!;
    expect(el.className).toContain("bg-[var(--bg-badge-color)]");
    expect(el.className).not.toContain("inset-ring-neutral-200");
  });
});
