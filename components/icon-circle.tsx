import type React from "react"
interface IconCircleProps {
  icon: React.ReactNode
  color?: "primary" | "accent"
}

export function IconCircle({ icon, color = "primary" }: IconCircleProps) {
  const colorClass = color === "primary" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"

  return <div className={`w-16 h-16 rounded-full flex items-center justify-center ${colorClass}`}>{icon}</div>
}
