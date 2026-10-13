const KEY = "intercurso:return-to"
const AUTH_PREFIXES = ["/login", "/auth"]

const isAuthPath = (path: string) =>
  AUTH_PREFIXES.some(
    (p) => path === p || ["/", "?", "#"].some((sep) => path.startsWith(p + sep)),
  )

export function isSafeReturnPath(path: string | null | undefined): path is string {
  return !!path && /^\/(?![/\\])[^\x00-\x1f\\]*$/.test(path) && !isAuthPath(path)
}

export function saveReturnPath(path: string) {
  if (!isSafeReturnPath(path)) return
  try {
    sessionStorage.setItem(KEY, path)
  } catch {
    // storage indisponível: segue sem caminho de retorno
  }
}

export function takeReturnPath(): string | null {
  try {
    const value = sessionStorage.getItem(KEY)
    sessionStorage.removeItem(KEY)
    return isSafeReturnPath(value) ? value : null
  } catch {
    return null
  }
}
