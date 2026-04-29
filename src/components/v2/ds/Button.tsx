import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

const buttonStyles = cva(
  "inline-flex items-center gap-2 rounded-pill font-display font-bold transition-[transform,background] duration-100 active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-brand text-white hover:bg-brand-deep",
        ghost:   "bg-transparent text-ink border-[1.5px] border-ink hover:bg-ink hover:text-paper",
        gold:    "bg-premium text-ink hover:brightness-95",
        blue:    "bg-trust text-white hover:brightness-95",
      },
      size: {
        sm: "px-3.5 py-2 text-[12px]",
        md: "px-4 py-2.5 text-[13px]",
        lg: "px-[22px] py-3.5 text-[15px]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

type Props = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonStyles>;

export default function Button({ variant, size, className, ...rest }: Props) {
  return <button className={buttonStyles({ variant, size, className })} {...rest} />;
}
