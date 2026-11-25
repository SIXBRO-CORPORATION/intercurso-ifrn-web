import Image from "next/image"
import greenLogo from "@/assets/logo-intercurso_verde.png"
import whiteLogo from "@/assets/logo-intercurso_branca.png"

export function BrandMark({ white = false, compact = false }: { white?: boolean; compact?: boolean }) {
    return (
        <span className="flex items-center gap-2.5 whitespace-nowrap">
            <Image src={white ? whiteLogo : greenLogo} alt="" width={24} height={40} className={compact ? "h-7 w-auto" : "h-10 w-auto"} />
            {!compact && (
                <span className="flex flex-col gap-0.5">
                    <span className="text-[1.0625rem] leading-tight font-bold">Intercurso</span>
                    <span className="text-[0.6875rem] leading-tight text-muted-foreground">IFRN · Pau dos Ferros</span>
                </span>
            )}
        </span>
    )
}
