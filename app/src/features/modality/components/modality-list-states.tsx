import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/shared/components/ui/button"
import { Card } from "@/shared/components/ui/card"
import { SKELETON_COUNT } from "../constants"

export function ModalityListLoading({ label = "Carregando modalidades…" }: { label?: string }) {
    return (
        <div role="status" aria-busy="true">
            <span className="sr-only">{label}</span>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
                {Array.from({ length: SKELETON_COUNT }, (_, index) => (
                    <li key={index} className="h-52 rounded-xl bg-border/60 motion-safe:animate-pulse" />
                ))}
            </ul>
        </div>
    )
}

type ModalityMessageProps = {
    title: string
    children?: ReactNode
    alert?: boolean
    onRetry?: () => void
}

export function ModalityMessage({ title, children, alert, onRetry }: ModalityMessageProps) {
    return (
        <Card
            role={alert ? "alert" : "status"}
            className={cn("flex flex-col items-center gap-3 p-8 text-center", alert && "border-transparent bg-danger-soft")}
        >
            <p className={cn("type-section", alert ? "text-danger" : "text-ink")}>{title}</p>
            {children && <div className="type-body-sm text-muted-foreground">{children}</div>}
            {onRetry && (
                <Button type="button" variant="soft" size="sm" onClick={onRetry}>
                    Tentar novamente
                </Button>
            )}
        </Card>
    )
}