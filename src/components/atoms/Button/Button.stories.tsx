import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta = {
  title: "Atoms/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "primary",
    children: "Primary Button",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Button",
  },
};

export const PrimaryDisabled: Story = {
  args: {
    variant: "primary",
    children: "Primary Button",
    disabled: true,
  },
};

export const SecondaryDisabled: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Button",
    disabled: true,
  },
};

export const AllVariants: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  render: (args) => {
    const variants = ["primary", "secondary"] as const;

    return (
      <div className="flex flex-col gap-8 p-8">
        {variants.map((variant) => (
          <div key={variant} className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold opacity-70 capitalize">
              {variant}
            </h4>
            <div className="flex gap-4">
              <Button
                variant={variant}
                {...args}
                onClick={() => console.log("ButtonClicked")}
              >
                {variant.charAt(0).toUpperCase() + variant.slice(1)} Button
              </Button>
              <Button
                variant={variant}
                disabled
                {...args}
                onClick={() => console.log("ButtonClicked")}
              >
                Disabled
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  },
};
