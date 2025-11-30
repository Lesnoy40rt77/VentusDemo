import type React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline"
  children: React.ReactNode
  asChild?: boolean // 👈 добавили, чтобы React не ругался
}

export function Button({
  variant = "primary",
  children,
  className = "",
  asChild,        // 👈 вытаскиваем, чтобы не улетел в DOM
  ...props
}: ButtonProps) {
  const baseStyles =
    "px-6 py-3 rounded-full font-medium transition-all text-base"

  const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "bg-primary text-white hover:bg-opacity-90 active:scale-95",
    secondary: "bg-secondary text-primary hover:bg-opacity-80",
    outline:
      "border-2 border-primary text-primary hover:bg-primary hover:text-white",
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props} // 👈 здесь asChild уже НЕТ
    >
      {children}
    </button>
  )
}
