import { cva, type VariantProps } from "class-variance-authority";
import type { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

const badgeVariants = cva(
  "inline-flex items-center rounded-md font-medium px-2 py-1 cursor-default",
  {
    variants: {
      variant: {
        bordered:
          "inset-ring \
          inset-ring-[var(--badge-ring)] \
          bg-[var(--bg-badge-color)] \
          text-[var(--text-badge-color)]",

        outlined:
          "boder \
          inset-ring \
          inset-ring-neutral-200 \
          text-font-primary",

        flat: "bg-[var(--bg-badge-color)] \
        text-[var(--text-badge-color)]",
      },
      color: {
        gray: "[--bg-badge-color:var(--color-gray-50)] \
        [--badge-ring:var(--color-gray-200)] \
        [--badge-hover:var(--color-gray-400)] \
        [--text-badge-color:var(--color-gray-600)]",

        red: "[--bg-badge-color:var(--color-red-50)] \
        [--badge-hover:var(--color-red-400)] \
        [--badge-ring:var(--color-red-600)] \
        [--text-badge-color:var(--color-red-700)]",

        yellow:
          "[--bg-badge-color:var(--color-yellow-50)] \
        [--badge-hover:var(--color-yellow-400)] \
        [--badge-ring:var(--color-yellow-600)] \
        [--text-badge-color:var(--color-yellow-700)]",

        green:
          "[--bg-badge-color:var(--color-green-100)] \
        [--badge-hover:var(--color-green-700)] \
        [--badge-ring:var(--color-green-600)] \
        [--text-badge-color:var(--color-green-700)]",
      },
      rounded: {
        full: "rounded-full",
      },
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
  }
);

const circleVariant = cva(null, {
  variants: {
    size: {
      sm: "size-1.5",
      md: "size-2",
      lg: "size-2.5",
    },
    color: {
      red: "fill-red-500",
      gray: "fill-neutral-500",
      yellow: "fill-yellow-500",
      green: "fill-green-500",
    },
  },
});

export type BadgeProps = {
  text?: string;
  hasDot?: boolean;
  onClick?: () => void;
} & VariantProps<typeof badgeVariants>;

export function Badge({
  children,
  text,
  color,
  variant,
  hasDot,
  rounded,
  size,
  onClick,
}: PropsWithChildren<BadgeProps>) {
  const isClickeable = !!onClick;
  return (
    <span
      onClick={onClick}
      className={twMerge(
        badgeVariants({ color, variant, size, rounded }),
        "gap-x-1.5",
        isClickeable && "hover:bg-[var(--badge-hover)]/20 cursor-pointer"
      )}
    >
      {hasDot && (
        <svg
          viewBox="0 0 6 6"
          aria-hidden="true"
          className={circleVariant({ size, color })}
        >
          <circle r={3} cx={3} cy={3} />
        </svg>
      )}
      {text || children}
    </span>
  );
}
