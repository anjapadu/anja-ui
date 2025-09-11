import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";

const meta = {
  title: "Atoms/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VariantsMatrix: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  argTypes: {
    rounded: {
      control: "select",
      options: [undefined, "full"],
    },
  },
  args: {
    rounded: undefined,
    hasDot: false,
    onClick: undefined,
  },
  render: (args) => {
    const variants = ["outlined", "bordered", "flat"] as const;
    const sizes = ["sm", "md", "lg"] as const;
    const colors = ["gray", "red", "yellow", "green"] as const;

    return (
      <div className="flex flex-col gap-8">
        {sizes.map((size) => (
          <section key={size} className="space-y-3">
            <h4 className="text-sm font-semibold opacity-70">Size: {size}</h4>

            <div className="flex flex-col gap-2">
              {variants.map((variant) => (
                <div
                  key={`${size}-${variant}`}
                  className="flex items-center gap-3"
                >
                  <div className="w-28 shrink-0 text-xs opacity-60">
                    {variant}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {colors.map((color) => (
                      <Badge
                        key={`${size}-${variant}-${color}-default`}
                        variant={variant}
                        color={color}
                        size={size}
                        {...args}
                      >
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  },
};
