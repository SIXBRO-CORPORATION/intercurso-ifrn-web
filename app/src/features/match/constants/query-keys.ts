export const matchKeys = {
  all: ["match"] as const,
  list: (query: string) => ["match", "list", query] as const,
  detail: (id: string) => ["match", "detail", id] as const,
}
