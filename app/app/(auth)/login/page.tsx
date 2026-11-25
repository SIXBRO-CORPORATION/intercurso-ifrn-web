import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { CircleAlert, Lock } from "lucide-react"
import logo from "@/assets/logo-intercurso_branca.png"
import { href } from "@/core/routes/route-registry"
import { LoginButton } from "@/features/auth/components/login-button"
import { GENERIC_LOGIN_ERROR, LOGIN_ERROR_MESSAGES } from "@/features/auth/constants"
import { AppShell } from "@/features/shell/components/app-shell"
import { Alert, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"

export const metadata: Metadata = { title: "Entrar · Intercurso IFRN" }

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { erro } = await searchParams
    const message = typeof erro === "string" ? (LOGIN_ERROR_MESSAGES[erro] ?? GENERIC_LOGIN_ERROR) : null

    return (
        <AppShell>
            <Card className="mx-auto flex w-full max-w-100 flex-col items-center gap-3.5 px-6 py-8 text-center md:mt-6">
                <Image src={logo} alt="" width={34} height={56} className="h-14 w-auto" />
                <h2 className="type-h1">Entre com sua conta SUAP</h2>
                <p className="text-pretty text-text-secondary">
                    Para acompanhar os jogos não precisa entrar. O login é pedido para criar equipe, aceitar convite ou gerir o Intercurso.
                </p>
                {message && (
                    <Alert variant="destructive" className="text-left">
                        <CircleAlert aria-hidden />
                        <AlertTitle>{message}</AlertTitle>
                    </Alert>
                )}
                <LoginButton className="w-full">
                    <Lock aria-hidden />
                    Entrar com SUAP
                </LoginButton>
                <Button asChild variant="ghost" className="w-full">
                    <Link href={href("home")}>Continuar sem entrar</Link>
                </Button>
                <p className="type-small text-muted-foreground">Você será levado ao SUAP. Sua senha nunca passa por aqui.</p>
            </Card>
        </AppShell>
    )
}
