import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Copyright */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-background font-bold text-lg">V</span>
              </div>
              <span className="text-lg font-semibold">Ventus</span>
            </div>
            <p className="text-sm opacity-75">© Ventus 2025</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Компания</h4>
            <ul className="space-y-2 text-sm opacity-75">
              <li>
                <Link href="/about" className="hover:opacity-100 transition-opacity">
                  О проекте
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:opacity-100 transition-opacity">
                  Контакты
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:opacity-100 transition-opacity">
                  Поддержка
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Ресурсы</h4>
            <ul className="space-y-2 text-sm opacity-75">
              <li>
                <Link href="/routes" className="hover:opacity-100 transition-opacity">
                  База треков
                </Link>
              </li>
              <li>
                <Link href="/community" className="hover:opacity-100 transition-opacity">
                  Сообщество
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:opacity-100 transition-opacity">
                  Безопасность
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Правовая информация</h4>
            <ul className="space-y-2 text-sm opacity-75">
              <li>
                <Link href="/privacy" className="hover:opacity-100 transition-opacity">
                  Конфиденциальность
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:opacity-100 transition-opacity">
                  Условия использования
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-75">
          <p>Ventus © 2025. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
