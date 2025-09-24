import type { FieldValues, UseFormReturn } from "react-hook-form";
import {
  FormTextField,
  type FormTextFieldProps,
} from "../../molecules/TextField";
import {
  FormComboboxField,
  type FormComboBoxFieldProps,
  type Option,
} from "../../molecules/ComboBoxField";
import type { PathOf } from "./paths";
import {
  FormCheckBoxField,
  type FormCheckBoxFieldProps,
} from "../../molecules/CheckBoxField";
import {
  FormMultiCheckboxField,
  type FormMultiCheckboxFieldProps,
} from "../../molecules/MultiCheckBoxField";
import { FieldGroup } from "../../molecules/FieldGroup";

export type ComponentKind = "input" | "combobox" | "checkbox" | "multicheckbox";

type BaseFieldRef<T extends FieldValues> = {
  name: PathOf<T>;
  label?: string;
  colSpan?: number;
  containerClassName?: string;
};

export type Direction = "col" | "floating" | "row" | null | undefined;

export type InputFieldRef<T extends FieldValues> = BaseFieldRef<T> & {
  component: "input";
  inputProps?: Omit<FormTextFieldProps, "name">;
};

export type ComboboxOption = { label: string; value: string };
export type ComboboxFieldRef<T extends FieldValues> = BaseFieldRef<T> & {
  component: "combobox";
  options: ComboboxOption[];
  comboProps?: Omit<FormComboBoxFieldProps, "name" | "options">;
};

export type CheckBoxFieldRef<T extends FieldValues> = BaseFieldRef<T> & {
  component: "checkbox";
  checkboxProps?: Omit<FormCheckBoxFieldProps, "name">;
};

export type MultiCheckboxFieldRef<T extends FieldValues> = BaseFieldRef<T> & {
  component: "multicheckbox";
  options: Option[]; // same Option used by your ComboBoxField
  multiCheckboxProps?: Omit<FormMultiCheckboxFieldProps, "name" | "options">;
};

export type FieldRef<T extends FieldValues> =
  | InputFieldRef<T>
  | ComboboxFieldRef<T>
  | CheckBoxFieldRef<T>
  | MultiCheckboxFieldRef<T>;

export type FieldPropsBase<T extends FieldValues, F extends FieldRef<T>> = {
  field: F;
  methods: UseFormReturn<T>;
  path: string;
  direction?: Direction;
};

export type FieldPropsFor<
  K extends ComponentKind,
  T extends FieldValues
> = K extends "input"
  ? FieldPropsBase<T, InputFieldRef<T>>
  : K extends "combobox"
  ? FieldPropsBase<T, ComboboxFieldRef<T>>
  : K extends "checkbox"
  ? FieldPropsBase<T, CheckBoxFieldRef<T>>
  : K extends "multicheckbox"
  ? FieldPropsBase<T, MultiCheckboxFieldRef<T>>
  : never;

export type Renderers<T extends FieldValues> = {
  input?: (p: FieldPropsFor<"input", T>) => React.ReactNode;
  combobox?: (p: FieldPropsFor<"combobox", T>) => React.ReactNode;
  checkbox?: (p: FieldPropsFor<"checkbox", T>) => React.ReactNode;
  multicheckbox?: (p: FieldPropsFor<"multicheckbox", T>) => React.ReactNode;
};

function getError<T extends FieldValues>(
  methods: UseFormReturn<T>,
  path: string
) {
  const tokens = path.match(/[^.[\]]+/g) ?? [];
  let cur: unknown = methods.formState.errors as unknown;
  for (const tk of tokens) {
    cur =
      cur && typeof cur === "object"
        ? (cur as Record<string, unknown>)[tk]
        : undefined;
    if (!cur) break;
  }
  const msg = (cur as { message?: unknown } | undefined)?.message;
  return typeof msg === "string" ? msg : undefined;
}

type RendererDefaults = {
  input?: Omit<FormTextFieldProps, "name">;
  combobox?: Omit<FormComboBoxFieldProps, "name" | "options">;
  checkbox?: Omit<FormCheckBoxFieldProps, "name">;
  multicheckbox?: Omit<FormMultiCheckboxFieldProps, "name" | "options">;
};

export function createDefaultRenderers<T extends FieldValues>({
  defaultDirection,
  defaults,
}: {
  defaults?: RendererDefaults;
  defaultDirection?: Direction;
}): Renderers<T> {
  return {
    input: ({ field, methods, path, direction }) => {
      const labelBehaviour =
        direction || defaultDirection === "floating"
          ? "floating"
          : "placeholder";
      return (
        <FieldGroup
          name={path}
          label={field.label ?? ""}
          direction={direction || defaultDirection}
        >
          <FormTextField
            name={path}
            id={path}
            label={field.label}
            error={getError(methods, path)}
            {...field.inputProps}
            {...defaults?.input}
            labelBehavior={
              labelBehaviour ||
              defaults?.input?.labelBehavior ||
              field.inputProps?.labelBehavior
            }
          />
        </FieldGroup>
      );
    },
    checkbox: ({ field, methods, path }) => (
      <FormCheckBoxField
        containerClassName={field.containerClassName}
        name={path}
        label={field.label ?? ""}
        error={getError(methods, path)}
        {...defaults?.checkbox}
        {...field.checkboxProps}
      />
    ),
    combobox: ({ field, methods, path, direction }) => (
      <FieldGroup
        name={path}
        label={field.label ?? ""}
        direction={direction || defaultDirection}
      >
        <FormComboboxField
          name={path}
          id={path}
          label={field.label}
          items={field.options || []}
          error={getError(methods, path)}
          labelBehaviour={direction === "floating" ? "floating" : "placeholder"}
          {...defaults?.combobox}
          {...field.comboProps}
        />
      </FieldGroup>
    ),
    multicheckbox: ({ field, methods, path }) => {
      const f = field as MultiCheckboxFieldRef<T>;
      return (
        <FieldGroup name="path" label={f.label ?? ""}>
          <FormMultiCheckboxField
            name={path}
            label={f.label ?? ""}
            options={f.options}
            error={getError(methods, path)}
            {...defaults?.multicheckbox}
            {...f.multiCheckboxProps}
          />
        </FieldGroup>
      );
    },
  };
}
