import { cva, type VariantProps } from "class-variance-authority";
import type { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    text?: string;
  };

const buttonVariants = cva(
  "inline-flex items-center justify-center transition-colors relative overflow-hidden \
  cursor-pointer disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-70 \
  font-inter font-bold text-base leading-[18px]",
  {
    variants: {
      variant: {
        primary: "bg-[#404B66] hover:bg-[#030E2D] text-white rounded-[6px]",
        secondary:
          "bg-transparent border-[1.5px] border-[#404B66] hover:bg-[#404B66]/10 text-[#404B66] rounded-[6px]",
      },
      size: {
        default: "h-10 px-[14px] py-[9px] gap-[10px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export const Button = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<ButtonProps>
>(({ variant, text, size, children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={twMerge(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {text || children}
    </button>
  );
});

export const FormButton = (props: PropsWithChildren<ButtonProps>) => {
  const {
    formState: { isDirty, isValid },
  } = useFormContext();
  return <Button {...props} disabled={!isValid || !isDirty} />;
};

Button.displayName = "Button";
