import { cva, type VariantProps } from "class-variance-authority";
import { TextArea, type TextAreaProps } from "../../atoms/TextArea/TextArea";
import { Label } from "../../atoms/Label/Label";
import { twMerge } from "tailwind-merge";
import { Typography } from "../../atoms/Typography/Typography";
import { useFormContext, type RegisterOptions } from "react-hook-form";
import { forwardRef } from "react";

type TextAreaFieldProps = Omit<TextAreaProps, "className"> & {
  label?: string;
  id?: string;
  error?: string;
  hint?: string;
  className?: string;
} & VariantProps<typeof textAreaFieldVariants>;

const textAreaFieldVariants = cva("relative", {
  variants: {
    labelBehavior: {
      floating: null,
      placeholder: null,
    },
    textAreaSize: {
      sm: null,
      md: null,
      lg: null,
    },
  },
  defaultVariants: {
    textAreaSize: "sm",
    labelBehavior: "floating",
  },
});

const textAreaVariants = cva(null, {
  variants: {
    labelBehavior: {
      floating: "peer",
      placeholder: "",
    },
    textAreaSize: {
      sm: null,
      md: null,
      lg: null,
    },
  },
  compoundVariants: [
    {
      labelBehavior: "floating",
      textAreaSize: "sm",
      class: `pt-5`,
    },
    {
      labelBehavior: "floating",
      textAreaSize: "md",
      class: "pt-6",
    },
    {
      labelBehavior: "floating",
      textAreaSize: "lg",
      class: "pt-7",
    },
  ],
  defaultVariants: {
    labelBehavior: "floating",
    textAreaSize: "sm",
  },
});

const labelVariants = cva("", {
  variants: {
    labelBehavior: {
      floating:
        "pointer-events-none absolute transition-all text-font-secondary \
        left-[0.55rem] top-4 \
        peer-focus:top-1 peer-[&:not(:placeholder-shown)]:top-1 leading-none",
      horizontal: "",
      placeholder: "",
    },
    textAreaSize: { sm: null, md: null, lg: null },
  },
  compoundVariants: [
    {
      labelBehavior: "floating",
      textAreaSize: "sm",
      class: `
        peer-placeholder-shown:text-sm
        peer-focus:text-[0.625rem]
        peer-[&:not(:placeholder-shown)]:text-[0.625rem]
        peer-focus:translate-y-0.5
        peer-[&:not(:placeholder-shown)]:translate-y-0.5
      `,
    },
    {
      labelBehavior: "floating",
      textAreaSize: "md",
      class: `
        peer-placeholder-shown:text-base
        peer-focus:text-xs
        peer-[&:not(:placeholder-shown)]:text-xs
        peer-focus:translate-y-1
        peer-[&:not(:placeholder-shown)]:translate-y-1
      `,
    },
    {
      labelBehavior: "floating",
      textAreaSize: "lg",
      class: `
        peer-placeholder-shown:text-lg
        peer-focus:text-sm
        peer-[&:not(:placeholder-shown)]:text-sm
        peer-focus:translate-y-1
        peer-[&:not(:placeholder-shown)]:translate-y-1
      `,
    },
  ],
  defaultVariants: { textAreaSize: "sm" },
});

export const TextAreaField = forwardRef<
  HTMLTextAreaElement,
  TextAreaFieldProps
>(
  (
    {
      textAreaSize,
      labelBehavior,
      label,
      id,
      error,
      hint,
      className,
      ...props
    },
    ref
  ) => {
    const isFloating = (labelBehavior ?? "floating") === "floating";
    return (
      <div
        className={twMerge(
          textAreaFieldVariants({ textAreaSize, labelBehavior }),
          className
        )}
      >
        <TextArea
          id={id}
          ref={ref}
          textAreaSize={textAreaSize}
          appearance={error ? "error" : undefined}
          placeholder={isFloating ? " " : label}
          className={textAreaVariants({ textAreaSize, labelBehavior })}
          {...props}
        />
        <Label
          htmlFor={id}
          className={twMerge(
            labelVariants({ textAreaSize, labelBehavior }),
            !isFloating && "hidden"
          )}
        >
          {label}
        </Label>
        {hint && !error && (
          <Typography className="text-xs absolute mt-0.5" color="secondary">
            {hint}
          </Typography>
        )}
        {error && (
          <Typography color="danger" className="text-xs absolute mt-0.5">
            {error}
          </Typography>
        )}
      </div>
    );
  }
);

TextAreaField.displayName = "TextAreaField";

export type FormTextAreaFieldProps = TextAreaFieldProps & {
  name: string;
  registerOptions?: RegisterOptions;
};

export function FormTextAreaField({
  name,
  registerOptions = {},
  ...props
}: FormTextAreaFieldProps) {
  const { register, getFieldState, formState } = useFormContext();

  const { error } = getFieldState(name, formState);

  return (
    <TextAreaField
      {...props}
      {...register(name, registerOptions)}
      error={error?.message}
    />
  );
}
