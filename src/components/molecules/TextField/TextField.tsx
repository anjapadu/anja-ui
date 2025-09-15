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
    variant: {
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
    variant: "floating",
  },
});

const inputVariants = cva(null, {
  variants: {
    variant: {
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
      variant: "floating",
      size: "sm",
      class: `pt-3`,
    },
    {
      variant: "floating",
      size: "md",
      class: "pt-4",
    },
    {
      variant: "floating",
      size: "lg",
      class: "pt-5",
    },
  ],
  defaultVariants: {
    variant: "floating",
    size: "sm",
  },
});

const labelVariants = cva("", {
  variants: {
    variant: {
      floating:
        "left-2 \
        pointer-events-none absolute transition-all text-font-secondary \
        left-[0.55rem] top-1/2 -translate-y-1/2 \
        peer-focus:top-1 \
        peer-[&:not(:placeholder-shown)]:top-1",
      horizontal: "",
      placeholder: "",
    },
    size: { sm: null, md: null, lg: null },
  },
  compoundVariants: [
    {
      variant: "floating",
      size: "sm",
      class: `
        peer-placeholder-shown:text-sm
        peer-focus:text-[0.625rem]
        peer-[&:not(:placeholder-shown)]:text-[0.625rem]
        peer-focus:translate-y-0
        peer-[&:not(:placeholder-shown)]:translate-y-0
      `,
    },
    {
      variant: "floating",
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
      variant: "floating",
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
  variant,
  label,
  id,
  error,
  hint,
  className,
}: TextFieldProps) {
  const isFloating = (variant ?? "floating") === "floating";

  return (
    <div className={twMerge(textFieldVariants({ size, variant }), className)}>
      <Input
        id={id}
        inputSize={size}
        variant={error ? "error" : undefined}
        placeholder={isFloating ? " " : label}
        className={inputVariants({ size, variant })}
      />
      <Label
        htmlFor={id}
        className={twMerge(
          labelVariants({ size, variant }),
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
