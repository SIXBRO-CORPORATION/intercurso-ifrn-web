import { LoaderCircle } from "lucide-react"

export function AuthStatusScreen({ message }: { message: string }) {
    return (
        <div
            role="status"
            className="flex min-h-screen flex-col items-center justify-center gap-4 bg-brand-50 p-6"
        >
            <LoaderCircle className="size-8 animate-spin text-brand-600" aria-hidden />
            <p className="text-sm font-medium text-brand-800">{message}</p>
        </div>
    )
}