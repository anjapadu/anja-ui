import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./Switch";

const meta = {
  title: "Atoms/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
    controls: { expanded: true },
  },
  argTypes: {
    disabled: {
      control: { type: "boolean" },
    },
    size: {
      control: { type: "radio" },
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
