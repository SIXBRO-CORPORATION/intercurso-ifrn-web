import { isAxiosError } from "axios"

export const RULES_DOCUMENT_MAX_BYTES = 10 * 1024 * 1024
export const RULES_DOCUMENT_ACCEPT = ".pdf,.docx"
const RULES_DOCUMENT_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

const GENERIC = "Não foi possível criar a temporada. Tente novamente."

export function validateRulesDocument(file: Pick<File, "name" | "type" | "size">) {
  // Alguns navegadores não informam o MIME do DOCX; a extensão cobre esse caso.
  const valid = RULES_DOCUMENT_TYPES.includes(file.type) || /\.(pdf|docx)$/i.test(file.name)
  if (!valid) return "Envie o regulamento em PDF ou DOCX."
  if (file.size > RULES_DOCUMENT_MAX_BYTES) return "O regulamento deve ter no máximo 10 MB."
  return null
}

export function parseCreateSeasonError(error: unknown) {
  if (!isAxiosError(error) || !error.response) return GENERIC
  const { status, data } = error.response
  if (status === 401) return "Sua sessão expirou. Entre novamente para criar a temporada."
  if (status === 403) return "Você não tem permissão para criar temporadas."
  if (status === 422) return "Confira os campos do formulário."
  // O backend devolve mensagens em português para as regras de negócio (ex.: temporada em aberto).
  if ((status === 400 || status === 409) && typeof data?.error === "string" && data.error) return data.error
  return GENERIC
}
