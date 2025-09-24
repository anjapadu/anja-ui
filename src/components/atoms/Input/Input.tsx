import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { forwardRef } from "react";
import {
  Input as HInput,
  type InputProps as HInputProps,
} from "@headlessui/react";

export type InputProps = HInputProps &
  VariantProps<typeof inputVariants> & {
    className?: string;
  };

const inputVariants = cva(
  "px-2 border-border border box-border text-font-primary placeholder-font-secondary w-full leading-0 focus-visible:outline-1 bg-[var(--input-color-bg)]",
  {
    variants: {
      appearance: {
        default: "outline-neutral-300 disabled:opacity-75 border-neutral-200",
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
      <HInput
        ref={ref}
        className={twMerge(inputVariants({ appearance, inputSize }), className)}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
