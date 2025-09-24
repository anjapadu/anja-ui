import { Checkbox as HCheckbox, type CheckboxProps } from "@headlessui/react";
import { cva, type VariantProps } from "class-variance-authority";
import type { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

const checkboxVariants = cva("cursor-pointer select-none", {
  variants: {
    appearance: {
      checkbox:
        "relative group block rounded border-2 box-border border-primary-700 bg-transparent data-checked:bg-primary size-[var(--cb-size)]",
      box: "relative group flex items-center \
          justify-center boder border py-2 rounded-md \
          border-primary cursor-pointer  transition-all min-w-40 overflow-hidden \
          data-checked:bg-primary-200 dark:data-checked:bg-primary font-medium box-border hover:data-checked:bg-transparent \
          hover:data-[checked]:after:content-['✕'] hover:data-[checked]:after:absolute hover:data-[checked]:after:top-1 hover:data-[checked]:after:right-1.5 hover:data-[checked]:after:text-font-primary hover:data-[checked]:after:text-xs \
          hover:not-data-[checked]:after:content-['✔'] hover:not-data-[checked]:after:absolute hover:not-data-[checked]:after:top-1 hover:not-data-[checked]:after:right-1.5 hover:not-data-[checked]:after:text-font-primary hover:not-data-[checked]:after:text-xs",
    },
    size: {
      sm: "[--cb-size:var(--chekbox-sm)]",
      md: "[--cb-size:var(--chekbox-md)]",
      lg: "[--cb-size:var(--chekbox-lg)]",
    },
  },
  defaultVariants: {
    size: "sm",
    appearance: "checkbox",
  },
});

const focusCircleVariants = cva(
  "size-0 pointer-events-none absolute top-1/2 left-1/2 \
  -translate-x-1/2 -translate-y-1/2 transform-gpu \
  rounded-full bg-primary-100/80 -z-10 dark:bg-primary-100/10 \
  transition-all",
  {
    variants: {
      appearance: {
        checkbox: "group-hover:size-[var(--circle-cb-size)] duration-200",
        box: "group-hover:size-96 duration-200 group-hover:data-[checked]:bg-primary-50",
      },
      size: {
        sm: "[--circle-cb-size:var(--chekbox-bg-sm)]",
        md: "[--circle-cb-size:var(--chekbox-bg-md)]",
        lg: "[--circle-cb-size:var(--chekbox-bg-lg)]",
      },
    },
    defaultVariants: {
      size: "sm",
      appearance: "checkbox",
    },
  }
);

export type CheckBoxProps = VariantProps<typeof checkboxVariants> &
  Omit<CheckboxProps, "children"> & {
    hoverBackground?: boolean;
    className?: string;
  };

export function CheckBox({
  checked,
  onChange,
  appearance,
  size,
  hoverBackground = true,
  children,
  className,
  ...props
}: PropsWithChildren<CheckBoxProps>) {
  return (
    <div className="relative isolate">
      <HCheckbox
        checked={checked}
        onChange={onChange}
        {...props}
        className={twMerge(
          checkboxVariants({
            size,
            appearance,
          }),
          className
        )}
      >
        {hoverBackground && (
          <div className={twMerge(focusCircleVariants({ size, appearance }))} />
        )}

        {appearance === "box" ? (
          children
        ) : (
          <svg
            className="stroke-white opacity-0 group-hover:opacity-100 dark:group-hover:opacity-50 group-data-checked:opacity-100"
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
        )}
      </HCheckbox>
    </div>
  );
}
