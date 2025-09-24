import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";

type MockOption = { label: string; value: string | number };
type VirtualChild = (args: { option: MockOption }) => React.ReactNode;
type OptionState = { focus: boolean; selected: boolean; disabled: boolean };

vi.mock("@headlessui/react", () => {
  const Combobox: React.FC<React.PropsWithChildren> = ({ children }) => (
    <div>{children}</div>
  );

  const ComboboxInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (
    props
  ) => <input role="combobox" {...props} />;

  const ComboboxOptions: React.FC<{
    children: React.ReactNode | VirtualChild;
  }> = ({ children }) => (
    <div role="listbox">
      {typeof children === "function"
        ? (children as VirtualChild)({
            option: { label: "Cherry", value: "cherry" },
          })
        : children}
    </div>
  );

  const ComboboxOption: React.FC<{
    children: React.ReactNode | ((state: OptionState) => React.ReactNode);
    value?: unknown;
    className?: string;
  }> = ({ children }) => (
    <div role="option">
      {typeof children === "function"
        ? (children as (state: OptionState) => React.ReactNode)({
            focus: true,
            selected: false,
            disabled: false,
          })
        : children}
    </div>
  );

  return { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption };
});

import { ComboboxField, type Option } from "./ComboBoxField";

afterEach(() => cleanup());

describe("ComboboxField (virtual render-prop coverage)", () => {
  it("executes the virtual branch and renders option content (getLabel path)", () => {
    const items: Option[] = [
      { label: "Apple", value: "apple" },
      { label: "Banana", value: "banana" },
      { label: "Cherry", value: "cherry" },
    ];

    render(
      <ComboboxField
        id="fruit"
        label="Fruit"
        items={items}
        value={null}
        onChange={() => {}}
        virtualized
      />
    );

    const list = screen.getByRole("listbox");
    const opts = within(list).getAllByRole("option");
    expect(opts).toHaveLength(1);
    expect(opts[0]).toHaveTextContent("Cherry");
  });

  it("executes the virtual branch with renderOption (custom renderer path)", () => {
    const items: Option[] = [
      { label: "Apple", value: "apple" },
      { label: "Banana", value: "banana" },
      { label: "Cherry", value: "cherry" },
    ];

    render(
      <ComboboxField
        id="fruit"
        label="Fruit"
        items={items}
        labelBehaviour="placeholder"
        value={null}
        onChange={() => {}}
        virtualized
        virtualThreshold={1}
        renderOption={(opt, state) => (
          <span data-testid="custom">
            {opt.label}-{String(state.focus)}-{String(state.selected)}-
            {String(state.disabled)}
          </span>
        )}
      />
    );

    const list = screen.getByRole("listbox");
    const opt = within(list).getByRole("option");
    const custom = within(opt).getByTestId("custom");

    expect(custom).toHaveTextContent("Cherry-true-false-false");
  });
});
