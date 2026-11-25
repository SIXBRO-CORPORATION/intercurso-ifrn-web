import { LoaderCircle } from "lucide-react"

export function AuthStatusScreen({ message }: { message: string }) {
    return (
        <div role="status" className="flex min-h-svh flex-col items-center justify-center gap-4 p-6">
            <LoaderCircle className="size-8 text-primary-text motion-safe:animate-spin" aria-hidden />
            <p className="font-medium text-text-secondary">{message}</p>
        </div>
    )
}
