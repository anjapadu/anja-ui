import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextArea } from "./TextArea";

const meta = {
  title: "Atoms/TextArea",
  component: TextArea,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const VariantsMatrix: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  args: {
    placeholder: "Enter your text here...",
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

                  <div className="flex gap-2 w-80">
                    <TextArea appearance={variant} textAreaSize={size} {...args} />
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
    placeholder: "Enter your text here...",
    textAreaSize: "sm",
    appearance: "default",
  },
};

export const Resizable: Story = {
  args: {
    placeholder: "This textarea is resizable",
    textAreaSize: "sm",
    appearance: "default",
    resizable: true,
  },
};

export const WithText: Story = {
  args: {
    placeholder: "Enter your text here...",
    textAreaSize: "md",
    appearance: "default",
    defaultValue: "This is some example text that shows how the textarea looks with content inside it.",
  },
};
