"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { label: "Маршруты", href: "/database" },
    { label: "Построить маршрут", href: "/builder" },
    { label: "Сообщество", href: "/community" },
  ]

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          <span className="text-xl font-semibold text-primary hidden sm:inline">Ventus</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground hover:text-primary transition-colors font-medium text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Login Button */}
        <div className="hidden md:flex items-center gap-4">
          <button className="px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-opacity-90 transition-all">
            Войти
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-secondary border-t border-border">
          <div className="max-w-7xl mx-auto px-8 py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
            <button className="w-full px-6 py-2 bg-primary text-white rounded-full font-medium hover:bg-opacity-90 transition-all mt-2">
              Войти
            </button>
          </div>
        </nav>
      )}
    </header>
  )
}
