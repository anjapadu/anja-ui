import { z } from "zod";
import {
  FormProvider,
  useForm,
  type FieldValues,
  type SubmitHandler,
  type DefaultValues,
  type Resolver,
  type UseFormReturn,
  useFormContext,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Typography } from "../../atoms/Typography/Typography";
import {
  createDefaultRenderers,
  type FieldRef,
  type Renderers,
} from "./renderers";
import type { PathOf } from "./paths";
import { Fragment, memo, useEffect, useState } from "react";

type Section<T extends FieldValues> = {
  title?: string;
  type: "section";
  description?: string;
  blocks: Block<T>[];
};

export type Block<T extends FieldValues> =
  | FieldRef<T>
  | Block<T>[]
  | Section<T>
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
function renderArrayBlocks<T extends FieldValues>({
  blk,
  key,
  ctx,
}: {
  blk: Block<T>[];
  ctx: RenderCtx<T>;
  key: React.Key;
}) {
  const cols = blk.length || 1;
  return (
    <Row key={key} columns={cols}>
      {blk.map((col, i) => {
        const span = (col as FieldRef<T>)?.colSpan ?? 1;
        const k = `${key}-c${i}`;
        return (
          <Cell span={span} key={k}>
            {renderBlock(col, ctx, `${k}`)}
          </Cell>
        );
      })}
    </Row>
  );
}
function Description({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="w-1/3 pr-12">
      {!!title && (
        <Typography variant="body" className="font-semibold">
          {title}
        </Typography>
      )}
      {!!description && (
        <Typography variant="body" className="leading-none text-xs">
          {description}
        </Typography>
      )}
    </div>
  );
}

const MemoizedDescription = memo(Description);

function renderBlock<T extends FieldValues>(
  blk: Block<T>,
  ctx: RenderCtx<T>,
  key: React.Key
): React.ReactNode {
  const { methods, renderers } = ctx;

  if (Array.isArray(blk)) {
    return renderArrayBlocks({ blk, ctx, key });
  }

  if ("type" in blk && blk.type === "section") {
    return (
      <div className="flex flex-row flex-1" key={key}>
        <MemoizedDescription title={blk.title} description={blk.description} />
        <div className="flex flex-col gap-y-6 shadow pb-10 px-8 pt-10 bg-white rounded-xs w-7/12">
          {blk.blocks.map((b, j) => (
            <Fragment key={`${key}-s${j}`}>
              {renderBlock(b, ctx, `${key}-s${j}`)}
            </Fragment>
          ))}
        </div>
      </div>
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

  switch (field.component) {
    case "multicheckbox": {
      const r = renderers.multicheckbox;
      if (!r)
        return (
          <div key={key} className="text-red-600 text-sm">
            No renderer for "multicheckbox"
          </div>
        );
      return <div key={key}>{r({ field, methods, path })}</div>;
    }
    case "checkbox": {
      const r = renderers.checkbox;
      if (!r)
        return (
          <div key={key} className="text-red-600 text-sm">
            No renderer for "checkbox"
          </div>
        );
      return <div key={key}>{r({ field, methods, path })}</div>;
    }
    case "input": {
      const r = renderers.input;
      if (!r)
        return (
          <div key={key} className="text-red-600 text-sm">
            No renderer for "input"
          </div>
        );
      return <div key={key}>{r({ field, methods, path })}</div>;
    }
    case "combobox": {
      const r = renderers.combobox;
      if (!r)
        return (
          <div key={key} className="text-red-600 text-sm">
            No renderer for "combobox"
          </div>
        );
      return <div key={key}>{r({ field, methods, path })}</div>;
    }
  }
}

function keyForBlock<T extends FieldValues>(blk: Block<T>, i: number): string {
  if (Array.isArray(blk)) return `row-${i}`;
  if ("type" in blk && blk.type === "section")
    return `section-${blk.title ?? i}`;
  if ("title" in blk) return `title-${blk.title}-${i}`;
  const f = blk as FieldRef<T>;
  return `field-${f.name}-${i}`;
}

export function RenderLayout<T extends FieldValues>(props: RenderCtx<T>) {
  const { layout } = props;
  return (
    <div className="gap-y-6 flex flex-col">
      {layout.map((blk, i) => (
        <Fragment key={keyForBlock(blk, i)}>
          {renderBlock(blk, props, keyForBlock(blk, i))}
        </Fragment>
      ))}
    </div>
  );
}

function FormValue() {
  const { watch, getValues } = useFormContext();
  const [state, setState] = useState<unknown>();

  useEffect(() => {
    const { unsubscribe } = watch(() => {
      setState(getValues());
    });
    return () => unsubscribe();
  }, [getValues, watch]);

  return (
    <pre>
      <code>{JSON.stringify(state, null, 2)}</code>
    </pre>
  );
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
    (renderers as Renderers<TValues>) ?? createDefaultRenderers<TValues>({});
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit((vals) => onSubmit?.(vals))}>
        <RenderLayout
          layout={layout}
          methods={methods}
          renderers={effectiveRenderers}
        />
      </form>
      <FormValue />
    </FormProvider>
  );
}
