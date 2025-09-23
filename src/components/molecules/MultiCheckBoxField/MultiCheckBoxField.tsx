import type { ReactNode } from "react";
import { Controller, type ControllerProps } from "react-hook-form";
import { Field } from "@headlessui/react";
import { cva, type VariantProps } from "class-variance-authority";
import { Typography } from "../../atoms/Typography/Typography";
import { Label } from "../../atoms/Label";
import { CheckboxField, type CheckBoxFieldProps } from "../CheckBoxField";
import type { Option } from "../ComboBoxField";

const multiWrap = cva("flex flex-col gap-2", {
  variants: {
    spacing: {
      default: "gap-3",
      compact: "gap-1",
    },
    columns: {
      1: "grid grid-cols-1",
      2: "grid grid-cols-1 sm:grid-cols-2",
      3: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      5: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
      6: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6",
      8: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8",
    },
  },
  defaultVariants: {
    spacing: "default",
    columns: 5,
  },
});

export type MultiCheckboxFieldProps = Omit<
  CheckBoxFieldProps,
  | "label"
  | "description"
  | "checked"
  | "onChange"
  | "id"
  | "error"
  | "showError"
  | "value"
> & {
  label?: string;
  description?: ReactNode;
  options: Option[];
  value: Array<Option["value"]>;
  onChange: (next: Array<Option["value"]>) => void;
  showError?: boolean;
  error?: string;
  showSelectControls?: boolean;
  idBase?: string;
  checkboxAppearance?: CheckBoxFieldProps["checkboxAppearance"];
} & VariantProps<typeof multiWrap>;

export function MultiCheckboxField({
  label,
  description,
  options,
  value,
  onChange,
  size = "sm",
  spacing,
  showError = false,
  name,
  error,
  columns,
  checkboxAppearance,
  showSelectControls = false,
  idBase,
  ...checkboxProps
}: MultiCheckboxFieldProps) {
  const selectedSet = new Set<Option["value"]>(value);

  const toggle = (optValue: Option["value"], checked: boolean) => {
    const next = new Set(selectedSet);
    if (checked) next.add(optValue);
    else next.delete(optValue);
    onChange(Array.from(next));
  };

  const allEnabledValues = options
    .filter((o) => !o.disabled)
    .map((o) => o.value);

  const selectAll = () => onChange(allEnabledValues);
  const clearAll = () => onChange([]);

  return (
    <fieldset className="space-y-2">
      <legend className="font-medium">
        <Label>{label}</Label>
      </legend>

      {description ? (
        <Typography className="text-sm text-font-secondary">
          {description}
        </Typography>
      ) : null}

      {showSelectControls ? (
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            className="underline underline-offset-2 hover:no-underline"
            onClick={selectAll}
          >
            Select all
          </button>
          <span aria-hidden>·</span>
          <button
            type="button"
            className="underline underline-offset-2 hover:no-underline"
            onClick={clearAll}
          >
            Clear
          </button>
        </div>
      ) : null}

      <Field className={multiWrap({ spacing, columns })}>
        {options.map((opt) => {
          const id =
            (idBase ??
              (label || name || "").replace(/\s+/g, "-").toLowerCase()) +
            "-" +
            String(opt.value);
          const checked = selectedSet.has(opt.value);

          const compositeLabel = (
            <span className="inline-flex items-center gap-2">
              {opt.leftItem ? <span>{opt.leftItem}</span> : null}
              {opt.image ? (
                <img
                  src={opt.image}
                  alt=""
                  className="inline-block size-5 rounded object-cover"
                />
              ) : null}
              <span>{opt.label}</span>
              {opt.rightItem ? (
                <span className="ml-auto">{opt.rightItem}</span>
              ) : null}
            </span>
          );

          return (
            <CheckboxField
              key={id}
              id={id}
              size={size}
              appearance="default"
              checkboxAppearance={checkboxAppearance}
              label={compositeLabel as unknown as string}
              description={
                opt.description ? (
                  <span className="cbft">{opt.description}</span>
                ) : undefined
              }
              checked={checked}
              disabled={opt.disabled}
              onChange={(checked) => toggle(opt.value, checked)}
              showError={false}
              {...checkboxProps}
            />
          );
        })}
      </Field>

      {showError && !!error ? (
        <Typography className="bg-danger mt-1">{error}</Typography>
      ) : null}
    </fieldset>
  );
}

export type FormMultiCheckboxFieldProps = Omit<
  MultiCheckboxFieldProps,
  "value" | "onChange"
> & {
  name: string;
  controller?: Pick<
    ControllerProps,
    "defaultValue" | "disabled" | "rules" | "shouldUnregister"
  >;
};

export function FormMultiCheckboxField({
  name,
  controller,
  showError = true,
  ...rest
}: FormMultiCheckboxFieldProps) {
  return (
    <Controller
      name={name}
      {...controller}
      render={({ field, fieldState }) => {
        const current: Array<Option["value"]> = Array.isArray(field.value)
          ? field.value
          : [];

        return (
          <MultiCheckboxField
            {...rest}
            name={name}
            value={current}
            onChange={(next) => field.onChange(next)}
            showError={showError}
            error={fieldState.error?.message}
          />
        );
      }}
    />
  );
}
