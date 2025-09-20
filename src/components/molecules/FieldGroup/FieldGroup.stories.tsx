import type { Meta, StoryObj } from "@storybook/react-vite";
import { FieldGroup } from "./FieldGroup";

const meta = {
  title: "Molecules/FieldGroup",
  component: FieldGroup,
  parameters: {
    layout: "centered",
    controls: { expanded: true },
  },
  argTypes: {},
} satisfies Meta<typeof FieldGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Col: Story = {
  args: {
    label: "",
    direction: "col",
  },
  render: (props) => {
    return (
      <div className="flex flex-col gap-y-2">
        <FieldGroup {...props} label="First name" />
        <FieldGroup {...props} label="Last name" />
      </div>
    );
  },
};

export const Row: Story = {
  args: {
    label: "",
    direction: "row",
  },
  render: (props) => {
    return (
      <div className="flex flex-col gap-y-2 w-96">
        <FieldGroup {...props} label="First name" />
        <FieldGroup {...props} label="Last name" />
      </div>
    );
  },
};

export const Floating: Story = {
  args: {
    label: "",
    direction: "floating",
  },
  render: (props) => {
    return (
      <div className="flex-col gap-y-2 w-96 grid grid-cols-2 gap-x-2">
        <FieldGroup {...props} label="First name" />
        <FieldGroup {...props} label="Last name" />
      </div>
    );
  },
};
