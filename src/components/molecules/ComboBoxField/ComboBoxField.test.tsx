import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { ComboboxField, type Option } from "./ComboBoxField";

const ITEMS: Option[] = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
];

function setup(props?: Partial<React.ComponentProps<typeof ComboboxField>>) {
  const onChange = vi.fn();
  const utils = render(
    <ComboboxField
      id="fruit"
      label="Fruit"
      items={ITEMS}
      value={props?.value ?? null}
      onChange={onChange}
      {...props}
    />
  );
  const input = screen.getByRole("combobox") as HTMLInputElement;
  return { ...utils, input, onChange, user: userEvent.setup() };
}

async function openList(input: HTMLInputElement, user = userEvent.setup()) {
  await user.click(input);
  const foundOnFocus = screen.queryByRole("listbox");
  if (foundOnFocus) return foundOnFocus;
  await user.keyboard("{ArrowDown}");
  const list = screen.queryByRole("listbox");
  if (list) return list;
  await user.keyboard("{ArrowDown}");
  await waitFor(() => expect(screen.getByRole("listbox")).toBeInTheDocument());
  return screen.getByRole("listbox");
}

function ControlledHarness(
  props: Omit<React.ComponentProps<typeof ComboboxField>, "value" | "onChange">
) {
  const [val, setVal] = React.useState<Option | null>(null);
  return <ComboboxField {...props} value={val} onChange={(v) => setVal(v)} />;
}

function TapHarness(
  props: Omit<
    React.ComponentProps<typeof ComboboxField>,
    "value" | "onChange"
  > & {
    onChangeSpy: (v: Option | null) => void;
  }
) {
  const [val, setVal] = React.useState<Option | null>(null);
  return (
    <ComboboxField
      {...props}
      value={val}
      onChange={(v) => {
        props.onChangeSpy(v);
        setVal(v);
      }}
    />
  );
}

describe("ComboboxField", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders with label and empty value", () => {
    const { input } = setup();
    expect(screen.getByText("Fruit")).toBeInTheDocument();
    expect(input.value).toBe("");
  });

  it("shows items and filters by typing", async () => {
    const { input, user } = setup();

    let list = await openList(input, user);
    expect(within(list).getAllByRole("option")).toHaveLength(3);

    await user.clear(input);
    await user.type(input, "ap");

    list = await screen.findByRole("listbox");
    const opts = within(list).getAllByRole("option");
    expect(opts).toHaveLength(1);
    expect(within(list).getByText("Apple")).toBeInTheDocument();
  });

  it("calls onChange with the selected option and reflects label in the input", async () => {
    const onChangeSpy = vi.fn();
    render(
      <TapHarness
        id="fruit"
        label="Fruit"
        items={ITEMS}
        onChangeSpy={onChangeSpy}
      />
    );

    const input = screen.getByRole("combobox") as HTMLInputElement;
    const user = userEvent.setup();

    const list = await openList(input, user);
    await user.click(within(list).getByText("Banana"));

    expect(onChangeSpy).toHaveBeenCalledTimes(1);
    expect(onChangeSpy).toHaveBeenCalledWith(
      expect.objectContaining({ label: "Banana", value: "banana" })
    );

    await user.tab();
    expect(input.value).toBe("Banana");
  });

  it('shows "No matches" when nothing matches', async () => {
    const { input, user } = setup();
    await user.type(input, "zzzzz");
    expect(await screen.findByText("No matches")).toBeInTheDocument();
  });

  it("uses customFilter when provided", async () => {
    const customFilter = vi.fn((items: Option[], q: string) =>
      items.filter((i) => i.value.toString().startsWith(q.toLowerCase()))
    );
    const { input, user } = setup({ customFilter });

    await user.type(input, "b");
    const list = await screen.findByRole("listbox");
    const options = within(list)
      .getAllByRole("option")
      .map((o) => o.textContent);
    expect(customFilter).toHaveBeenCalled();
    expect(options).toEqual(["Banana"]);
  });

  it("sets aria-invalid when error is present", () => {
    const { input } = setup({ error: "Required" });
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("clears query on close, showing all items when reopened", async () => {
    render(<ControlledHarness id="fruit" label="Fruit" items={ITEMS} />);

    const input = screen.getByRole("combobox") as HTMLInputElement;
    const user = userEvent.setup();

    let list = await openList(input, user);
    await user.type(input, "ap");
    expect(within(list).getAllByRole("option")).toHaveLength(1);

    await user.click(within(list).getByText("Apple"));

    await waitFor(() =>
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
    );

    list = await openList(input, user);
    expect(within(list).getAllByRole("option")).toHaveLength(3);
  });

  it("respects controlled value", () => {
    const { input } = setup({ value: { label: "Cherry", value: "cherry" } });
    expect(input.value).toBe("Cherry");
  });

  it("renders hint correctly", () => {
    const { input } = setup({
      value: { label: "Cherry", value: "cherry" },
      hint: "This is a hint",
    });
    expect(input.value).toBe("Cherry");
    expect(screen.getByText("This is a hint")).toBeInTheDocument();
  });

  it("overrides the option item when using render option", async () => {
    const { input, user } = setup({
      renderOption: ({ label }) => {
        return label.split("").reverse().join("");
      },
    });

    const list = await openList(input, user);
    expect(within(list).getByText("elppA")).toBeInTheDocument();
  });

  it("uses virtual list without breaking", async () => {
    const onChangeSpy = vi.fn();
    render(
      <TapHarness
        id="fruit"
        label="Fruit"
        items={ITEMS}
        onChangeSpy={onChangeSpy}
        virtualized
      />
    );

    const input = screen.getByRole("combobox") as HTMLInputElement;
    const user = userEvent.setup();

    await openList(input, user);
    await user.type(input, "cher");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(onChangeSpy).toHaveBeenCalledWith(
      expect.objectContaining({ label: "Cherry", value: "cherry" })
    );

    await user.tab();
    expect(input.value).toBe("Cherry");
  });
});
