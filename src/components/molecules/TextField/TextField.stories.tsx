import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "./TextField";

const meta = {
  title: "Molecules/TextField",
  component: TextField,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LabelBehaviorsMatrix: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  args: {
    label: "Label",
    id: "tf",
  },
  render: (args) => {
    const labelBehaviors = ["placeholder", "floating"] as const;
    const sizes = ["sm", "md", "lg"] as const;

    return (
      <div className="flex flex-col gap-8">
        {sizes.map((size) => (
          <section key={size} className="space-y-3">
            <h4 className="text-sm font-semibold opacity-70">Size: {size}</h4>

            <div className="flex flex-col gap-6">
              {labelBehaviors.map((labelBehavior) => (
                <div
                  key={`${size}-${labelBehavior}`}
                  className="flex items-start gap-3"
                >
                  <div className="w-28 shrink-0 text-xs opacity-60">
                    {labelBehavior}
                  </div>

                  <div className="flex flex-wrap items-start gap-4">
                    <TextField
                      {...args}
                      size={size}
                      labelBehavior={labelBehavior}
                      id={`tf-${size}-${labelBehavior}-error`}
                      error="Required field"
                    />
                    <TextField
                      {...args}
                      size={size}
                      labelBehavior={labelBehavior}
                      id={`tf-${size}-${labelBehavior}-hint`}
                      hint="This is a hint"
                    />
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
    id: "example",
    label: "Label",
    size: "sm",
    labelBehavior: "placeholder",
  },
};
