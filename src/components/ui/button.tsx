import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const base = "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:pointer-events-none disabled:opacity-50";
const variants = {
  primary: "bg-brand text-white shadow-sm hover:bg-[#5b3de0]",
  secondary: "border border-line bg-white text-ink hover:border-brand/50",
  ghost: "text-ink hover:bg-black/5",
  danger: "bg-red-600 text-white hover:bg-red-700",
};
const sizes = { sm: "h-9 px-3 text-sm", md: "h-11 px-5 text-sm", lg: "h-12 px-6 text-base" };
type V = keyof typeof variants; type S = keyof typeof sizes;
export const buttonClass = (v: V = "primary", s: S = "md", extra?: string) => cn(base, variants[v], sizes[s], extra);

export function Button({ variant, size, className, type = "button", ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: V; size?: S }) {
  return <button type={type} className={buttonClass(variant, size, className)} {...p} />;
}
export function ButtonLink({ variant, size, className, href, ...p }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; variant?: V; size?: S }) {
  return <Link href={href} className={buttonClass(variant, size, className)} {...p} />;
}
