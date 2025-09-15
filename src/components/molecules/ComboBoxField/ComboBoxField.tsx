import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import {
  useMemo,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import Typography from "../../atoms/Typography/Typography";
import { Label } from "../../atoms/Label/Label";
import { escapeRegExp } from "../../../utils/escapeRegex";

const fieldWrapperVariants = cva(null, {
  variants: {
    variant: { floating: "relative", placeholder: "" },
    size: { sm: null, md: null, lg: null },
  },
  defaultVariants: { variant: "floating", size: "sm" },
});

const labelVariants = cva(null, {
  variants: {
    variant: {
      floating:
        "left-2 \
        pointer-events-none absolute transition-all text-font-secondary \
        left-[0.55rem] top-1/2 -translate-y-1/2 \
        peer-focus:top-1 peer-[&:not(:placeholder-shown)]:top-1 leading-none",
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
        peer-focus:translate-y-0.5
        peer-[&:not(:placeholder-shown)]:translate-y-0.5
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
  defaultVariants: { size: "sm", variant: "floating" },
});

const comboboxInputVariants = cva(
  "peer w-full px-2 border border-border box-border \
  text-font-primary placeholder-font-secondary \
  focus:outline-none focus-visible:outline-none",
  {
    variants: {
      variant: {
        floating: "peer",
        placeholder: null,
      },
      size: {
        sm: "h-field-sm text-sm field-radius",
        md: "h-field-md text-md field-radius",
        lg: "h-field-lg text-xl field-radius",
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
  }
);

const optionsPanelVariants = cva(
  "w-(--input-width) mt-1 max-h-64 overflow-auto z-50 \
  border border-border rounded-md bg-white shadow-lg \
  empty:invisible",
  {
    variants: { size: { sm: "text-sm", md: "text-base", lg: "text-lg" } },
    defaultVariants: { size: "sm" },
  }
);

const optionItemVariants = cva(
  "cursor-pointer px-2 py-2 w-full \
  data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed \
  data-[focus]:bg-neutral-100 data-[selected]:font-medium",
  {
    variants: { size: { sm: "text-sm", md: "text-base", lg: "text-lg" } },
    defaultVariants: { size: "sm" },
  }
);

type FieldCva = VariantProps<typeof fieldWrapperVariants>;

export type Option = {
  label: string;
  value: string | number;
  image?: string;
  leftItem?: ReactNode;
  rightItem?: ReactNode;
  [k: string]: string | undefined | ReactNode;
};

export type SingleProps = {
  multiple?: false;
  value: Option | null;
  onChange: (v: Option | null) => void;
};

export type MultiProps = {
  multiple: true;
  value: Option[];
  onChange: (v: Option[]) => void;
};

export type ComboboxFieldProps = SingleProps & {
  id: string;
  label?: string;
  items: Option[];
  value: Option | null;
  renderOption?: (
    option: Option,
    state: { focus: boolean; selected: boolean; disabled: boolean }
  ) => React.ReactNode;
  onChange: (value: Option | null) => void;
  customFilter?: (items: Option[], query: string) => Option[];
  getLabel?: (option: Option) => string | React.ReactElement;
  placeholder?: string;
  error?: string;
  hint?: string;
  className?: string;
  openOnFocus?: boolean;
  inputProps?: Omit<
    ComponentPropsWithoutRef<"input">,
    "id" | "value" | "onChange" | "placeholder" | "className" | "defaultValue"
  >;

  virtualized?: boolean;
  virtualThreshold?: number;
} & Pick<FieldCva, "variant" | "size">;

export function ComboboxField({
  id,
  label,
  variant = "floating",
  size = "sm",
  items,
  value,
  onChange,
  customFilter,
  placeholder = "Search or select…",
  error,
  hint,
  renderOption,
  getLabel = (option: Option) => option.label,
  openOnFocus = true,
  className,
  inputProps,
  virtualized = false,
  virtualThreshold,
}: ComboboxFieldProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return items;
    if (customFilter) return customFilter(items, query);
    const re = new RegExp(escapeRegExp(query), "i");
    return items.filter((item) => re.test(item.label));
  }, [items, query, customFilter]);

  const isFloating = variant === "floating";

  const displayValue = (val: Option | Option[] | null) =>
    Array.isArray(val) ? val.map((v) => v.label).join(", ") : val?.label ?? "";

  const useVirtual =
    virtualized && (virtualThreshold ? items.length > virtualThreshold : true);
  const virtualProp = useVirtual ? { options: filtered } : undefined;
  return (
    <div
      className={twMerge(fieldWrapperVariants({ variant, size }), className)}
    >
      <Combobox<Option | null>
        value={value ?? null}
        onChange={onChange}
        immediate={openOnFocus}
        onClose={() => setQuery("")}
        by={(a, b) => a?.value === b?.value}
        virtual={virtualProp}
      >
        <ComboboxInput
          id={id}
          aria-invalid={!!error}
          placeholder={isFloating ? " " : placeholder}
          displayValue={displayValue}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          className={twMerge(
            comboboxInputVariants({
              size,
              variant,
            })
          )}
          {...inputProps}
        />

        {label && (
          <Label
            htmlFor={id}
            className={twMerge(
              labelVariants({ size, variant }),
              !isFloating && "hidden"
            )}
          >
            {label}
          </Label>
        )}

        <ComboboxOptions
          anchor="bottom"
          className={optionsPanelVariants({ size })}
        >
          {useVirtual ? (
            ({ option }) => {
              return (
                <ComboboxOption
                  key={option.value}
                  value={option}
                  className={optionItemVariants({ size })}
                >
                  {({ focus, selected, disabled }) => (
                    <>
                      {renderOption
                        ? renderOption(option, { focus, selected, disabled })
                        : getLabel(option)}
                    </>
                  )}
                </ComboboxOption>
              );
            }
          ) : filtered.length === 0 ? (
            <div className="px-2 py-2 text-font-secondary">No matches</div>
          ) : (
            filtered.map((option) => (
              <ComboboxOption
                key={option.value}
                value={option}
                className={optionItemVariants({ size })}
              >
                {({ focus, selected, disabled }) => (
                  <>
                    {renderOption
                      ? renderOption(option, { focus, selected, disabled })
                      : getLabel(option)}
                  </>
                )}
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>
      </Combobox>

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
