import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-8 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">Ventus</p>
          <p className="text-xs text-foreground/60">
            Умный гид для прогулок на природе.
          </p>
          <p className="text-[11px] text-foreground/50">
            © {new Date().getFullYear()} Ventus. Все права защищены.
          </p>
        </div>

        <nav className="flex flex-wrap gap-4 text-xs text-foreground/70">
          <Link
            href="/about"
            className="hover:text-foreground underline-offset-4 hover:underline"
          >
            О проекте
          </Link>
          <Link
            href="/legal/terms"
            className="hover:text-foreground underline-offset-4 hover:underline"
          >
            Пользовательское соглашение
          </Link>
          <Link
            href="/legal/privacy"
            className="hover:text-foreground underline-offset-4 hover:underline"
          >
            Политика конфиденциальности
          </Link>
        </nav>
      </div>
    </footer>
  )
}
