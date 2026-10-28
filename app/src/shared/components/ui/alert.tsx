import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const alertVariants = cva(
    "relative grid w-full grid-cols-[0_1fr] items-start gap-y-1 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[1rem_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
    {
        variants: {
            variant: {
                default: "border-border bg-card text-card-foreground",
                destructive: "border-transparent bg-danger-soft text-danger *:data-[slot=alert-description]:text-danger/90",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

function Alert({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
    return <div data-slot="alert" role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
    return <div data-slot="alert-title" className={cn("type-section col-start-2 min-h-4", className)} {...props} />
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="alert-description"
            className={cn("type-body-sm col-start-2 grid justify-items-start gap-1 text-muted-foreground", className)}
            {...props}
        />
    )
}

export { Alert, AlertTitle, AlertDescription }
