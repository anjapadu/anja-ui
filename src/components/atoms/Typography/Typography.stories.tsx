import type { Meta, StoryObj } from "@storybook/react-vite";
import { Typography } from "./Typography";

const meta = {
  title: "Atoms/Typography",
  component: Typography,
  args: {
    text: "The quick brown fox jumps over the lazy dog",
    variant: "body",
    color: "primary",
    align: "left",
  },
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["h1", "h2", "h3", "body", "caption"],
    },
    color: {
      control: "inline-radio",
      options: ["primary", "secondary", "danger", "success"],
    },
    align: {
      control: "inline-radio",
      options: ["left", "center", "right", "justify"],
    },
    as: {
      control: "text",
      description:
        "Polymorphic prop. When omitted, defaults to a semantic tag based on `variant`.",
      table: { type: { summary: "React.ElementType" } },
    },
    className: { control: "text" },
    text: { control: "text" },
    children: {
      control: false,
      table: { disable: true },
    },
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const VariantsMatrix: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  args: { text: "Typography sample" },
  render: (args) => {
    const variants = ["h1", "h2", "h3", "body", "caption"] as const;
    const colors = ["primary", "secondary", "danger", "success"] as const;

    return (
      <div className="space-y-6">
        {variants.map((v) => (
          <div key={v} className="space-y-2">
            <div className="text-xs opacity-60">{v}</div>
            <div className="flex flex-wrap gap-6 items-baseline">
              {colors.map((c) => (
                <div key={`${v}-${c}`} className="min-w-[14rem]">
                  <div className="text-[11px] opacity-60 mb-1">{c}</div>
                  <Typography {...args} variant={v} color={c} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  },
};

export const Alignments: Story = {
  args: { text: "Aligned text example that shows how the text flows." },
  render: (args) => {
    const aligns = ["left", "center", "right", "justify"] as const;
    return (
      <div className="grid grid-cols-2 gap-6 max-w-3xl">
        {aligns.map((a) => (
          <div key={a} className="border border-dashed p-3 rounded-md">
            <div className="text-[11px] opacity-60 mb-2">align: {a}</div>
            <Typography {...args} align={a} />
          </div>
        ))}
      </div>
    );
  },
};

export const PolymorphicExamples: Story = {
  parameters: { chromatic: { disableSnapshot: true } },
  render: () => (
    <div className="space-y-4">
      <Typography variant="h1">H1 (as h1 by default)</Typography>
      <br />
      <Typography variant="h2">H2 (as h2 by default)</Typography>
      <br />
      <Typography variant="body">Body (as p by default)</Typography>
      <br />
      <Typography variant="caption">Caption (as span by default)</Typography>
      <br />
      <Typography as="label" htmlFor="foo" variant="caption">
        Polymorphic label (as="label")
      </Typography>
      <br />
      <Typography
        as="a"
        href="#"
        variant="body"
        className="underline hover:opacity-80"
      >
        Polymorphic link (as="a")
      </Typography>
    </div>
  ),
};
