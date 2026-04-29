import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "gold" | "blue";
type Size = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

const base =
  "inline-flex items-center gap-2 rounded-full font-display font-bold border-0 cursor-pointer transition-[transform,background] duration-100 active:translate-y-px whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-deep",
  ghost:
    "bg-transparent text-ink border-[1.5px] border-ink hover:bg-ink hover:text-white",
  gold: "bg-premium text-ink",
  blue: "bg-trust text-white",
};

const sizes: Record<Size, string> = {
  sm: "py-2 px-3.5 text-[12px]",
  md: "py-[11px] px-[18px] text-[13px]",
  lg: "py-[14px] px-[22px] text-[14px]",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className = "", children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
});

export default Button;
