import { Switch as HSwitch, type SwitchProps } from "@headlessui/react";
import { cva, type VariantProps } from "class-variance-authority";

const switchVariants = cva(
  "group relative flex cursor-pointer rounded-full bg-primary/50 p-1 ease-in-out \
  focus:not-data-focus:outline-none data-checked:bg-primary data-focus:outline \
  data-focus:outline-white transition-colors shadow-lg \
  disabled:bg-neutral-400/30 disabled:[&>span]:bg-white/70 data-checked:disabled:bg-primary/50",
  {
    variants: {
      size: {
        sm: "h-7 w-14 ",
        md: "h-8 w-16",
        lg: "h-9 w-18 ",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
);

const circleVariants = cva(
  "pointer-events-none inline-block translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
  {
    variants: {
      size: {
        sm: "size-5 group-data-checked:translate-x-7",
        md: "size-6 group-data-checked:translate-x-8",
        lg: "size-7 group-data-checked:translate-x-9",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
);

type SwitchComponentProps = SwitchProps & VariantProps<typeof switchVariants>;

export function Switch({ size, ...props }: SwitchComponentProps) {
  return (
    <HSwitch className={switchVariants({ size })} {...props}>
      <span aria-hidden="true" className={circleVariants({ size })} />
    </HSwitch>
  );
}
