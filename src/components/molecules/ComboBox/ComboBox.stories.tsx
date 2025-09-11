import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";
import { ComboboxField, type ComboboxFieldProps } from "./ComboBox";

type Person = { id: number; name: string };

function ComboboxPerson(
  props: Omit<
    ComboboxFieldProps<Person>,
    "items" | "value" | "onChange" | "getLabel"
  > & {
    items?: Person[];
  }
) {
  const [value, setValue] = useState<Person | null>(null);

  const items = useMemo<Person[]>(
    () =>
      props.items ?? [
        { id: 1, name: "Durward Reynolds" },
        { id: 2, name: "Kenton Towne" },
        { id: 3, name: "Therese Wunsch" },
        { id: 4, name: "Benedict Kessler" },
        { id: 5, name: "Katelyn Rohan" },
        { id: 6, name: "Gustavo Yance" },
      ],
    [props.items]
  );

  return (
    <div style={{ width: 300 }}>
      <ComboboxField<Person>
        items={items}
        value={value || undefined}
        getLabel={(p) => p.name}
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
