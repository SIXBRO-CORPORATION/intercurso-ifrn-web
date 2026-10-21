"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { LoginButton } from "@/features/auth/components/login-button"
import { HIGHLIGHTS, type Highlight } from "../constants/highlights"
import { swipeDirection, wrapIndex } from "../utils/carousel"

const GLASS = "border border-white/15 bg-white/8 backdrop-blur-xl"

function SlideAction({ cta }: { cta: Highlight["cta"] }) {
  if (cta === "login") {
    return (
      <LoginButton className="mt-6 h-12 rounded-full bg-lime-accent px-6 text-[15px] font-bold text-brand-950 hover:bg-lime-accent/90">
        Entrar com SUAP
        <ArrowRight aria-hidden />
      </LoginButton>
    )
  }
  return (
    <Link
      href={cta.href}
      className="mt-6 inline-flex items-center gap-2 rounded-full text-[15px] font-bold text-lime-accent outline-none focus-visible:ring-3 focus-visible:ring-lime-accent/50"
    >
      {cta.label}
      <ArrowRight className="size-4" aria-hidden />
    </Link>
  )
}

function Slide({ highlight }: { highlight: Highlight }) {
  const { tag, title, description, cta, steps } = highlight
  return (
    <article
      className={cn(
        GLASS,
        "flex h-full flex-wrap items-center gap-8 rounded-4xl p-7 sm:p-9 lg:gap-12",
      )}
    >
      <div className="min-w-0 flex-[1_1_260px]">
        <span className="inline-block rounded-full bg-lime-accent/15 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-lime-accent">
          {tag}
        </span>
        <h3 className="mt-4 text-[clamp(1.625rem,4.4vw,2.375rem)] font-extrabold leading-[1.1] tracking-tight text-white">
          {title}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-white/80">
          {description}
        </p>
        <SlideAction cta={cta} />
      </div>

      {steps && (
        <ol className="flex min-w-0 flex-[1_1_280px] flex-col gap-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex items-center gap-4 rounded-2xl bg-white/9 px-4 py-3.5"
            >
              <span
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full text-[15px] font-extrabold",
                  index === 0
                    ? "bg-lime-accent text-brand-950"
                    : "bg-white/15 text-white",
                )}
              >
                {index + 1}
              </span>
              <span className="text-base font-semibold text-white">
                {step.title}
              </span>
            </li>
          ))}
        </ol>
      )}
    </article>
  )
}

export function HomeCarousel() {
  const [current, setCurrent] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const total = HIGHLIGHTS.length

  const goTo = (index: number) => setCurrent(wrapIndex(index, total))

  return (
    <section aria-labelledby="home-highlights" className="mt-16 sm:mt-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            id="home-highlights"
            className="text-[clamp(1.75rem,5vw,2.5rem)] font-extrabold tracking-tight text-white"
          >
            Em destaque
          </h2>
          <p className="mt-2 text-base text-white/75">
            O que você encontra no Intercurso.
          </p>
        </div>
        <div className="flex gap-2.5">
          <button
            type="button"
            aria-label="Slide anterior"
            onClick={() => goTo(current - 1)}
            className={cn(
              GLASS,
              "grid size-12 place-items-center rounded-full text-white outline-none transition-colors hover:bg-white/15 focus-visible:ring-3 focus-visible:ring-lime-accent/50",
            )}
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Próximo slide"
            onClick={() => goTo(current + 1)}
            className="grid size-12 place-items-center rounded-full bg-lime-accent text-brand-950 outline-none transition-colors hover:bg-lime-accent/90 focus-visible:ring-3 focus-visible:ring-lime-accent/50"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>
      </div>

      <div
        role="group"
        aria-roledescription="carrossel"
        aria-label="Em destaque"
        className="mt-7 overflow-hidden rounded-4xl"
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0].clientX
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null) return
          const direction = swipeDirection(
            touchStartX.current,
            event.changedTouches[0].clientX,
          )
          touchStartX.current = null
          if (direction !== 0) goTo(current + direction)
        }}
      >
        <div
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {HIGHLIGHTS.map((highlight, index) => (
            <div
              key={highlight.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} de ${total}`}
              aria-hidden={index !== current}
              inert={index !== current}
              className="w-full shrink-0 px-1.5"
            >
              <Slide highlight={highlight} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-1">
        {HIGHLIGHTS.map((highlight, index) => (
          <button
            key={highlight.id}
            type="button"
            aria-label={`Ir para: ${highlight.title}`}
            aria-current={index === current}
            onClick={() => goTo(index)}
            className="group grid h-11 min-w-7 place-items-center outline-none"
          >
            <span
              className={cn(
                "block h-2 rounded-full transition-all duration-300 group-focus-visible:ring-3 group-focus-visible:ring-lime-accent/50",
                index === current ? "w-7 bg-lime-accent" : "w-2 bg-white/40",
              )}
            />
          </button>
        ))}
      </div>
    </section>
  )
}
