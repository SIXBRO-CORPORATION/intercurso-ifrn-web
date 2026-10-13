import type { Metadata } from "next"
import Link from "next/link"
import { CircleAlert, Lock, LogIn } from "lucide-react"
import { BrandMark } from "@/features/auth/components/brand-mark"
import { LoginButton } from "@/features/auth/components/login-button"
import { LoginHero } from "@/features/auth/components/login-hero"
import {
    GENERIC_LOGIN_ERROR,
    LOGIN_ERROR_MESSAGES,
} from "@/features/auth/constants"

export const metadata: Metadata = { title: "Entrar · Intercurso IFRN" }

export default async function LoginPage({
                                            searchParams,
                                        }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { erro } = await searchParams
    const message =
        typeof erro === "string"
            ? (LOGIN_ERROR_MESSAGES[erro] ?? GENERIC_LOGIN_ERROR)
            : null

    return (
        <div className="grid min-h-screen bg-white lg:grid-cols-[1.1fr_1fr]">
            <LoginHero />

            <main className="flex flex-col bg-brand-50/60 lg:bg-white">
                <header className="rounded-b-3xl bg-linear-to-br from-brand-500 to-brand-700 px-6 pb-10 pt-8 lg:hidden">
                    <BrandMark tone="light" />
                    <p className="mt-6 max-w-xs text-2xl font-extrabold leading-tight text-white">
                        Acompanhe cada jogo do Intercurso.
                    </p>
                </header>

                <div className="flex flex-1 items-center justify-center px-6 py-10">
                    <div className="-mt-14 w-full max-w-sm rounded-3xl bg-white p-7 shadow-xl shadow-brand-900/10 ring-1 ring-brand-100 sm:p-8 lg:mt-0 lg:rounded-none lg:bg-transparent lg:p-0 lg:shadow-none lg:ring-0">
                        <h1 className="text-3xl font-extrabold tracking-tight text-brand-900">
                            Entrar
                        </h1>
                        <p className="mt-2 text-neutral-600">
                            Use sua conta do SUAP para acessar times, jogos e resultados.
                        </p>

                        {message && (
                            <p
                                role="alert"
                                className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                            >
                                <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
                                {message}
                            </p>
                        )}

                        <div className="mt-8 space-y-3">
                            <LoginButton className="h-12 w-full rounded-xl bg-brand-600 text-base font-semibold text-white shadow-md shadow-brand-600/25 hover:bg-brand-700">
                                <LogIn className="size-5" aria-hidden />
                                Entrar com SUAP
                            </LoginButton>

                            <p className="flex items-center justify-center gap-1.5 text-xs text-neutral-500">
                                <Lock className="size-3.5" aria-hidden />
                                Você será levado ao SUAP. Sua senha nunca passa por aqui.
                            </p>
                        </div>

                        <div className="my-8 flex items-center gap-3 text-xs uppercase tracking-wider text-neutral-400">
                            <span className="h-px flex-1 bg-neutral-200" />
                            ou
                            <span className="h-px flex-1 bg-neutral-200" />
                        </div>

                        <Link
                            href="/"
                            className="flex h-12 w-full items-center justify-center rounded-xl border border-brand-200 bg-white text-base font-semibold text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand-500/40"
                        >
                            Continuar sem entrar
                        </Link>
                    </div>
                </div>

                <footer className="px-6 pb-6 text-center text-xs text-neutral-400">
                    © Intercurso IFRN
                </footer>
            </main>
        </div>
    )
}