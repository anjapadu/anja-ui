import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { forwardRef } from "react";
import {
  Textarea as HTextarea,
  type TextareaProps as HTextareaProps,
} from "@headlessui/react";

export type TextAreaProps = HTextareaProps &
  VariantProps<typeof textAreaVariants> & {
    className?: string;
    resizable?: boolean;
  };

const textAreaVariants = cva(
  "px-2 py-2 border-border border box-border text-font-primary placeholder-font-secondary w-full leading-normal focus-visible:outline-1 bg-[var(--input-color-bg)]",
  {
    variants: {
      appearance: {
        default: "outline-neutral-300 disabled:opacity-75 border-neutral-200",
        error: "outline-danger border-danger",
        success: "outline-success border-success",
      },
      textAreaSize: {
        sm: "min-h-[80px] text-sm field-radius",
        md: "min-h-[120px] text-md field-radius",
        lg: "min-h-[160px] text-xl field-radius",
      },
    },
    defaultVariants: {
      textAreaSize: "sm",
      appearance: "default",
    },
  }
);

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ appearance, textAreaSize, className, resizable = false, ...props }, ref) => {
    return (
      <HTextarea
        ref={ref}
        className={twMerge(
          textAreaVariants({ appearance, textAreaSize }),
          !resizable && "resize-none",
          className
        )}
        {...props}
      />
    );
  }
);

TextArea.displayName = "TextArea";
