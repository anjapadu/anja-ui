import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input";

const meta = {
  title: "Atoms/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VariantsMatrix: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  args: {
    placeholder: "A placeholder",
  },
  render: (args) => {
    const variants = ["default", "error", "success"] as const;
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
                  <div className="w-24 shrink-0 text-xs opacity-60">
                    {variant}
                  </div>

                  <div className="flex gap-2">
                    <Input appearance={variant} inputSize={size} {...args} />
                    {/* <Input
                      variant={variant}
                      inputSize={size}
                      disabled
                      {...args}
                    /> */}
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

export const Default: Story = {
  args: {
    placeholder: "A placeholder",
    inputSize: "sm",
    appearance: "default",
  },
};
