import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";
import { ComboboxField, type ComboboxFieldProps } from "./ComboBoxField";

type Person = { value: string | number; label: string };

function ComboboxPerson(
  props: Omit<
    ComboboxFieldProps,
    "items" | "value" | "onChange" | "getLabel"
  > & {
    items?: Person[];
  }
) {
  const [value, setValue] = useState<Person | null | undefined>(null);

  const items = useMemo<Person[]>(
    () =>
      props.items ?? [
        { value: "1", label: "Durward Reynolds" },
        { value: "2", label: "Kenton Towne" },
        { value: "3", label: "Therese Wunsch" },
        { value: "4", label: "Benedict Kessler" },
        { value: "5", label: "Katelyn Rohan" },
        { value: "6", label: "Gustavo Yance" },
      ],
    [props.items]
  );

  return (
    <div style={{ width: 300 }}>
      <ComboboxField
        items={items}
        value={value || null}
        getLabel={(p) => p.label}
        variant="floating"
        {...props}
        id="assignee"
        onChange={setValue}
      />
    </div>
  );
}

const meta = {
  title: "Molecules/ComboboxField",
  component: ComboboxPerson,
  parameters: {
    layout: "centered",
    controls: { expanded: true },
  },
  argTypes: {
    size: {
      control: { type: "radio" },
      options: ["sm", "md", "lg"],
    },
    variant: {
      control: { type: "radio" },
      options: ["floating", "placeholder"],
    },
    label: { control: "text" },
    placeholder: { control: "text" },
    hint: { control: "text" },
    error: { control: "text" },

    virtualized: { control: "boolean" },
    virtualThreshold: { control: "number" },

    className: { table: { disable: true } },
    inputProps: { table: { disable: true } },
  },
  args: {
    label: "Assignee",
    size: "sm",
    variant: "floating",
    virtualized: true,
    virtualThreshold: 200,
    placeholder: "Select…",
    hint: "",
    error: "",
  },
} satisfies Meta<typeof ComboboxPerson>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FloatingLabel: Story = {
  name: "Floating label",
  args: {
    variant: "floating",
    size: "sm",
    id: "",
  },
};

export const PlaceholderVariant: Story = {
  name: "Placeholder variant",
  args: {
    variant: "placeholder",
    size: "sm",
    label: "Assignee",
    placeholder: "Search person…",
    id: "",
  },
};
