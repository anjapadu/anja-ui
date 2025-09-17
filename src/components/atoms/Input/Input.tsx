import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants>;

const inputVariants = cva(
  "px-2 border-border border box-border text-font-primary placeholder-font-secondary",
  {
    variants: {
      appearance: {
        default: "outline-neutral-300 disabled:opacity-75",
        error: "outline-danger border-danger",
        success: "outline-success border-success",
      },
      inputSize: {
        sm: "h-field-sm text-sm field-radius",
        md: "h-field-md text-md field-radius",
        lg: "h-field-lg text-xl field-radius",
      },
    },
    defaultVariants: {
      inputSize: "sm",
      appearance: "default",
    },
  }
);

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ appearance, inputSize, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={twMerge(inputVariants({ appearance, inputSize }), className)}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
