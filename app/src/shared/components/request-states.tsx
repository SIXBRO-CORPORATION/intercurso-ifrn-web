import { Button } from "@/shared/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Empty, EmptyDescription, EmptyTitle } from "@/shared/components/ui/empty"
import { Skeleton } from "@/shared/components/ui/skeleton"

export function ListSkeleton({ label, count = 4 }: { label: string; count?: number }) {
    return (
        <div role="status" aria-busy="true">
            <span className="sr-only">{label}</span>
            <ul className="space-y-2" aria-hidden>
                {Array.from({ length: count }, (_, index) => (
                    <li key={index}>
                        <Skeleton className="h-16 rounded-lg" />
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
                    variant="secondary"
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
            <EmptyTitle>{title}</EmptyTitle>
            {description && <EmptyDescription>{description}</EmptyDescription>}
        </Empty>
    )
}
