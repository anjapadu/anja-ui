import React, {
  forwardRef,
  type ElementType,
  type ComponentPropsWithoutRef,
  type ComponentPropsWithRef,
  type JSX,
  type ReactElement,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const typographyVariants = cva("font-sans", {
  variants: {
    variant: {
      h1: "text-4xl font-bold tracking-tight",
      h2: "text-3xl font-semibold",
      h3: "text-2xl font-semibold",
      body: "text-base font-normal",
      caption: "text-xs font-medium uppercase tracking-wide",
    },
    color: {
      primary: "text-font-primary",
      secondary: "text-font-secondary",
      danger: "text-danger",
      success: "text-success",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
  },
  defaultVariants: { variant: "body", color: "primary", align: "left" },
});

type VariantType = NonNullable<
  VariantProps<typeof typographyVariants>["variant"]
>;

const defaultElement: Record<VariantType, keyof JSX.IntrinsicElements> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  body: "p",
  caption: "span",
};

type TypographyProps = VariantProps<typeof typographyVariants> & {
  text?: string;
  className?: string;
  children?: React.ReactNode;
};

type PolymorphicProps<C extends ElementType> = {
  as?: C;
} & TypographyProps &
  Omit<ComponentPropsWithoutRef<C>, keyof TypographyProps>;

type PolymorphicRef<C extends ElementType> = ComponentPropsWithRef<C>["ref"];

export type TypographyComponent = <C extends ElementType = "span">(
  props: PolymorphicProps<C> & { ref?: PolymorphicRef<C> }
) => ReactElement | null;

function BaseTypography<C extends ElementType = "span">(
  {
    as,
    variant = "body",
    color,
    align,
    className,
    text,
    children,
    ...rest
  }: PolymorphicProps<C>,
  ref: PolymorphicRef<C>
) {
  const Component = (as ?? defaultElement[variant!]) as ElementType;
  return (
    <Component
      ref={ref}
      className={twMerge(
        typographyVariants({ variant, color, align }),
        className
      )}
      {...rest}
    >
      {text ?? children}
    </Component>
  );
}

/**
 * Needed to allow typings to be autocompleted when using `as="..."`
 * */
export const Typography = forwardRef(
  BaseTypography as unknown as (
    props: PolymorphicProps<ElementType> & { ref?: PolymorphicRef<ElementType> }
  ) => ReactElement | null
) as TypographyComponent;
