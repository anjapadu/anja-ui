import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextAreaField } from "./TextAreaField";

const meta = {
  title: "Molecules/TextAreaField",
  component: TextAreaField,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof TextAreaField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LabelBehaviorsMatrix: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  args: {
    label: "Label",
    id: "taf",
  },
  render: (args) => {
    const labelBehaviors = ["placeholder", "floating"] as const;
    const textAreaSizes = ["sm", "md", "lg"] as const;

    return (
      <div className="flex flex-col gap-8 bg-primary-200">
        {textAreaSizes.map((size) => (
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
                    <TextAreaField
                      {...args}
                      textAreaSize={size}
                      labelBehavior={labelBehavior}
                      id={`taf-${size}-${labelBehavior}-error`}
                      error="Required field"
                    />
                    <TextAreaField
                      {...args}
                      textAreaSize={size}
                      labelBehavior={labelBehavior}
                      id={`taf-${size}-${labelBehavior}-hint`}
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
    textAreaSize: "sm",
    labelBehavior: "placeholder",
  },
};

export const WithResizable: Story = {
  args: {
    id: "resizable",
    label: "Description",
    textAreaSize: "md",
    labelBehavior: "floating",
    resizable: true,
    hint: "You can resize this textarea",
  },
};

export const WithError: Story = {
  args: {
    id: "with-error",
    label: "Message",
    textAreaSize: "sm",
    labelBehavior: "floating",
    error: "This field is required",
  },
};
