import type { FieldValues, UseFormReturn } from "react-hook-form";
import {
  FormTextField,
  type FormTextFieldProps,
} from "../../molecules/TextField";
import type { PathOf } from "./paths";

export type ComponentKind = "input";

export type FieldRef<T extends FieldValues> = {
  name: PathOf<T>;
  component: "input";
  label?: string;
  colSpan?: number;
  inputProps?: Omit<FormTextFieldProps, "name">;
};

export type FieldProps<T extends FieldValues> = {
  field: FieldRef<T>;
  methods: UseFormReturn<T>;
  path: string;
};

export type Renderers<T extends FieldValues> = Partial<
  Record<ComponentKind, (p: FieldProps<T>) => React.ReactNode>
>;

function getError<T extends FieldValues>(
  methods: UseFormReturn<T>,
  path: string
): string | undefined {
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
};

export function createDefaultRenderers<T extends FieldValues>(
  defaults?: RendererDefaults
): Renderers<T> {
  return {
    input: ({ field, methods, path }) => (
      <FormTextField
        name={path}
        label={field.label}
        error={getError(methods, path)}
        {...defaults?.input}
        {...field.inputProps}
      />
    ),
  };
}
