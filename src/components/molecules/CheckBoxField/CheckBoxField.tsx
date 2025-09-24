import type { ReactNode } from "react";
import { CheckBox, type CheckBoxProps } from "../../atoms/CheckBox";
import { Label } from "../../atoms/Label";
import { Typography } from "../../atoms/Typography/Typography";
import { cva, type VariantProps } from "class-variance-authority";
import { Field, Label as HLabel } from "@headlessui/react";
import { Controller, type ControllerProps } from "react-hook-form";
import { twMerge } from "tailwind-merge";

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

export type CheckBoxFieldProps = Omit<CheckBoxProps, "appearance"> & {
  label: string;
  description?: string | ReactNode;
  containerClassName?: string;
  error?: string;
  showError?: boolean;
} & VariantProps<typeof checkboxFieldVariants> & {
    checkboxAppearance?: CheckBoxProps["appearance"];
  };

export function CheckboxField({
  id,
  label,
  size,
  description,
  appearance,
  containerClassName,
  checkboxAppearance,
  showError = false,
  error,
  ...props
}: CheckBoxFieldProps) {
  if (checkboxAppearance === "box") {
    return (
      <CheckBox
        name={id}
        id={id}
        size={size}
        appearance={checkboxAppearance}
        {...props}
      >
        {label}
      </CheckBox>
    );
  }
  return (
    <Field
      className={twMerge(
        checkboxFieldVariants({ size, appearance }),
        containerClassName
      )}
    >
      <div>
        <CheckBox
          name={id}
          id={id}
          size={size}
          appearance={checkboxAppearance}
          {...props}
        />
        <HLabel as={Label} className="cbfl" htmlFor={id}>
          {label}
        </HLabel>
      </div>
      <div>
        {showError && !!error ? (
          <Typography className="bg-danger">{error}</Typography>
        ) : (
          <Typography className="leading-none">{description}</Typography>
        )}
      </div>
    </Field>
  );
}

export type FormCheckBoxFieldProps = CheckBoxFieldProps & {
  name: string;
  controller?: Pick<
    ControllerProps,
    "defaultValue" | "disabled" | "rules" | "shouldUnregister"
  >;
};

export function FormCheckBoxField({
  name,
  controller,
  ...props
}: FormCheckBoxFieldProps) {
  return (
    <Controller
      name={name}
      {...controller}
      render={({ field, fieldState }) => {
        return (
          <CheckboxField
            {...props}
            {...field}
            checked={field.value}
            error={fieldState.error?.message}
          />
        );
      }}
    />
  );
}
