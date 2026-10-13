"use client"

import type { ReactNode } from "react"
import { cn } from "cn"
import { Button } from "@/shared/components/ui/button"
import { saveReturnPath } from "@/infrastructure/storage/return-to-storage"
import { LOGIN_URL } from "../constants"

export function LoginButton({
                                children = "Entrar com SUAP",
                                className,
                            }: {
    children?: ReactNode
    className?: string
}) {
    return (
        <Button asChild size="lg" className={cn(className)}>
            <a
                href={LOGIN_URL}
                onClick={() =>
                    saveReturnPath(window.location.pathname + window.location.search)
                }
            >
                {children}
            </a>
        </Button>
    )
}