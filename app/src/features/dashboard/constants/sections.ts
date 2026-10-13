import {
  CalendarRange, GitBranch, LayoutDashboard, Radio, Shield, Trophy, Users, Flag, UserCog,
  type LucideIcon,
} from "lucide-react"

// Quem pode usar: USER = aluno, MONITOR (ADMIN herda tudo, como no backend).
export type Role = "USER" | "MONITOR" | "ADMIN"

export type Feature = { name: string; description: string; role: Role; uc?: string }
export type Section = {
  slug: string
  label: string
  icon: LucideIcon
  summary: string
  features: Feature[]
}

export const OVERVIEW = { slug: "", label: "Visão geral", icon: LayoutDashboard }

export const SECTIONS: Section[] = [
  {
    slug: "ao-vivo",
    label: "Ao vivo",
    icon: Radio,
    summary: "Acompanhe jogos e resultados sem precisar de login.",
    features: [
      { name: "Lista de partidas", description: "Jogos paginados com filtro por status (agendado, em andamento, finalizado).", role: "USER" },
      { name: "Detalhe da partida", description: "Placar, sets, eventos e estatísticas dos jogadores.", role: "USER", uc: "UC016" },
      { name: "Feed em tempo real", description: "Gols, pontos, cartões e fim de período chegando por SSE.", role: "USER" },
      { name: "Acompanhar temporada", description: "Visão ao vivo da temporada: jogos e classificação.", role: "USER" },
    ],
  },
  {
    slug: "temporadas",
    label: "Temporadas",
    icon: CalendarRange,
    summary: "Ciclo de vida do Intercurso, do rascunho ao encerramento.",
    features: [
      { name: "Criar temporada", description: "Nova temporada em rascunho, com suas modalidades.", role: "MONITOR", uc: "UC001" },
      { name: "Gerenciar temporada", description: "Editar dados, abrir e fechar inscrições, reabrir inscrições.", role: "MONITOR", uc: "UC002" },
      { name: "Finalizar temporada", description: "Encerrar a temporada e consolidar resultados.", role: "MONITOR", uc: "UC003" },
      { name: "Listar temporadas", description: "Todas as temporadas com status (rascunho, inscrições, em andamento, finalizada).", role: "MONITOR" },
    ],
  },
  {
    slug: "modalidades",
    label: "Modalidades",
    icon: Trophy,
    summary: "Esportes do Intercurso e suas regras.",
    features: [
      { name: "Ver modalidades", description: "Modalidades disponíveis com formato e gênero.", role: "USER" },
      { name: "Cadastrar modalidade", description: "Formato (mata-mata, grupos + mata-mata, pontos corridos, triangular), modo de gênero e configuração, como a de vôlei.", role: "MONITOR", uc: "UC004" },
    ],
  },
  {
    slug: "equipes",
    label: "Equipes",
    icon: Users,
    summary: "Montagem, convites e aprovação dos times.",
    features: [
      { name: "Criar equipe", description: "Cria o time em rascunho e define o capitão.", role: "USER", uc: "UC005" },
      { name: "Entrar via convite", description: "Link de convite, com regeneração quando necessário.", role: "USER", uc: "UC006" },
      { name: "Gerenciar membros", description: "Adicionar, remover, trocar capitão e sair da equipe.", role: "USER", uc: "UC007" },
      { name: "Foto da equipe", description: "Enviar e remover a foto do time.", role: "USER" },
      { name: "Submeter equipe", description: "Enviar o time para análise dos monitores.", role: "USER", uc: "UC008" },
      { name: "Excluir rascunho", description: "Apagar equipe que ainda não foi submetida.", role: "USER" },
      { name: "Aprovar ou rejeitar", description: "Fila de equipes submetidas; rejeição exige motivo.", role: "MONITOR", uc: "UC009" },
      { name: "Confirmar doação", description: "Marcar doação pendente como confirmada.", role: "MONITOR", uc: "UC010" },
    ],
  },
  {
    slug: "chaveamento",
    label: "Chaveamento",
    icon: GitBranch,
    summary: "Grupos, chaves e confrontos de cada modalidade.",
    features: [
      { name: "Sugerir configuração", description: "O sistema propõe grupos e chaves a partir das equipes aprovadas.", role: "MONITOR", uc: "UC011" },
      { name: "Criar chaveamento", description: "Gera o bracket em rascunho para revisão.", role: "MONITOR", uc: "UC011" },
      { name: "Reorganizar", description: "Mover equipes entre grupos e ajustar confrontos.", role: "MONITOR", uc: "UC012" },
      { name: "Ativar e excluir", description: "Publicar o bracket (rascunho, ativo, finalizado) ou removê-lo.", role: "MONITOR", uc: "UC012" },
    ],
  },
  {
    slug: "partidas",
    label: "Partidas",
    icon: Shield,
    summary: "Mesa de controle dos jogos.",
    features: [
      { name: "Iniciar partida", description: "Muda o jogo para em andamento e dispara o cronômetro.", role: "MONITOR", uc: "UC013" },
      { name: "Registrar evento", description: "Gol, ponto, cartão amarelo ou vermelho, expulsão, pênalti, fim de set.", role: "MONITOR", uc: "UC014" },
      { name: "Cronômetro e períodos", description: "Iniciar, pausar e encerrar períodos.", role: "MONITOR", uc: "UC014" },
      { name: "Corrigir evento", description: "Editar ou desfazer um evento lançado errado.", role: "MONITOR", uc: "UC017" },
      { name: "Finalizar partida", description: "Fecha o placar e avança a chave.", role: "MONITOR", uc: "UC015" },
    ],
  },
  {
    slug: "reportes",
    label: "Reportes",
    icon: Flag,
    summary: "Conduta dos jogadores. Spec ainda sem rota no backend.",
    features: [
      { name: "Reportar jogador", description: "Categoria, descrição e opção de denúncia anônima, pelo perfil ou pela partida.", role: "USER", uc: "UC018" },
      { name: "Analisar reportes", description: "Fila de reportes pendentes por temporada.", role: "MONITOR", uc: "UC018" },
    ],
  },
  {
    slug: "usuarios",
    label: "Usuários",
    icon: UserCog,
    summary: "Perfis e permissões.",
    features: [
      { name: "Meu perfil", description: "Dados vindos do SUAP: nome, matrícula e se é atleta.", role: "USER" },
      { name: "Gerenciar usuários", description: "Buscar usuários e alterar o papel (aluno, monitor, admin).", role: "ADMIN" },
      { name: "Auditoria", description: "Histórico de ações sensíveis feitas no sistema.", role: "ADMIN" },
    ],
  },
]

const RANK: Record<string, number> = { USER: 0, MONITOR: 1, ADMIN: 2 }
export const canUse = (userRole: string | undefined, needed: Role) =>
  (RANK[userRole ?? "USER"] ?? 0) >= RANK[needed]
