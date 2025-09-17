import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckboxField } from "./CheckBoxField";

const meta = {
  title: "Molecules/CheckboxField",
  component: CheckboxField,
  parameters: {
    layout: "centered",
    controls: { expanded: true },
  },
  argTypes: {
    size: {
      control: { type: "radio" },
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof CheckboxField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "New comments",
    id: "someid",
    description: "Get notified when someones posts a comment on a posting.",
  },
};
