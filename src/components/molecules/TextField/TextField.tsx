import { cva, type VariantProps } from "class-variance-authority";
import { Input } from "../../atoms/Input/Input";
import { Label } from "../../atoms/Label/Label";
import { twMerge } from "tailwind-merge";
import Typography from "../../atoms/Typography/Typography";

type TextFieldProps = {
  label?: string;
  id: string;
  error?: string;
  hint?: string;
  className?: string;
} & VariantProps<typeof textFieldVariants>;

const textFieldVariants = cva("", {
  variants: {
    labelBehavior: {
      floating: "relative",
      placeholder: "",
    },
    size: {
      sm: null,
      md: null,
      lg: null,
    },
  },
  defaultVariants: {
    size: "sm",
    labelBehavior: "floating",
  },
});

const inputVariants = cva(null, {
  variants: {
    labelBehavior: {
      floating: "peer",
      placeholder: "",
    },
    size: {
      sm: null,
      md: null,
      lg: null,
    },
  },
  compoundVariants: [
    {
      labelBehavior: "floating",
      size: "sm",
      class: `pt-3`,
    },
    {
      labelBehavior: "floating",
      size: "md",
      class: "pt-4",
    },
    {
      labelBehavior: "floating",
      size: "lg",
      class: "pt-5",
    },
  ],
  defaultVariants: {
    labelBehavior: "floating",
    size: "sm",
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
    size: { sm: null, md: null, lg: null },
  },
  compoundVariants: [
    {
      labelBehavior: "floating",
      size: "sm",
      class: `
        peer-placeholder-shown:text-sm
        peer-focus:text-[0.625rem]
        peer-[&:not(:placeholder-shown)]:text-[0.625rem]
        peer-focus:translate-y-0.5
        peer-[&:not(:placeholder-shown)]:translate-y-0
      `,
    },
    {
      labelBehavior: "floating",
      size: "md",
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
      size: "lg",
      class: `
        peer-placeholder-shown:text-lg
        peer-focus:text-sm
        peer-[&:not(:placeholder-shown)]:text-sm
        peer-focus:translate-y-1
        peer-[&:not(:placeholder-shown)]:translate-y-1
      `,
    },
  ],
  defaultVariants: { size: "sm" },
});
export function TextField({
  size,
  labelBehavior,
  label,
  id,
  error,
  hint,
  className,
}: TextFieldProps) {
  const isFloating = (labelBehavior ?? "floating") === "floating";

  return (
    <div className={twMerge(textFieldVariants({ size, labelBehavior }), className)}>
      <Input
        id={id}
        inputSize={size}
        appearance={error ? "error" : undefined}
        placeholder={isFloating ? " " : label}
        className={inputVariants({ size, labelBehavior })}
      />
      <Label
        htmlFor={id}
        className={twMerge(
          labelVariants({ size, labelBehavior }),
          !isFloating && "hidden"
        )}
      >
        {label}
      </Label>
      {hint && (
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
