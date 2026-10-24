const ISO = /^(\d{4})-(\d{2})-(\d{2})$/

export function parseIsoDate(value: string): Date | undefined {
  const m = ISO.exec(value)
  if (!m) return undefined
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
  const date = new Date(y, mo - 1, d)
  return date.getFullYear() === y && date.getMonth() === mo - 1 && date.getDate() === d ? date : undefined
}

export function toIsoDate(date: Date) {
  const p = (n: number, len = 2) => String(n).padStart(len, "0")
  return `${p(date.getFullYear(), 4)}-${p(date.getMonth() + 1)}-${p(date.getDate())}`
}

export function formatBrDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(date)
}
