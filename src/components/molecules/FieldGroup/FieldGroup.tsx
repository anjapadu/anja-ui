import { cva, type VariantProps } from "class-variance-authority";
import { Label } from "../../atoms/Label";

const fieldGroupVariants = cva("flex flex-1", {
  variants: {
    direction: {
      row: "flex-row items-end gap-x-2",
      col: "flex-col",
      floating: null,
    },
  },
  defaultVariants: { direction: "col" },
});

export type FieldGroupProps = VariantProps<typeof fieldGroupVariants> & {
  name?: string;
  label: string;
  children?: React.ReactNode;
};

export function FieldGroup({
  direction,
  label,
  children,
  name,
}: FieldGroupProps) {
  const isFloating = direction === "floating";
  return (
    <div className={fieldGroupVariants({ direction })}>
      {!isFloating && (
        <div className="flex-1">
          <Label className="text-xs font-medium" htmlFor={name}>
            {label}
          </Label>
        </div>
      )}
      <div className="flex-1">{children}</div>
    </div>
  );
}
