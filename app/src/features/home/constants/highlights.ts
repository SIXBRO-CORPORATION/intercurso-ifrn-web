export type HighlightStep = { title: string }

export type Highlight = {
  id: string
  tag: string
  title: string
  description: string
  cta: { label: string; href: string } | "login"
  steps?: HighlightStep[]
}

export const HIGHLIGHTS: Highlight[] = [
  {
    id: "partidas",
    tag: "Agenda",
    title: "Próximos jogos",
    description:
      "Horários, quadras e confrontos, com placar e eventos ao vivo.",
    cta: { label: "Ver todas as partidas", href: "/partidas" },
  },
  {
    id: "equipes",
    tag: "Equipes",
    title: "Conheça as equipes",
    description: "Foto, modalidade e nome de cada time inscrito.",
    cta: { label: "Ver modalidades", href: "/modalidades" },
  },
  {
    id: "modalidades",
    tag: "Modalidades",
    title: "Escolha seu esporte",
    description: "Classificação e chaveamento de cada modalidade.",
    cta: { label: "Ver todas as modalidades", href: "/modalidades" },
  },
  {
    id: "participar",
    tag: "Para atletas",
    title: "Monte sua equipe",
    description: "Entre com sua conta do SUAP e comece em poucos passos.",
    cta: "login",
    steps: [
      { title: "Entre com o SUAP" },
      { title: "Crie a equipe ou entre por convite" },
      { title: "Envie para a aprovação do monitor" },
    ],
  },
]
