import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckBox } from "./CheckBox";

const meta = {
  title: "Atoms/CheckBox",
  component: CheckBox,
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
} satisfies Meta<typeof CheckBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
