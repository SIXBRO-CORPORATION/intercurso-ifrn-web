import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { cn } from "cn"
import { Button } from "@/shared/components/ui/button"

type BackButtonProps = {
    /** Destino fixo: não depende do histórico do navegador. */
    href: string
    children?: ReactNode
    className?: string
}

export function BackButton({ href, children = "Voltar", className }: BackButtonProps) {
    return (
        <Button asChild variant="ghost" size="sm" className={cn("-ml-3", className)}>
            <Link href={href}>
                <ArrowLeft aria-hidden /> {children}
            </Link>
        </Button>
    )
}
