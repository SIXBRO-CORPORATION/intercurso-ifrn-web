export const AUTH_API = "/api/auth"
export const LOGIN_URL = `${AUTH_API}/login/suap`
export const DEFAULT_AUTHENTICATED_PATH = "/dashboard"

export const LOGIN_ERROR_MESSAGES: Record<string, string> = {
  state_invalido:
    "Sua tentativa de login expirou ou é inválida. Tente entrar novamente.",
  login_falhou: "Não foi possível entrar com o SUAP. Tente novamente.",
  sessao_nao_recuperada:
    "Não foi possível concluir o login. Tente entrar novamente.",
}
export const GENERIC_LOGIN_ERROR = LOGIN_ERROR_MESSAGES.login_falhou
