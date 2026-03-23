import { pagePaths } from "../../config/site";
import { buildFgtsOutcome } from "./logic/fgts";
import { buildLaborGeneralOutcome } from "./logic/laborGeneral";
import { buildOvertimeOutcome } from "./logic/overtime";
import { buildPixScamOutcome } from "./logic/pix";
import { buildTerminationOutcome } from "./logic/termination";
import type { SimulatorDefinition } from "./types";

const yesNoOptions = [
  { value: "sim", label: "Sim" },
  { value: "nao", label: "Nao" },
];

const laborViolationOptions = [
  {
    value: "horasExtrasNaoPagas",
    label: "Horas extras nao pagas",
    description: "Trabalhava alem do horario e nao recebia corretamente.",
  },
  {
    value: "domingosFeriados",
    label: "Domingos e feriados",
    description: "Trabalhava sem folga compensatoria adequada.",
  },
  {
    value: "intervaloIrregular",
    label: "Intervalo irregular",
    description: "Almoco ou descanso menor do que o devido.",
  },
  {
    value: "trabalhoNoturno",
    label: "Trabalho noturno",
    description: "Atuava apos as 22h sem adicional correto.",
  },
  {
    value: "insalubridade",
    label: "Insalubridade ou periculosidade",
    description: "Havia risco ou agente nocivo sem adicional devido.",
  },
  {
    value: "fgtsNaoPago",
    label: "FGTS nao depositado",
    description: "O extrato indica ausencia ou irregularidade de depositos.",
  },
  {
    value: "demissaoProblematica",
    label: "Demissao irregular",
    description: "As verbas rescisorias nao foram pagas como deveriam.",
  },
  {
    value: "tempoMaisTresAnos",
    label: "Mais de 3 anos na empresa",
    description: "Tempo maior de contrato tende a aumentar a exposicao financeira.",
  },
];

