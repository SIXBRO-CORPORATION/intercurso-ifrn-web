# Realtime (SSE) — Intercurso IFRN Web

Guia de uso do cliente de tempo real e do contrato com o backend. A divisão de responsabilidades
(infraestrutura x feature) está em [`ARCHITECTURE.md`](ARCHITECTURE.md); as decisões do backend
estão nos ADRs 0003 e 0004 do repositório da API.

## Fluxo

```text
feature (hook) → connectRealtime → POST /api/realtime/ticket → EventSource /api/{canal}/{id}/live?ticket=…
                                                                   │
              onEvent ◄── schema (zod) ◄── eventos nomeados ◄──────┘
```

1. A feature chama `connectRealtime` informando o canal (`match` ou `season`).
2. O cliente pede um ticket (JWT de 30s). Sem sessão o ticket é anônimo; com sessão o cliente
   envia o `Bearer` e o ticket pertence ao usuário.
3. O cliente abre o `EventSource` com `?ticket=`. O ticket vale só para abrir a conexão.
4. Cada evento é validado pelo `schema` e entregue ao `onEvent`.
5. Se a conexão cai, o cliente fecha o `EventSource`, pede um ticket novo e reabre com backoff.
   Ao reabrir chama `onReconnect`, e a feature deve buscar o estado completo por `GET`.

O front não confia na reconexão nativa do `EventSource`: ela reutiliza a mesma URL e, depois de
30s, o ticket está expirado.

## Contrato com o backend

### Ticket

`POST /api/realtime/ticket`

```json
{ "channel_type": "match", "channel_id": "<uuid>" }
```

Resposta 200 no envelope `ApiResponse`: `data.ticket` e `data.expires_in_seconds`.

| Status | Causa | Reação do cliente |
| --- | --- | --- |
| 404 | partida ou temporada inexistente | `ticket_rejected`, encerra |
| 409 | partida que não está em andamento | `ticket_rejected`, encerra |
| 422 | corpo inválido | `ticket_rejected`, encerra |
| 429 | limite de tickets anônimos por IP | `rate_limited`, espera o `Retry-After` |
| 408 e 5xx | falha do servidor | `ticket_failed`, tenta de novo |

### Stream

`GET /api/match/{id}/live?ticket=…` e `GET /api/season/{id}/live?ticket=…`

- Os eventos são nomeados (`event: score_update`). Os tipos publicados em partidas incluem
  `match_started`, `score_update`, `clock_update`, `card_issued`, `period_started`, `period_ended`,
  `set_finished`, `event_deleted` e `match_finished`.
- O payload é `{ match_id, event, match }`, com `match` sendo o snapshot público da partida (pode
  ser `null`). Os mesmos eventos de partida também chegam no canal da temporada.
- `event: heartbeat` com `data: {}` a cada 15s, sem significado de negócio.
- `event: error` com `{ code: "connection_limit", detail, retry_after_seconds }`, seguido do
  fechamento do stream. Limites: 2 conexões por usuário e 100 por IP.
- 401 (ticket inválido, expirado ou de outro canal), 404 e 409 acontecem antes do stream abrir.

## Cliente

Arquivos:

| Arquivo | Papel |
| --- | --- |
| `src/core/realtime/types.ts` | `RealtimeSubscription`, `RealtimeChannel`, `RealtimeStatus`, `RealtimeError` |
| `src/infrastructure/realtime/realtime-client.ts` | `createRealtimeClient(http)` e `connectRealtime` |
| `src/lib/axios.ts` | instância `api`: `baseURL` de `NEXT_PUBLIC_API_URL` e `Bearer` do access token |

`connectRealtime(subscription)` devolve a função que encerra a conexão.

| Campo | Obrigatório | Descrição |
| --- | --- | --- |
| `channel` | sim | `{ type: "match" \| "season", id }` |
| `schema` | sim | objeto com `parse(data)`; um schema zod serve |
| `eventNames` | na prática, sim | nomes dos eventos a escutar; sem eles nenhum evento nomeado chega |
| `onEvent(data, eventName)` | sim | recebe o payload já validado |
| `staleAfterMs` | não | reconecta se nada chegar na janela; use pelo menos o dobro do heartbeat (40s) |
| `onStatus` | não | `connecting`, `open`, `reconnecting`, `closed` |
| `onReconnect` | não | abertura posterior a uma falha; hora de buscar o estado completo |
| `onError` | não | recebe `RealtimeError` |

