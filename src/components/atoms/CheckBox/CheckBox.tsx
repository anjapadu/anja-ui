import { Checkbox as HCheckbox, type CheckboxProps } from "@headlessui/react";
import { cva, type VariantProps } from "class-variance-authority";

const checkboxVariants = cva(
  "group block rounded border-2 box-border border-primary-700 bg-white hover:bg-primary-200 data-checked:bg-primary cursor-pointer size-[var(--cb-size)] ",
  {
    variants: {
      size: {
        sm: "[--cb-size:--spacing(5)]",
        md: "[--cb-size:--spacing(6)]",
        lg: "[--cb-size:--spacing(8)]",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
);

const focusCircleVariants = cva(
  "size-0 pointer-events-none absolute top-1/2 left-1/2 \
  -translate-x-1/2 -translate-y-1/2 transform-gpu \
  rounded-full group-hover:size-[var(--circle-cb-size)] bg-primary-100 -z-10 \
  transition-all duration-200",
  {
    variants: {
      size: {
        sm: "[--circle-cb-size:--spacing(11)] ",
        md: "[--circle-cb-size:--spacing(13)] ",
        lg: "[--circle-cb-size:--spacing(18)] ",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
);

export type CheckBoxProps = VariantProps<typeof checkboxVariants> &
  CheckboxProps & {
    hoverBackground?: boolean;
  };

export function CheckBox({
  checked,
  onChange,
  size,
  hoverBackground = true,
  ...props
}: CheckBoxProps) {
  return (
    <HCheckbox
      checked={checked}
      onChange={onChange}
      className={checkboxVariants({
        size,
      })}
      {...props}
    >
      {hoverBackground && <div className={focusCircleVariants({ size })} />}
      <svg
        className="stroke-white opacity-0 group-hover:opacity-100 group-data-checked:opacity-100"
        viewBox="0 0 14 14"
        fill="none"
      >
        <path
          d="M3 8L6 11L11 3.5"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </HCheckbox>
  );
}
