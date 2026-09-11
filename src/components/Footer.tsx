import Link from "next/link";
import { LogoMark } from "./Logo";
import { CATEGORIES, SITE } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-black/10 bg-volcanic text-sand">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5">
              <LogoMark className="h-9 w-9" />
              <span className="font-display text-lg font-bold">
                Tenerife<span className="text-gold italic"> Dice</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-sand/70">{SITE.description}</p>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-gold">
              Secciones
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-sand/80">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/categoria/${cat.slug}`} className="hover:text-white">
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-gold">
              Tenerife Dice
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-sand/80">
              <li>
                <Link href="/sobre-nosotros" className="hover:text-white">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-white">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/noticias" className="hover:text-white">
                  Todas las noticias
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-gold">
              Legal
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-sand/80">
              <li>
                <Link href="/aviso-legal" className="hover:text-white">
                  Aviso legal
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="hover:text-white">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-white">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-sand/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Tenerife Dice. Todos los derechos reservados.</p>
          <p>Hecho con 🌋 en Tenerife.</p>
        </div>
      </div>
    </footer>
  );
}