### Erros

| `code` | Quando | O que o cliente faz |
| --- | --- | --- |
| `rate_limited` | 429 no ticket, ou `event: error` do stream | espera o `Retry-After` (ticket) ou 15s (stream) e tenta de novo |
| `ticket_failed` | 408, 5xx, rede ou resposta sem ticket | tenta de novo com backoff |
| `ticket_rejected` | demais 4xx no ticket | encerra e informa `closed` |
| `invalid_event` | JSON inválido ou recusado pelo schema | informa e mantém a conexão |

Backoff: 1s dobrando até 30s, com jitter de 50% a 100%. Volta a 1s quando a conexão abre.

## Como consumir numa feature

Hook em `src/features/match/hooks/use-match-live.ts`:

```ts
"use client"

import { useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"

import type { RealtimeStatus } from "@/core/realtime/types"
import { MATCH_EVENT_NAMES } from "@/features/match/constants/match-event-names"
import { matchEventSchema } from "@/features/match/schemas/match-event-schema"
import { connectRealtime } from "@/infrastructure/realtime/realtime-client"

export function useMatchLive(matchId: string) {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<RealtimeStatus>("connecting")

  useEffect(() => {
    const refresh = () => queryClient.invalidateQueries({ queryKey: ["match", matchId] })

    return connectRealtime({
      channel: { type: "match", id: matchId },
      schema: matchEventSchema,
      eventNames: MATCH_EVENT_NAMES,
      staleAfterMs: 40_000,
      onEvent: refresh,
      onReconnect: refresh,
      onStatus: setStatus,
    })
  }, [matchId, queryClient])

  return { status }
}
```

Regras:

- O significado do evento pertence à feature. O cliente não conhece telas nem regras de partida.
- Liste todos os tipos em `eventNames`, de preferência em `features/<feature>/constants`.
- Como o payload traz o snapshot da partida, a feature pode gravar `match` direto no cache em vez
  de só invalidar. Essa regra fica em `features/<feature>/services`, não no hook.
- Reconcilie sempre em `onReconnect`: eventos perdidos nunca são reenviados.
- Os callbacks são fixados na conexão. Quando uma dependência muda, o `useEffect` desconecta e
  conecta de novo.
- Cada usuário logado pode manter até 2 conexões ao mesmo tempo; um IP, até 100.

## Criar um canal novo

Backend:

1. Incluir o tipo em `LiveChannelType` e tratar o canal em `POST /api/realtime/ticket`.
2. Criar `GET /api/<tipo>/{id}/live` espelhando `match_live_controller`.
3. Publicar os eventos com `Broadcaster.publish` no canal novo.

Frontend:

1. Incluir o tipo na união de `RealtimeChannel` em `src/core/realtime/types.ts`. A URL é montada
   por convenção como `/api/{type}/{id}/live`, então a rota do backend precisa seguir o mesmo
   formato.
2. Criar o schema, a lista de eventos e o hook na feature consumidora.

## Limitações conhecidas

- O `EventSource` não expõe o status HTTP do stream. 401, 404 e 409 no `/live` aparecem como queda
  e o cliente tenta de novo até 30s de espera. Uma partida encerrada continua tentando até a
  feature desconectar.
- Eventos perdidos não são reenviados; a reconciliação por `GET` é obrigatória.
- O broadcaster do backend é em memória e funciona com uma única instância (ADR 0003).
- O tempo de 15s do limite de conexões existe nos dois lados (`LIMIT_DELAY_MS` no cliente e
  `retry_after_seconds` no backend).
- O ticket viaja na query string e pode ser reutilizado durante os 30s de validade.
- O limite por IP depende de o proxy repassar o IP real; ver o débito técnico no backend.