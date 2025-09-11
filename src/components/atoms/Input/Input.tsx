import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants>;

const inputVariants = cva(
  "px-2 border-border border box-border text-font-primary placeholder-font-secondary",
  {
    variants: {
      variant: {
        default: "outline-neutral-300 disabled:opacity-75",
        error: "outline-danger border-danger",
        success: "outline-success border-success",
      },
      inputSize: {
        sm: "h-10 text-sm rounded-sm",
        md: "h-12 text-md rounded-md",
        lg: "h-14 text-lg rounded-lg",
      },
    },
    defaultVariants: {
      inputSize: "sm",
      variant: "default",
    },
  }
);

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ variant, inputSize, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={twMerge(inputVariants({ variant, inputSize }), className)}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
