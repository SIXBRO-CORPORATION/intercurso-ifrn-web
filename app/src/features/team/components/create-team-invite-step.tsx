"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert"
import { Button } from "@/shared/components/ui/button"
import { fieldClass } from "@/shared/components/ui/field-class"
import type { CreatedTeam } from "../schemas/team-schema"
import { buildInviteUrl } from "../utils/create-team"

export function CreateTeamInviteStep({ team }: { team: CreatedTeam }) {
    const [copied, setCopied] = useState(false)
    const url = team.invite_token ? buildInviteUrl(window.location.origin, team.invite_token) : null

    function copy() {
        if (!url) return
        navigator.clipboard.writeText(url).then(
            () => setCopied(true),
            () => setCopied(false),
        )
    }

    return (
        <div className="space-y-4">
            <Alert variant="success" role="status">
                <Check aria-hidden />
                <AlertTitle>Equipe “{team.name}” criada!</AlertTitle>
                <AlertDescription>Ela começa como rascunho. Compartilhe o link abaixo para chamar os colegas.</AlertDescription>
            </Alert>
            {url ? (
                <div className="space-y-1.5">
                    <label htmlFor="team-invite-link" className="type-label text-ink">
                        Link de convite
                    </label>
                    <div className="flex gap-2">
                        <input
                            id="team-invite-link"
                            readOnly
                            value={url}
                            className={fieldClass}
                            onFocus={(event) => event.target.select()}
                        />
                        <Button type="button" variant="soft" size="icon" onClick={copy} aria-label="Copiar link de convite">
                            {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
                        </Button>
                    </div>
                    <p role="status" className="type-body-sm text-muted-foreground">
                        {copied ? "Link copiado!" : "Quem tiver o link pode pedir para entrar na equipe."}
                    </p>
                </div>
            ) : (
                <Alert variant="warning">
                    <AlertTitle>O link de convite não foi gerado.</AlertTitle>
                    <AlertDescription>Abra a equipe em “Minhas equipes” para tentar novamente.</AlertDescription>
                </Alert>
            )}
        </div>
    )
}
