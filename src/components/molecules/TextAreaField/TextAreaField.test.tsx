// src/components/molecules/TextAreaField/TextAreaField.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TextAreaField } from "./TextAreaField";

describe("TextAreaField", () => {
  it("renders in floating variant by default with blank placeholder and visible label", () => {
    const { container } = render(<TextAreaField id="description" label="Description" />);

    expect(container.firstChild).toHaveClass("relative");

    const textarea = container.querySelector("textarea") as HTMLTextAreaElement;
    expect(textarea).toBeInTheDocument();
    expect(textarea.placeholder).toBe(" ");

    const label = screen.getByText("Description");
    expect(label).toBeInTheDocument();
    expect(label).not.toHaveClass("hidden");
    expect(screen.getByLabelText("Description")).toBe(textarea);
  });

  it("renders placeholder variant: hides label visually and uses label as placeholder", () => {
    const { container } = render(
      <TextAreaField id="message" label="Message" labelBehavior="placeholder" />
    );

    const textarea = container.querySelector("textarea") as HTMLTextAreaElement;
    expect(textarea.placeholder).toBe("Message");

    const label = screen.getByText("Message");
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass("hidden");
  });

  it("applies size-based padding classes on textarea for floating variant", () => {
    const { container: cm } = render(
      <TextAreaField id="m" label="Medium" textAreaSize="md" />
    );
    const im = cm.querySelector("textarea")!;
    expect(im.className).toContain("pt-6");

    const { container: cl } = render(
      <TextAreaField id="l" label="Large" textAreaSize="lg" />
    );
    const il = cl.querySelector("textarea")!;
    expect(il.className).toContain("pt-7");
  });

  it("renders hint when provided", () => {
    render(<TextAreaField id="notes" label="Notes" hint="Add any additional details" />);
    expect(screen.getByText("Add any additional details")).toBeInTheDocument();
  });

  it("renders error when provided (and does not show hint if both are present)", () => {
    render(
      <TextAreaField
        id="bio"
        label="Bio"
        hint="Tell us about yourself"
        error="Required"
      />
    );
    expect(
      screen.queryByText("Tell us about yourself")
    ).not.toBeInTheDocument();
    expect(screen.getByText("Required")).toBeInTheDocument();
  });

  it("does not crash without label and still renders a textarea", () => {
    const { container } = render(<TextAreaField id="nolabel" />);
    const textarea = container.querySelector("textarea");
    expect(textarea).toBeInTheDocument();
  });

  it("is non-resizable by default", () => {
    const { container } = render(<TextAreaField id="test" label="Test" />);
    const textarea = container.querySelector("textarea");
    expect(textarea).toHaveClass("resize-none");
  });

  it("can be made resizable via resizable prop", () => {
    const { container } = render(
      <TextAreaField id="test" label="Test" resizable />
    );
    const textarea = container.querySelector("textarea");
    expect(textarea).not.toHaveClass("resize-none");
  });
});
