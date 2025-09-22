import type { ReactNode } from "react";
import { CheckBox, type CheckBoxProps } from "../../atoms/CheckBox";
import { Label } from "../../atoms/Label";
import { Typography } from "../../atoms/Typography/Typography";
import { cva, type VariantProps } from "class-variance-authority";
import { Field, Label as HLabel } from "@headlessui/react";

// cbfl=> check-box-field-label
// cbft=> check-box-field-typography

const checkboxFieldVariants = cva(null, {
  variants: {
    appearance: {
      default:
        "flex flex-col [&>div]:flex [&>div]:flex-row [&_label]:ml-2 font-medium",
      inline: "",
      reversed: "",
    },
    size: {
      sm: "[&_.cbfl]:text-sm [&_.cbfl]:font-medium [&_.cbft]:text-sm [&>div:last-of-type]:pl-[calc(var(--chekbox-sm)+--spacing(2))] [&_p:last-of-type]:text-sm",
      md: "[&_.cbfl]:text-md [&_.cbfl]:font-medium [&_.cbft]:text-sm [&>div:last-of-type]:pl-[calc(var(--chekbox-md)+--spacing(2))] [&_p:last-of-type]:text-md",
      lg: "[&_.cbfl]:text-lg [&_.cbfl]:font-medium [&_.cbft]:text-sm [&>div:last-of-type]:pl-[calc(var(--chekbox-lg)+--spacing(2))] [&_p:last-of-type]:text-lg",
    },
  },
  defaultVariants: {
    appearance: "default",
    size: "sm",
  },
});

export type CheckBoxFieldProps = CheckBoxProps & {
  label: string;
  description?: string | ReactNode;
} & VariantProps<typeof checkboxFieldVariants>;

export function CheckboxField({
  id,
  label,
  size,
  description,
  appearance,
  ...props
}: CheckBoxFieldProps) {
  return (
    <Field className={checkboxFieldVariants({ size, appearance })}>
      <div>
        <CheckBox name={id} id={id} size={size} {...props} />
        <HLabel as={Label} className="cbfl" htmlFor={id}>
          {label}
        </HLabel>
      </div>
      <div>
        <Typography className="leading-none">{description}</Typography>
      </div>
    </Field>
  );
}
