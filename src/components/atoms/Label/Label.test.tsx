import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Label } from "./Label";

describe("<Badge />", () => {
  it("renders text prop", () => {
    const { getByText } = render(<Label>Hello</Label>);
    expect(getByText("Hello")).toBeInTheDocument();
  });
});
