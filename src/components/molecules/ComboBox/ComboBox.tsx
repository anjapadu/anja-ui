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
  type Key,
} from "react";
import Typography from "../../atoms/Typography/Typography";
import { Label } from "../../atoms/Label/Label";

const fieldWrapperVariants = cva("", {
  variants: {
    variant: { floating: "relative", placeholder: "" },
    size: { sm: "", md: "", lg: "" },
  },
  defaultVariants: { variant: "floating", size: "sm" },
});

const labelVariants = cva("", {
  variants: {
    variant: {
      floating:
        "pointer-events-none absolute transition-all text-font-secondary \
        left-[0.55rem] top-1/2 -translate-y-1/2 \
        peer-focus:top-1 peer-[&:not(:placeholder-shown)]:top-1",
      placeholder: "",
    },
    size: { sm: "", md: "", lg: "" },
  },
  compoundVariants: [
    {
      variant: "floating",
      size: "sm",
      class: `
        left-2
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
        left-2
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
        left-2
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
        placeholder: "",
      },
      size: {
        sm: "h-10 text-sm rounded-sm",
        md: "h-12 text-md rounded-md",
        lg: "h-14 text-lg rounded-lg",
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

export type ComboboxFieldProps<T> = {
  id: string;
  label?: string;

  items: T[];
  value?: T;
  onChange: (value: NoInfer<T> | null) => void;
  getLabel: (item: T) => string;
  getKey?: (item: T, index: number) => Key;
  filter?: (items: T[], query: string) => T[];

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

export function ComboboxField<T>({
  id,
  label,
  variant = "floating",
  size = "sm",
  items,
  value,
  onChange,
  getLabel,
  getKey,
  filter,
  placeholder = "Search or select…",
  error,
  hint,
  openOnFocus = true,
  className,
  inputProps,
  virtualized = false,
  virtualThreshold,
}: ComboboxFieldProps<T>) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return items;
    if (filter) return filter(items, query);
    const q = query.toLowerCase();
    return items.filter((it) => getLabel(it).toLowerCase().includes(q));
  }, [items, query, filter, getLabel]);

  const isFloating = variant === "floating";

  const displayValue = ((item: T | undefined) =>
    item ? getLabel(item) : "") as unknown as (item: T) => string;

  const useVirtual =
    virtualized && (virtualThreshold ? items.length > virtualThreshold : true);
  const virtualProp = useVirtual ? { options: filtered } : undefined;

  return (
    <div
      className={twMerge(fieldWrapperVariants({ variant, size }), className)}
    >
      <Combobox<T>
        value={value}
        onChange={onChange}
        immediate={openOnFocus}
        onClose={() => setQuery("")}
        by={(a, b) => a === b}
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
            ({ option }) => (
              <ComboboxOption
                key={
                  getKey
                    ? getKey(option, -1)
                    : (getLabel(option) as unknown as Key)
                }
                value={option}
                className={optionItemVariants({ size })}
              >
                {getLabel(option)}
              </ComboboxOption>
            )
          ) : filtered.length === 0 ? (
            <div className="px-2 py-2 text-font-secondary">No matches</div>
          ) : (
            filtered.map((option, idx) => (
              <ComboboxOption
                key={
                  getKey
                    ? getKey(option, idx)
                    : (getLabel(option) as unknown as Key)
                }
                value={option}
                className={optionItemVariants({ size })}
              >
                {getLabel(option)}
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
