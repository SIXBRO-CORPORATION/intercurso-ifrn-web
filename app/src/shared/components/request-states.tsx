import { Button } from "@/shared/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/shared/components/ui/empty"
import { Skeleton } from "@/shared/components/ui/skeleton"

export function GridSkeleton({ label, count = 4 }: { label: string; count?: number }) {
    return (
        <div role="status" aria-busy="true">
            <span className="sr-only">{label}</span>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
                {Array.from({ length: count }, (_, index) => (
                    <li key={index}>
                        <Skeleton className="h-52 rounded-xl" />
                    </li>
                ))}
            </ul>
        </div>
    )
}

type ErrorStateProps = { title: string; description?: string; onRetry?: () => void }

export function ErrorState({ title, description, onRetry }: ErrorStateProps) {
    return (
        <Alert variant="destructive" className="text-center">
            <AlertTitle>{title}</AlertTitle>
            {description && (
                <AlertDescription className="justify-items-center">{description}</AlertDescription>
            )}
            {onRetry && (
                <Button
                    type="button"
                    variant="danger-soft"
                    size="sm"
                    onClick={onRetry}
                    className="col-start-2 mt-2 justify-self-center"
                >
                    Tentar novamente
                </Button>
            )}
        </Alert>
    )
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
    return (
        <Empty role="status">
            <EmptyHeader>
                <EmptyTitle>{title}</EmptyTitle>
                {description && <EmptyDescription>{description}</EmptyDescription>}
            </EmptyHeader>
        </Empty>
    )
}
