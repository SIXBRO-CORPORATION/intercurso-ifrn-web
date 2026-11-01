const formatter = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" })

function toDate(value?: string | null) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

// O endpoint de temporada ativa expõe apenas as datas de inscrição.
export function formatRegistrationPeriod(start?: string | null, end?: string | null) {
  const from = toDate(start)
  const to = toDate(end)
  if (from && to) return `${formatter.format(from)} a ${formatter.format(to)}`
  if (from) return `A partir de ${formatter.format(from)}`
  if (to) return `Até ${formatter.format(to)}`
  return null
}
