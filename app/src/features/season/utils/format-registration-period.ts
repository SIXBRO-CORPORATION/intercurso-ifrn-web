const formatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})

// O endpoint de temporada ativa expõe apenas as datas de inscrição.
export function formatRegistrationPeriod(
  start: Date | null,
  end: Date | null,
): string | null {
  if (start && end) return `${formatter.format(start)} a ${formatter.format(end)}`
  if (start) return `A partir de ${formatter.format(start)}`
  if (end) return `Até ${formatter.format(end)}`
  return null
}
