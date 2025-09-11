import { cva, type VariantProps } from "class-variance-authority";
import type { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import { forwardRef } from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

const buttonVariants = cva(
  "inline-flex items-center justify-center transition-colors text-font-primary relative overflow-hidden \
  cursor-pointer disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-70",
  {
    variants: {
      variant: {
        default:
          "bg-neutral-0 border enabled:active:bg-neutral-100 border-border text-font-primary",
        primary: "bg-primary enabled:active:bg-primary-600 text-neutral-0",
        success: "bg-success enabled:active:bg-success-400 text-neutral-0",
        destructive: "bg-danger enabled:active:bg-danger-600 text-neutral-0",
        info: "bg-info enabled:active:bg-info-600 text-neutral-0",
        warning: "bg-warning enabled:active:bg-warning-600 text-neutral-0",
      },
      size: {
        sm: "h-10 px-3 text-sm rounded-sm",
        md: "h-12 px-4 text-base rounded-md",
        lg: "h-14 px-6 text-lg rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export const Button = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<ButtonProps>
>(({ variant, size, children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={twMerge(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";
