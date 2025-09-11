import React, { forwardRef, type JSX } from "react";
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

type TypographyOwnProps = VariantProps<typeof typographyVariants> & {
  as?: React.ElementType;
  text?: string;
  className?: string;
  children?: React.ReactNode;
};
type PolymorphicProps<C extends React.ElementType> = TypographyOwnProps &
  Omit<React.ComponentPropsWithoutRef<C>, keyof TypographyOwnProps>;

type TypographyComponent = <C extends React.ElementType = "span">(
  props: PolymorphicProps<C> & { ref?: React.Ref<Element> }
) => React.ReactElement | null;

const Typography = forwardRef(function Typography<
  C extends React.ElementType = "span"
>(
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
  ref: React.Ref<Element>
) {
  const Component = (as ?? defaultElement[variant!]) as React.ElementType;
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
}) as TypographyComponent;

export default Typography;
