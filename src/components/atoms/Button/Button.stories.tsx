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

export const VariantsMatrix: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  render: (args) => {
    const variants = [
      "default",
      "primary",
      "success",
      "destructive",
      "warning",
      "info",
      "unstyled",
    ] as const;
    const sizes = ["sm", "md", "lg"] as const;

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
                  {/* Enabled + Disabled side by side */}
                  <div className="flex gap-2">
                    <Button
                      variant={variant}
                      size={size}
                      {...args}
                      onClick={() => console.log("ButtonClicked")}
                    >
                      CTA Button
                    </Button>
                    <Button
                      variant={variant}
                      size={size}
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
          </section>
        ))}
      </div>
    );
  },
};