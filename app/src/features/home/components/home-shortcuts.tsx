import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { HOME_SHORTCUTS } from "../constants/shortcuts"

export function HomeShortcuts() {
  return (
    <section aria-labelledby="home-explore">
      <h2
        id="home-explore"
        className="text-sm font-bold uppercase tracking-[0.12em] text-brand-700"
      >
        Explore
      </h2>
      <nav aria-labelledby="home-explore" className="mt-4">
        <ul className="flex flex-wrap gap-4">
          {HOME_SHORTCUTS.map(({ href, label, description, icon: Icon }) => (
            <li key={href} className="flex-[1_1_320px]">
              <Link
                href={href}
                className="group flex h-full items-center gap-[18px] rounded-[28px] border border-brand-100 bg-white p-6 shadow-xl shadow-brand-900/10 outline-none transition-colors hover:border-brand-500 focus-visible:ring-3 focus-visible:ring-brand-500/40"
              >
                <span className="grid size-14 shrink-0 place-items-center rounded-[18px] bg-brand-900 text-lime-accent">
                  <Icon className="size-[26px]" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xl font-extrabold tracking-tight text-brand-900">
                    {label}
                  </span>
                  <span className="mt-1 block text-[15px] leading-snug text-muted-foreground">
                    {description}
                  </span>
                </span>
                <ArrowRight
                  className="size-5 shrink-0 text-brand-700 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  )
}
