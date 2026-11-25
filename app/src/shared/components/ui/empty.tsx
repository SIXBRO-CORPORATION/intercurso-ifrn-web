import * as React from "react"
import { cn } from "cn"

function Empty({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="empty"
            className={cn("flex min-w-0 flex-col items-center justify-center gap-2 rounded-lg bg-card px-4 py-12 text-center text-balance", className)}
            {...props}
        />
    )
}

function EmptyTitle({ className, ...props }: React.ComponentProps<"div">) {
    return <div data-slot="empty-title" className={cn("type-h2", className)} {...props} />
}

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
    return <p data-slot="empty-description" className={cn("type-small max-w-sm text-text-secondary", className)} {...props} />
}

export { Empty, EmptyTitle, EmptyDescription }
