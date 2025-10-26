import { cva, type VariantProps } from "class-variance-authority";
import { Input, type InputProps } from "../../atoms/Input/Input";
import { Label } from "../../atoms/Label/Label";
import { twMerge } from "tailwind-merge";
import { Typography } from "../../atoms/Typography/Typography";
import { useFormContext, type RegisterOptions } from "react-hook-form";
import { forwardRef } from "react";

type TextFieldProps = Omit<InputProps, "className"> & {
  label?: string;
  id?: string;
  error?: string;
  hint?: string;
  className?: string;
} & VariantProps<typeof textFieldVariants>;

const textFieldVariants = cva("relative", {
  variants: {
    labelBehavior: {
      floating: "",
      placeholder: "",
    },
    inputSize: {
      sm: null,
      md: null,
      lg: null,
    },
  },
  defaultVariants: {
    inputSize: "sm",
    labelBehavior: "floating",
  },
});

const inputVariants = cva(null, {
  variants: {
    labelBehavior: {
      floating: "peer",
      placeholder: "",
    },
    inputSize: {
      sm: null,
      md: null,
      lg: null,
    },
  },
  compoundVariants: [
    {
      labelBehavior: "floating",
      inputSize: "sm",
      class: `pt-3`,
    },
    {
      labelBehavior: "floating",
      inputSize: "md",
      class: "pt-4",
    },
    {
      labelBehavior: "floating",
      inputSize: "lg",
      class: "pt-5",
    },
  ],
  defaultVariants: {
    labelBehavior: "floating",
    inputSize: "sm",
  },
});

const labelVariants = cva("", {
  variants: {
    labelBehavior: {
      floating:
        "pointer-events-none absolute transition-all text-font-secondary \
        left-[0.55rem] top-1/2 -translate-y-1/2 \
        peer-focus:top-1 peer-[&:not(:placeholder-shown)]:top-1 leading-none",
      horizontal: "",
      placeholder: "",
    },
    inputSize: { sm: null, md: null, lg: null },
  },
  compoundVariants: [
    {
      labelBehavior: "floating",
      inputSize: "sm",
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
      inputSize: "md",
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
      inputSize: "lg",
      class: `
        peer-placeholder-shown:text-lg
        peer-focus:text-sm
        peer-[&:not(:placeholder-shown)]:text-sm
        peer-focus:translate-y-1
        peer-[&:not(:placeholder-shown)]:translate-y-1
      `,
    },
  ],
  defaultVariants: { inputSize: "sm" },
});

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    { inputSize, labelBehavior, label, id, error, hint, className, ...props },
    ref
  ) => {
    const isFloating = (labelBehavior ?? "floating") === "floating";
    return (
      <div
        className={twMerge(
          textFieldVariants({ inputSize, labelBehavior }),
          className
        )}
      >
        <Input
          id={id}
          ref={ref}
          inputSize={inputSize}
          appearance={error ? "error" : undefined}
          placeholder={isFloating ? " " : label}
          className={inputVariants({ inputSize, labelBehavior })}
          {...props}
        />
        <Label
          htmlFor={id}
          className={twMerge(
            labelVariants({ inputSize, labelBehavior }),
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

TextField.displayName = "TextField";

export type FormTextFieldProps = TextFieldProps & {
  name: string;
  registerOptions?: RegisterOptions;
};

export function FormTextField({
  name,
  registerOptions = {},
  ...props
}: FormTextFieldProps) {
  const { register, getFieldState, formState } = useFormContext();

  const { error } = getFieldState(name, formState);

  return (
    <TextField
      {...props}
      {...register(name, registerOptions)}
      error={error?.message}
    />
  );
}