export const simulatorRegistry: SimulatorDefinition[] = [
  {
    id: "labor-general",
    slug: "trabalhista-geral",
    path: pagePaths.simulator,
    name: "Simulador trabalhista",
    shortDescription:
      "Triagem ampla para direitos trabalhistas nao pagos, com encaminhamento para o simulador mais adequado.",
    longDescription:
      "Use este fluxo quando a pergunta central for se existem sinais trabalhistas relevantes e qual simulador especifico deve ser aberto em seguida.",
    heroTitle: "Use este fluxo para descobrir qual simulador trabalhista faz mais sentido para o seu caso",
    heroDescription:
      "O simulador geral funciona como roteador inicial. Ele organiza os sinais do contrato e indica se o foco principal parece ser rescisao, horas extras, FGTS ou outro tema trabalhista.",
    area: "Trabalhista",
    timeToComplete: "3 a 4 minutos",
    eyebrow: "triagem trabalhista geral",
    introBullets: [
      "Bom para quem ainda nao sabe qual tese trabalhista e a principal.",
      "Ajuda a decidir entre rescisao, horas extras, FGTS ou atendimento humano.",
      "Pode cruzar o resumo com a base publica trabalhista do projeto.",
    ],
    stepLabels: ["Contrato", "Base", "Sinais"],
    seoTitle: "Simulador trabalhista para triagem inicial e escolha do fluxo correto",
    seoDescription:
      "Entenda se o seu caso parece mais com rescisao, horas extras, FGTS ou outro tema trabalhista antes da analise humana.",
    initialValues: {
      contractType: "",
      salary: null,
      yearsWorked: null,
      violations: [],
    },
    steps: [
      {
        id: "contract",
        title: "Qual era seu tipo de contratacao?",
        description: "Selecione a opcao que melhor descreve o vinculo principal.",
        fields: [
          {
            id: "contractType",
            label: "Tipo de contratacao",
            type: "choice",
            required: true,
            options: [
              { value: "clt", label: "CLT", description: "Carteira assinada" },
              { value: "pj", label: "PJ", description: "Pessoa juridica ou MEI" },
              {
                value: "informal",
                label: "Sem registro",
                description: "Trabalho informal ou sem carteira",
              },
            ],
          },
        ],
      },
      {
        id: "employment",
        title: "Base do contrato",
        description: "Essas informacoes ajudam a medir tamanho e prioridade do caso.",
        fields: [
          {
            id: "salary",
            label: "Quanto voce recebia por mes? (salario bruto)",
            type: "currency",
            required: true,
            placeholder: "Ex: R$ 3.000",
            min: 1,
          },
          {
            id: "yearsWorked",
            label: "Quantos anos trabalhou nessa empresa?",
            type: "number",
            required: true,
            placeholder: "Ex: 4",
            min: 0.5,
            step: 0.5,
          },
        ],
      },
      {
        id: "violations",
        title: "O que acontecia no trabalho?",
        description: "Marque tudo que se aplica ao seu caso.",
        fields: [
          {
            id: "violations",
            label: "Sinais trabalhistas",
            type: "multiselect",
            required: true,
            options: laborViolationOptions,
          },
        ],
      },
    ],
    supportsPublicCaseComparison: true,
    comparisonTitle: "Casos publicos comparaveis",
    comparisonSubtitle:
      "Comparacao montada a partir do resumo informado no formulario e dos sinais trabalhistas marcados na triagem.",
    computeResult: (values) => buildLaborGeneralOutcome(values),
  },
  {
    id: "termination",
    slug: "rescisao-trabalhista",
    path: "/simuladores/rescisao-trabalhista",
    name: "Simulador de rescisao trabalhista",
    shortDescription:
      "Triagem focada em verbas rescisorias, aviso previo, FGTS e multa rescisoria.",
    longDescription:
      "Use este simulador quando a principal duvida for sobre desligamento, verbas pendentes, FGTS e componentes do encerramento do contrato.",
    heroTitle: "Descubra se a sua rescisao pode ter verbas ou diferencas relevantes",
    heroDescription:
      "Este fluxo faz uma leitura inicial sobre saldo de salario, aviso previo, 13o, ferias, FGTS e multa rescisoria com regras simplificadas e cautelosas.",
    area: "Trabalhista",
    timeToComplete: "4 minutos",
    eyebrow: "rescisao trabalhista",
    introBullets: [
      "Focado em desligamento e itens que costumam aparecer na conferencia rescisoria.",
      "Usa conta simplificada para triagem, nao para substituir leitura de TRCT e extrato.",
      "Cruza o resumo com a base publica trabalhista quando fizer sentido.",
    ],
    stepLabels: ["Desligamento", "Tempo", "Pagamentos"],
    seoTitle: "Simulador de rescisao trabalhista e verbas pendentes",
    seoDescription:
      "Analise saldo de salario, aviso previo, 13o, ferias, FGTS e multa rescisoria em uma triagem trabalhista inicial.",
    initialValues: {
      dismissalType: "",
      salary: null,
      daysWorkedInMonth: null,
      yearsWorked: null,
      extraMonthsWorked: null,
      monthsWorkedCurrentYear: null,
      vacationOverduePeriods: null,
      proportionalVacationMonths: null,
      receivedSomeAmount: "",
      noticePaid: "",
      fgtsDeposited: "",
      multaPaid: "",
      vacationPending: "",
      thirteenthPending: "",
      hasValueDoubts: "",
    },
    steps: [
      {
        id: "dismissal",
        title: "Como esta ou ficou o desligamento?",
        description: "Comece pelo tipo de saida, salario base e saldo do ultimo mes.",
        fields: [
          {
            id: "dismissalType",
            label: "Tipo de desligamento",
            type: "choice",
            required: true,
            options: [
              { value: "sem-justa-causa", label: "Sem justa causa" },
              { value: "justa-causa", label: "Com justa causa" },
              { value: "pedido-demissao", label: "Pedido de demissao" },
              { value: "acordo", label: "Acordo" },
              {
                value: "simulacao",
                label: "Ainda nao sai / apenas simulacao",
                description: "Cenario simplificado de saida sem justa causa para triagem.",
              },
            ],
          },
          {
            id: "salary",
            label: "Salario bruto mensal",
            type: "currency",
            required: true,
            min: 1,
            placeholder: "Ex: R$ 4.200",
          },
          {
            id: "daysWorkedInMonth",
            label: "Quantos dias voce trabalhou no mes da saida ou da simulacao?",
            type: "number",
            required: true,
            min: 0,
            max: 30,
            step: 1,
          },
        ],
      },
      {
        id: "contract-time",
        title: "Qual era a base do contrato?",
        description: "Agora informe o tempo de empresa e os meses usados nas verbas proporcionais.",
        fields: [
          {
            id: "yearsWorked",
            label: "Anos completos de empresa",
            type: "number",
            required: true,
            min: 0,
            step: 1,
          },
          {
            id: "extraMonthsWorked",
            label: "Meses adicionais alem dos anos completos",
            type: "number",
            required: true,
            min: 0,
            max: 11,
            step: 1,
          },
          {
            id: "monthsWorkedCurrentYear",
            label: "Quantos meses voce trabalhou no ano corrente?",
            type: "number",
            required: true,
            min: 0,
            max: 12,
            step: 1,
          },
          {
            id: "proportionalVacationMonths",
            label: "Meses do periodo aquisitivo para ferias proporcionais",
            type: "number",
            required: true,
            min: 0,
            max: 11,
            step: 1,
          },
          {
            id: "vacationOverduePeriods",
            label: "Quantos periodos de ferias vencidas existiam?",
            type: "number",
            required: true,
            min: 0,
            max: 5,
            step: 1,
          },
        ],
      },
      {
        id: "payments",
        title: "O que foi pago ou ainda parece pendente?",
        description: "Essas respostas ajudam a separar composicao teorica de possiveis diferencas praticas.",
        fields: [
          {
            id: "receivedSomeAmount",
            label: "Voce recebeu alguma verba rescisoria?",
            type: "yesno",
            required: true,
            options: yesNoOptions,
          },
          {
            id: "noticePaid",
            label: "O aviso previo foi pago corretamente?",
            type: "yesno",
            required: true,
            options: yesNoOptions,
          },
          {
            id: "fgtsDeposited",
            label: "O FGTS parecia estar regular ate o desligamento?",
            type: "yesno",
            required: true,
            options: yesNoOptions,
          },
          {
            id: "multaPaid",
            label: "A multa rescisoria do FGTS foi paga quando cabia?",
            type: "yesno",
            required: true,
            options: yesNoOptions,
          },
          {
            id: "vacationPending",
            label: "Voce suspeita de ferias vencidas ou proporcionais pendentes?",
            type: "yesno",
            required: true,
            options: yesNoOptions,
          },
          {
            id: "thirteenthPending",
            label: "Voce suspeita de 13o proporcional pendente?",
            type: "yesno",
            required: true,
            options: yesNoOptions,
          },
          {
            id: "hasValueDoubts",
            label: "Existe duvida sobre os valores pagos?",
            type: "yesno",
            required: true,
            options: yesNoOptions,
          },
        ],
      },
    ],
    supportsPublicCaseComparison: true,
    comparisonTitle: "Casos publicos de rescisao comparaveis",
    comparisonSubtitle:
      "Comparacao baseada no resumo informado e nos sinais de verbas rescisorias, FGTS e desligamento.",
    computeResult: (values) => buildTerminationOutcome(values),
  },
  {
    id: "overtime",
    slug: "horas-extras",
    path: "/simuladores/horas-extras",
    name: "Simulador de horas extras",
    shortDescription:
      "Triagem para jornada acima do contratado, intervalo irregular e adicionais de horario.",
    longDescription:
      "Use este simulador quando a principal dor for jornada excessiva, pagamento incorreto de horas extras e reflexos ligados a horario.",
    heroTitle: "Veja se sua jornada pode indicar horas extras nao pagas",
    heroDescription:
      "Este fluxo compara a carga horaria contratual com a jornada real, mede intervalo e aponta adicionais possiveis de forma prudente.",
    area: "Trabalhista",
    timeToComplete: "3 a 4 minutos",
    eyebrow: "horas extras",
    introBullets: [
      "Focado em jornada real versus jornada contratada.",
      "Considera intervalo, domingos, feriados e adicional noturno sem prometer calculo exato de tudo.",
      "Pode cruzar o resumo com a base publica trabalhista do projeto.",
    ],
    stepLabels: ["Jornada", "Ritmo", "Adicionais"],
    seoTitle: "Simulador de horas extras e jornada de trabalho",
    seoDescription:
      "Analise horas extras, intervalo irregular, domingos, feriados e trabalho noturno em uma triagem trabalhista inicial.",
    initialValues: {
      salary: null,
      weeklyContractHours: null,
      actualHoursPerDay: null,
      daysPerWeek: null,
      monthsInPattern: null,
      breakMinutes: null,
      overtimeFrequency: "",
      sundayWork: "",
      holidayWork: "",
      nightWork: "",
      paidCorrectly: "",
    },
    steps: [
      {
        id: "journey",
        title: "Como era a base da sua jornada?",
        description: "Informe salario, carga semanal contratual e horario medio real.",
        fields: [
          {
            id: "salary",
            label: "Salario bruto mensal",
            type: "currency",
            required: true,
            min: 1,
            placeholder: "Ex: R$ 2.800",
          },
          {
            id: "weeklyContractHours",
            label: "Carga horaria contratual semanal",
            type: "number",
            required: true,
            min: 1,
            max: 60,
            step: 1,
            helper: "Exemplo comum: 44 horas semanais.",
          },
          {
            id: "actualHoursPerDay",
            label: "Horas reais trabalhadas por dia",
            type: "number",
            required: true,
            min: 0,
            max: 18,
            step: 0.5,
          },
          {
            id: "daysPerWeek",
            label: "Dias trabalhados por semana",
            type: "number",
            required: true,
            min: 1,
            max: 7,
            step: 1,
          },
        ],
      },
      {
        id: "pattern",
        title: "Com que frequencia isso acontecia?",
        description: "Agora detalhe o periodo e o intervalo intrajornada real.",
        fields: [
          {
            id: "monthsInPattern",
            label: "Por quantos meses essa rotina aconteceu?",
            type: "number",
            required: true,
            min: 1,
            max: 120,
            step: 1,
          },
          {
            id: "breakMinutes",
            label: "Quantos minutos de intervalo voce fazia em media?",
            type: "number",
            required: true,
            min: 0,
            max: 180,
            step: 5,
          },
          {
            id: "overtimeFrequency",
            label: "Com que frequencia as horas extras aconteciam?",
            type: "choice",
            required: true,
            options: [
              { value: "eventual", label: "Eventual" },
              { value: "1-2-semana", label: "1 a 2 vezes por semana" },
              { value: "3-4-semana", label: "3 a 4 vezes por semana" },
              { value: "quase-todos-dias", label: "Quase todos os dias" },
            ],
          },
        ],
      },
      {
        id: "additionals",
        title: "Havia outros adicionais ou falhas de pagamento?",
        description: "Esses itens nao entram todos no total principal, mas ajudam a medir potencial do caso.",
        fields: [
          {
            id: "sundayWork",
            label: "Trabalhava em domingos?",
            type: "yesno",
            required: true,
            options: yesNoOptions,
          },
          {
            id: "holidayWork",
            label: "Trabalhava em feriados?",
            type: "yesno",
            required: true,
            options: yesNoOptions,
          },
          {
            id: "nightWork",
            label: "Trabalhava apos as 22h?",
            type: "yesno",
            required: true,
            options: yesNoOptions,
          },
          {
            id: "paidCorrectly",
            label: "As horas extras eram pagas corretamente?",
            type: "yesno",
            required: true,
            options: yesNoOptions,
          },
        ],
      },
    ],
    supportsPublicCaseComparison: true,
    comparisonTitle: "Casos publicos de jornada comparaveis",
    comparisonSubtitle:
      "Comparacao baseada no resumo informado e nos sinais de horas extras, intervalo e adicionais trabalhistas.",
    computeResult: (values) => buildOvertimeOutcome(values),
  },
  {
    id: "fgts",
    slug: "fgts-nao-depositado",
    path: "/simuladores/fgts-nao-depositado",
    name: "Simulador de FGTS nao depositado",
    shortDescription:
      "Triagem para ausencia de depositos de FGTS, extensao da falha e confianca da prova.",
    longDescription:
      "Use este simulador quando a principal duvida for sobre falta de depositos de FGTS e necessidade de cobranca do valor nao recolhido.",
    heroTitle: "Descubra se o seu caso de FGTS nao depositado parece relevante",
    heroDescription:
      "Este fluxo mede o tamanho inicial da irregularidade, a qualidade da prova e a urgencia de revisao do caso.",
    area: "Trabalhista",
    timeToComplete: "2 a 3 minutos",
    eyebrow: "fgts nao depositado",
    introBullets: [
      "Focado em meses sem deposito, extrato do FGTS e situacao atual do contrato.",
      "Ajuda a medir a exposicao economica inicial do caso sem prometer valor exato.",
      "Pode comparar o resumo com a base publica trabalhista do projeto.",
    ],
    stepLabels: ["Base", "Extrato e prova"],
    seoTitle: "Simulador de FGTS nao depositado e cobranca trabalhista",
    seoDescription:
      "Estime a relevancia de um caso de FGTS nao depositado e organize extrato, prova, encerramento do contrato e valor preliminar.",
    initialValues: {
      salary: null,
      monthsWorked: null,
      checkedStatement: "",
      absenceLevel: "",
      employmentEnded: "",
      companyActive: "",
      hasProof: "",
    },
    steps: [
      {
        id: "base",
        title: "Qual era a base do contrato?",
        description: "Informe salario, duracao do vinculo e situacao atual do contrato.",
        fields: [
          {
            id: "salary",
            label: "Salario medio mensal",
            type: "currency",
            required: true,
            min: 1,
            placeholder: "Ex: R$ 3.500",
          },
          {
            id: "monthsWorked",
            label: "Quantos meses trabalhou nesse vinculo?",
            type: "number",
            required: true,
            min: 1,
            step: 1,
            placeholder: "Ex: 24",
          },
          {
            id: "employmentEnded",
            label: "O contrato ja terminou?",
            type: "yesno",
            required: true,
            options: yesNoOptions,
          },
          {
            id: "companyActive",
            label: "A empresa ainda esta ativa?",
            type: "yesno",
            required: true,
            options: yesNoOptions,
          },
        ],
      },
      {
        id: "proof",
        title: "O que voce ja conseguiu confirmar?",
        description: "Aqui a triagem mede a confiabilidade da suspeita e o tamanho da falha.",
        fields: [
          {
            id: "checkedStatement",
            label: "Voce ja conferiu o extrato do FGTS?",
            type: "yesno",
            required: true,
            options: yesNoOptions,
          },
          {
            id: "absenceLevel",
            label: "Qual parece ser a extensao da falta de depositos?",
            type: "choice",
            required: true,
            options: [
              { value: "alguns", label: "Alguns meses" },
              { value: "muitos", label: "Muitos meses" },
              { value: "quaseTodos", label: "Quase todo o periodo" },
            ],
          },
          {
            id: "hasProof",
            label: "Voce tem holerites, contrato ou documentos para confrontar o extrato?",
            type: "yesno",
            required: true,
            options: yesNoOptions,
          },
        ],
      },
    ],
    supportsPublicCaseComparison: true,
    comparisonTitle: "Casos publicos de FGTS comparaveis",
    comparisonSubtitle:
      "Comparacao baseada no resumo informado e nos sinais de FGTS irregular cadastrados na base trabalhista.",
    computeResult: (values) => buildFgtsOutcome(values),
  },
  {
    id: "pix-fraud",
    slug: "golpe-pix",
    path: "/simuladores/golpe-pix",
    name: "Simulador de golpe via PIX",
    shortDescription:
      "Triagem para fraude via PIX, tempo de comunicacao, documentacao e urgencia do caso.",
    longDescription:
      "Use este simulador quando o problema envolver transferencia via PIX em contexto de golpe, engenharia social, falsa central ou fraude em conta.",
    heroTitle: "Veja se o seu caso de golpe via PIX pede acao rapida",
    heroDescription:
      "Este fluxo organiza tempo do golpe, contato com o banco, provas e valor perdido para medir a prioridade inicial sem prometer recuperacao.",
    area: "Consumidor / Bancario",
    timeToComplete: "2 a 3 minutos",
    eyebrow: "golpe via PIX",
    introBullets: [
      "Focado em tempo de comunicacao, prova e historico de contato com o banco.",
      "Ajuda a separar os documentos e a urgencia do caso.",
      "Nao usa comparacao com a base trabalhista do projeto, porque se trata de outra area.",
    ],
    stepLabels: ["Golpe", "Documentacao"],
    seoTitle: "Simulador de golpe via PIX e triagem inicial do caso",
    seoDescription:
      "Avalie preliminarmente um golpe via PIX, o tempo de comunicacao ao banco, as provas disponiveis e a prioridade do caso.",
    initialValues: {
      amount: null,
      elapsed: "",
      fraudType: "",
      notifiedBank: "",
      contactedPlatform: "",
      formalResponse: "",
      filedReport: "",
      hasProof: "",
      hasConversationPrints: "",
    },
    steps: [
      {
        id: "fraud",
        title: "Como o golpe aconteceu?",
        description: "Comece pelo valor perdido, pelo tipo de fraude e pela rapidez da comunicacao.",
        fields: [
          {
            id: "amount",
            label: "Valor perdido via PIX",
            type: "currency",
            required: true,
            min: 1,
            placeholder: "Ex: R$ 4.800",
          },
          {
            id: "fraudType",
            label: "Tipo principal de golpe",
            type: "choice",
            required: true,
            options: [
              { value: "falsa-central", label: "Falsa central ou falso atendente" },
              { value: "conta-invadida", label: "Conta invadida ou dispositivo comprometido" },
              { value: "engenharia-social", label: "Engenharia social / urgencia / chantagem" },
              { value: "compra-falsa", label: "Compra ou anuncio falso" },
              { value: "outro", label: "Outro" },
            ],
          },
          {
            id: "elapsed",
            label: "Quanto tempo passou ate voce agir?",
            type: "choice",
            required: true,
            options: [
              { value: "ate24h", label: "Menos de 24 horas" },
              { value: "ate7dias", label: "Entre 1 e 7 dias" },
              { value: "ate30dias", label: "Entre 8 e 30 dias" },
              { value: "mais30dias", label: "Mais de 30 dias" },
            ],
          },
        ],
      },
      {
        id: "proof",
        title: "Quais passos voce ja tomou?",
        description: "Agora a triagem mede documentacao, protocolo e consistencia do caso.",
        fields: [
          {
            id: "notifiedBank",
            label: "O banco foi avisado formalmente?",
            type: "yesno",
            required: true,
            options: yesNoOptions,
          },
          {
            id: "contactedPlatform",
            label: "Voce abriu protocolo em banco, app ou plataforma oficial?",
            type: "yesno",
            required: true,
            options: yesNoOptions,
          },
          {
            id: "formalResponse",
            label: "Voce recebeu resposta formal do banco ou da plataforma?",
            type: "yesno",
            required: true,
            options: yesNoOptions,
          },
          {
            id: "filedReport",
            label: "Voce registrou boletim de ocorrencia?",
            type: "yesno",
            required: true,
            options: yesNoOptions,
          },
          {
            id: "hasProof",
            label: "Voce tem comprovantes da transferencia e protocolos?",
            type: "yesno",
            required: true,
            options: yesNoOptions,
          },
          {
            id: "hasConversationPrints",
            label: "Voce tem prints de conversa, tela ou contato relacionado ao golpe?",
            type: "yesno",
            required: true,
            options: yesNoOptions,
          },
        ],
      },
    ],
    computeResult: (values) => buildPixScamOutcome(values),
  },
];

export const simulatorRegistryBySlug = Object.fromEntries(
  simulatorRegistry.map((simulator) => [simulator.slug, simulator])
) as Record<string, SimulatorDefinition>;

export const simulatorRegistryByPath = Object.fromEntries(
  simulatorRegistry.map((simulator) => [simulator.path, simulator])
) as Record<string, SimulatorDefinition>;

export function getSimulatorBySlug(slug: string) {
  return simulatorRegistryBySlug[slug];
}

export function getSimulatorByPath(path: string) {
  return simulatorRegistryByPath[path];
}

export function getAllSimulatorPaths() {
  return simulatorRegistry.map((simulator) => simulator.path);
}

export const featuredSimulators = simulatorRegistry.filter(
  (simulator) => simulator.slug !== "trabalhista-geral"
);
