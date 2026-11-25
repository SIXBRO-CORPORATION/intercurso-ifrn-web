"use client"

import type { ComponentProps, ReactNode } from "react"
import { Button } from "@/shared/components/ui/button"
import { saveReturnPath } from "@/infrastructure/storage/return-to-storage"
import { LOGIN_URL } from "../constants"

export function LoginButton({
    children = "Entrar com SUAP",
    className,
    size = "lg",
}: {
    children?: ReactNode
    className?: string
    size?: ComponentProps<typeof Button>["size"]
}) {
    return (
        <Button asChild size={size} className={className}>
            <a href={LOGIN_URL} onClick={() => saveReturnPath(window.location.pathname + window.location.search)}>
                {children}
            </a>
        </Button>
    )
}
