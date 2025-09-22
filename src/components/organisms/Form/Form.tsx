import { z } from "zod";
import {
  FormProvider,
  useForm,
  type FieldValues,
  type SubmitHandler,
  type DefaultValues,
  type Resolver,
  type UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Typography } from "../../atoms/Typography/Typography";
import {
  createDefaultRenderers,
  type FieldRef,
  type Renderers,
} from "./renderers";
import type { PathOf } from "./paths";

export type Block<T extends FieldValues> =
  | FieldRef<T>
  | Block<T>[]
  | { title: string }
  | { type: "step"; title: string; content: Block<T>[] }
  | { type: "repeater"; name: PathOf<T>; template: Block<T>[] };

export type Layout<T extends FieldValues> = Block<T>[];
type SchemaEq<T extends FieldValues> = z.ZodType<T>;

export type FormProps<TValues extends FieldValues> = {
  schema: SchemaEq<TValues>;
  layout: Layout<TValues>;
  defaultValues?: DefaultValues<TValues>;
  onSubmit?: SubmitHandler<TValues>;
  mode?: "onSubmit" | "onBlur" | "onChange" | "all";
  renderers?: Renderers<TValues>;
};

function resolverFor<TValues extends FieldValues>(
  schema: SchemaEq<TValues>
): Resolver<TValues, unknown, TValues> {
  return zodResolver(schema as z.ZodAny) as unknown as Resolver<
    TValues,
    unknown,
    TValues
  >;
}

type RenderCtx<T extends FieldValues> = {
  layout: Layout<T>;
  methods: UseFormReturn<T>;
  renderers: Renderers<T>;
};

function Row({
  columns,
  children,
}: {
  columns: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {children}
    </div>
  );
}

function Cell({
  span = 1,
  children,
}: {
  span?: number;
  children: React.ReactNode;
}) {
  return (
    <div style={{ gridColumn: `span ${span} / span ${span}` }}>{children}</div>
  );
}

function renderBlock<T extends FieldValues>(
  blk: Block<T>,
  ctx: RenderCtx<T>,
  key: React.Key
): React.ReactNode {
  const { methods, renderers } = ctx;

  if (Array.isArray(blk)) {
    const cols = blk.length || 1;
    return (
      <Row key={key} columns={cols}>
        {blk.map((col, i) => {
          const span = (col as FieldRef<T>)?.colSpan ?? 1;
          return (
            <Cell span={span} key={`${key}-${i}`}>
              {renderBlock(col, ctx, `${key}-${i}`)}
            </Cell>
          );
        })}
      </Row>
    );
  }

  if ("title" in blk) {
    return (
      <Typography variant="h2" key={key}>
        {blk.title}
      </Typography>
    );
  }

  const field = blk as FieldRef<T>;
  const path = field.name as string;
  let renderer;
  switch (field.component) {
    case "input":
      renderer = renderers.input;
      if (!renderer) {
        return (
          <div key={key} className="text-red-600 text-sm">
            No renderer for "input"
          </div>
        );
      }
      return renderer({ field, methods, path });

    case "combobox":
      renderer = renderers.combobox;
      if (!renderer) {
        return (
          <div key={key} className="text-red-600 text-sm">
            No renderer for "combobox"
          </div>
        );
      }
      return renderer({ field, methods, path });
  }
}

export function RenderLayout<T extends FieldValues>(props: RenderCtx<T>) {
  const { layout } = props;
  return <>{layout.map((blk, i) => renderBlock(blk, props, i))}</>;
}

export function Form<TValues extends FieldValues>({
  schema,
  layout,
  defaultValues,
  onSubmit,
  mode = "onBlur",
  renderers,
}: FormProps<TValues>) {
  const methods = useForm<TValues, unknown, TValues>({
    resolver: resolverFor(schema),
    defaultValues,
    mode,
  });
  const effectiveRenderers =
    (renderers as Renderers<TValues>) ?? createDefaultRenderers<TValues>();
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((vals) => onSubmit?.(vals))}>
        <RenderLayout
          layout={layout}
          methods={methods}
          renderers={effectiveRenderers}
        />
      </form>
    </FormProvider>
  );
}
