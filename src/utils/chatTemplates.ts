export interface ChatResponse {
  summary: string;
  questions: string[];
  scenarios: {
    label: string;
    probability: string;
    description: string;
  }[];
  timeline: {
    step: string;
    description: string;
    duration: string;
  }[];
  checklist: string[];
  nextSteps: string[];
  urgency?: {
    level: 'high' | 'medium' | 'low';
    message: string;
  };
}

const templates: Record<string, ChatResponse> = {
  consumidor: {
    summary:
      'Você tem um caso de direito do consumidor envolvendo relação de compra, serviço ou cobrança. Pode buscar reparação por danos, cancelamento de contratos ou revisão de cobranças indevidas.',
    questions: [
      'Você tem comprovante da compra ou contrato do serviço?',
      'Já tentou resolver diretamente com a empresa (protocolo de atendimento)?',
      'Há mensagens, e-mails ou gravações que comprovem o problema?',
      'O valor envolvido é superior a 20 salários mínimos?',
      'Você está negativado ou há cobranças recorrentes?',
    ],
    scenarios: [
      {
        label: 'Cenário A',
        probability: 'Mais comum',
        description:
          'Acordo ou resolução administrativa via Procon, sem necessidade de processo judicial. Maioria dos casos de consumidor se resolve nesta fase.',
      },
      {
        label: 'Cenário B',
        probability: 'Possível',
        description:
          'Ação no Juizado Especial (pequenas causas) para valores até 40 salários mínimos. Processo mais rápido, sem necessidade de advogado.',
      },
      {
        label: 'Cenário C',
        probability: 'Menos comum',
        description:
          'Ação judicial na Justiça Comum para valores altos ou casos complexos. Processo mais demorado, exige advogado.',
      },
    ],
    timeline: [
      {
        step: 'Reclamação no Procon',
        description: 'Tentativa de resolução administrativa',
        duration: '30-60 dias',
      },
      {
        step: 'Tentativa de acordo',
        description: 'Negociação direta ou com mediação',
        duration: '15-30 dias',
      },
      {
        step: 'Petição inicial',
        description: 'Abertura do processo judicial, se necessário',
        duration: '1-5 dias',
      },
      {
        step: 'Audiência de conciliação',
        description: 'Última tentativa de acordo',
        duration: '60-90 dias após petição',
      },
      {
        step: 'Sentença',
        description: 'Decisão do juiz',
        duration: '6-12 meses',
      },
    ],
    checklist: [
      'Nota fiscal ou comprovante de compra',
      'Contrato ou termos de serviço',
      'Protocolos de atendimento',
      'E-mails, mensagens ou gravações',
      'Comprovantes de pagamento',
      'Prints de telas (se for serviço digital)',
      'Fotos do produto com defeito (se aplicável)',
    ],
    nextSteps: [
      'Reúna todos os documentos listados no checklist',
      'Registre uma reclamação no Procon ou no site Consumidor.gov.br',
      'Tente contato formal com a empresa (por escrito)',
      'Se não resolver, considere ação no Juizado Especial',
    ],
  },
  trabalhista: {
    summary:
      'Você tem um caso de direito trabalhista relacionado a demissão, verbas rescisórias, horas extras ou condições de trabalho. É possível reclamar direitos não pagos ou buscar indenizações.',
    questions: [
      'Você tem carteira assinada ou trabalhou como PJ/autônomo?',
      'Possui contracheques, recibos de pagamento ou controle de ponto?',
      'Foi demitido há menos de 2 anos?',
      'Recebeu todas as verbas rescisórias (férias, 13º, aviso prévio, FGTS)?',
      'Há testemunhas ou provas de horas extras, assédio ou acidente?',
    ],
    scenarios: [
      {
        label: 'Cenário A',
        probability: 'Mais comum',
        description:
          'Reclamação trabalhista com acordo em audiência. Maioria dos casos trabalhistas termina em acordo antes da sentença.',
      },
      {
        label: 'Cenário B',
        probability: 'Possível',
        description:
          'Processo completo até sentença, com perícia (se houver acidente ou dano). Pode levar 1-2 anos.',
      },
      {
        label: 'Cenário C',
        probability: 'Menos comum',
        description:
          'Caso arquivado por falta de provas ou ausência em audiência. Importante comparecer e ter documentação.',
      },
    ],
    timeline: [
      {
        step: 'Petição inicial',
        description: 'Abertura da reclamação trabalhista',
        duration: '1-3 dias',
      },
      {
        step: 'Audiência inicial',
        description: 'Primeira tentativa de acordo',
        duration: '30-60 dias',
      },
      {
        step: 'Instrução processual',
        description: 'Apresentação de provas e testemunhas',
        duration: '60-90 dias',
      },
      {
        step: 'Sentença',
        description: 'Decisão do juiz',
        duration: '12-18 meses',
      },
      {
        step: 'Recursos (se houver)',
        description: 'Tribunais superiores',
        duration: 'Variável',
      },
    ],
    checklist: [
      'Carteira de trabalho (CTPS)',
      'Contracheques ou recibos de pagamento',
      'Termo de rescisão de contrato',
      'Extrato do FGTS',
      'Controle de ponto (se houver)',
      'Mensagens, e-mails ou gravações (assédio, ordens)',
      'Atestados médicos (se for acidente)',
      'Nome e contato de testemunhas',
    ],
    nextSteps: [
      'Reúna toda a documentação trabalhista',
      'Organize provas de horas extras ou irregularidades',
      'Se foi demitido, verifique se recebeu tudo corretamente',
      'Consulte um advogado trabalhista para avaliar o caso',
    ],
    urgency: {
      level: 'medium',
      message:
        'Atenção: O prazo para reclamar direitos trabalhistas é de 2 anos após a demissão. Não deixe para depois!',
    },
  },
  familia: {
    summary:
      'Você tem um caso de direito de família envolvendo pensão, guarda, divórcio ou reconhecimento de união. Esses processos costumam exigir documentação específica e podem envolver mediação.',
    questions: [
      'Há filhos menores de idade envolvidos?',
      'Existe acordo entre as partes ou há conflito?',
      'Vocês eram casados, em união estável ou apenas relacionamento?',
      'Há bens a serem partilhados (imóveis, veículos, etc)?',
      'A outra parte está pagando pensão (se aplicável)?',
    ],
    scenarios: [
      {
        label: 'Cenário A',
        probability: 'Mais comum',
        description:
          'Acordo em audiência de conciliação, com homologação judicial. Processo mais rápido e menos desgastante.',
      },
      {
        label: 'Cenário B',
        probability: 'Possível',
        description:
          'Processo litigioso com decisão judicial sobre guarda, pensão ou partilha. Pode durar 1-2 anos.',
      },
      {
        label: 'Cenário C',
        probability: 'Variável',
        description:
          'Necessidade de perícia psicológica (guarda) ou avaliação de bens (partilha). Aumenta o tempo do processo.',
      },
    ],
    timeline: [
      {
        step: 'Petição inicial',
        description: 'Abertura do processo',
        duration: '1-5 dias',
      },
      {
        step: 'Audiência de conciliação',
        description: 'Tentativa de acordo',
        duration: '30-60 dias',
      },
      {
        step: 'Instrução (se não houver acordo)',
        description: 'Perícias, testemunhas, provas',
        duration: '6-12 meses',
      },
      {
        step: 'Sentença',
        description: 'Decisão do juiz',
        duration: '12-24 meses',
      },
    ],
    checklist: [
      'Certidão de nascimento dos filhos',
      'Certidão de casamento ou união estável',
      'Comprovantes de renda (holerites, extratos)',
      'Despesas dos filhos (escola, saúde, etc)',
      'Documentos de bens (imóveis, veículos)',
      'Provas de residência e convivência',
      'Mensagens ou e-mails relevantes',
    ],
    nextSteps: [
      'Organize toda documentação pessoal e dos filhos',
      'Liste bens e despesas mensais',
      'Tente conversar e buscar acordo (se possível)',
      'Consulte um advogado de família para orientação formal',
    ],
  },
  civil: {
    summary:
      'Você tem um caso de direito civil relacionado a contratos, inadimplência, indenizações ou responsabilidade. Pode envolver cobrança, renegociação ou rescisão contratual.',
    questions: [
      'Há um contrato escrito ou foi acordo verbal?',
      'Qual o valor envolvido na questão?',
      'Há testemunhas ou documentos que comprovem o acordo?',
      'A outra parte reconhece a dívida ou o problema?',
      'Houve tentativa de negociação antes?',
    ],
    scenarios: [
      {
        label: 'Cenário A',
        probability: 'Mais comum',
        description:
          'Acordo extrajudicial ou mediação privada. Evita custos e tempo de processo.',
      },
      {
        label: 'Cenário B',
        probability: 'Possível',
        description:
          'Ação de cobrança ou rescisão contratual. Processo pode levar 1-2 anos até decisão final.',
      },
      {
        label: 'Cenário C',
        probability: 'Variável',
        description:
          'Necessidade de perícia técnica (defeitos, avaliações). Aumenta complexidade e tempo.',
      },
    ],
    timeline: [
      {
        step: 'Notificação extrajudicial',
        description: 'Tentativa formal de resolução',
        duration: '15-30 dias',
      },
      {
        step: 'Petição inicial',
        description: 'Abertura do processo',
        duration: '1-5 dias',
      },
      {
        step: 'Citação do réu',
        description: 'Notificação da outra parte',
        duration: '30-60 dias',
      },
      {
        step: 'Defesa e instrução',
        description: 'Provas e perícias',
        duration: '6-12 meses',
      },
      {
        step: 'Sentença',
        description: 'Decisão judicial',
        duration: '12-24 meses',
      },
    ],
    checklist: [
      'Contrato assinado ou termos do acordo',
      'Comprovantes de pagamento (se houver)',
      'Mensagens, e-mails ou gravações',
      'Fotos ou laudos técnicos (defeitos)',
      'Testemunhas que presenciaram o acordo',
      'Notificações ou cobranças anteriores',
    ],
    nextSteps: [
      'Reúna toda a documentação do contrato',
      'Tente negociação direta (por escrito)',
      'Se não resolver, envie notificação extrajudicial',
      'Consulte advogado para avaliar viabilidade de ação',
    ],
  },
  saude: {
    summary:
      'Você tem um caso relacionado a plano de saúde, negativa de cobertura, reembolso ou problemas com atendimento médico. Pode buscar autorização judicial ou indenização.',
    questions: [
      'Há negativa por escrito do plano (protocolo ou e-mail)?',
      'O procedimento está previsto no contrato do plano?',
      'Há pedido médico ou relatório justificando a necessidade?',
      'Trata-se de urgência ou emergência médica?',
      'Já cumpriu carências contratuais?',
    ],
    scenarios: [
      {
        label: 'Cenário A',
        probability: 'Comum em urgências',
        description:
          'Liminar para obrigar plano a autorizar procedimento. Decisão pode sair em 24-48h em casos urgentes.',
      },
      {
        label: 'Cenário B',
        probability: 'Comum',
        description:
          'Ação para reembolso ou indenização por danos. Processo segue rito normal, 12-18 meses.',
      },
      {
        label: 'Cenário C',
        probability: 'Variável',
        description:
          'Recurso à ANS (Agência Nacional de Saúde) antes ou paralelamente ao processo judicial.',
      },
    ],
    timeline: [
      {
        step: 'Reclamação na ANS',
        description: 'Tentativa administrativa',
        duration: '10-15 dias',
      },
      {
        step: 'Petição com pedido liminar',
        description: 'Abertura do processo (se urgente)',
        duration: '1-2 dias',
      },
      {
        step: 'Decisão liminar',
        description: 'Autorização emergencial',
        duration: '24-48h',
      },
      {
        step: 'Instrução processual',
        description: 'Provas e perícias médicas',
        duration: '6-12 meses',
      },
      {
        step: 'Sentença',
        description: 'Decisão final',
        duration: '12-18 meses',
      },
    ],
    checklist: [
      'Carta ou e-mail de negativa do plano',
      'Pedido médico ou relatório detalhado',
      'Contrato do plano de saúde',
      'Protocolos de atendimento',
      'Comprovantes de pagamento das mensalidades',
      'Exames e laudos médicos',
      'Carência cumprida (se aplicável)',
    ],
    nextSteps: [
      'Obtenha relatório médico detalhado justificando a necessidade',
      'Registre reclamação na ANS (site ou telefone 0800)',
      'Se urgente, procure advogado imediatamente para liminar',
      'Se não urgente, tente negociação antes da ação judicial',
    ],
    urgency: {
      level: 'high',
      message:
        'ATENÇÃO: Se for emergência médica ou risco à vida, procure advogado AGORA para obter liminar urgente. Não espere!',
    },
  },
  digital: {
    summary:
      'Você foi vítima de golpe, fraude online, roubo de dados ou crime digital. Pode buscar ressarcimento e responsabilização criminal dos envolvidos.',
    questions: [
      'Você já registrou boletim de ocorrência (B.O.)?',
      'Tem prints, mensagens ou provas do golpe?',
      'Houve movimentação bancária não autorizada?',
      'Conhece ou tem dados dos responsáveis?',
      'Tentou contato com banco ou empresa envolvida?',
    ],
    scenarios: [
      {
        label: 'Cenário A',
        probability: 'Mais comum',
        description:
          'Ressarcimento via banco ou empresa (responsabilidade civil). Processo administrativo ou judicial.',
      },
      {
        label: 'Cenário B',
        probability: 'Possível',
        description:
          'Investigação policial e processo criminal contra os golpistas (se identificados).',
      },
      {
        label: 'Cenário C',
        probability: 'Variável',
        description:
          'Ação contra plataforma ou rede social (se houve falha de segurança ou negligência).',
      },
    ],
    timeline: [
      {
        step: 'Boletim de ocorrência',
        description: 'Registro na delegacia ou online',
        duration: '1 dia',
      },
      {
        step: 'Contestação bancária',
        description: 'Solicitar estorno ao banco',
        duration: '30-60 dias',
      },
      {
        step: 'Investigação policial',
        description: 'Identificação dos responsáveis',
        duration: 'Variável',
      },
      {
        step: 'Ação cível (se necessário)',
        description: 'Processo para ressarcimento',
        duration: '12-18 meses',
      },
    ],
    checklist: [
      'Boletim de ocorrência (registre urgente!)',
      'Prints de conversas, sites ou anúncios',
      'Comprovantes de transferências',
      'Extratos bancários',
      'E-mails ou SMS recebidos',
      'Nome e dados dos golpistas (se tiver)',
    ],
    nextSteps: [
      'Registre B.O. IMEDIATAMENTE (pode ser online)',
      'Bloqueie cartões e comunique o banco',
      'Reúna todas as provas digitais (prints, mensagens)',
      'Procure advogado para ação de ressarcimento',
    ],
    urgency: {
      level: 'high',
      message:
        'URGENTE: Registre boletim de ocorrência o quanto antes. Em golpes digitais, tempo é crucial para rastreamento e bloqueio de valores.',
    },
  },
};

export function analyzeCase(userMessage: string): ChatResponse {
  const message = userMessage.toLowerCase();

  if (
    message.includes('demiss') ||
    message.includes('trabalh') ||
    message.includes('rescis') ||
    message.includes('hora extra') ||
    message.includes('fgts') ||
    message.includes('assédio') ||
    message.includes('acidente de trabalho')
  ) {
    return templates.trabalhista;
  }

  if (
    message.includes('pensão') ||
    message.includes('guarda') ||
    message.includes('divórcio') ||
    message.includes('divorcio') ||
    message.includes('família') ||
    message.includes('familia') ||
    message.includes('paternidade') ||
    message.includes('união estável')
  ) {
    return templates.familia;
  }

  if (
    message.includes('plano') ||
    message.includes('saúde') ||
    message.includes('saude') ||
    message.includes('cirurgia') ||
    message.includes('hospital') ||
    message.includes('médico') ||
    message.includes('medico') ||
    message.includes('consulta médica') ||
    message.includes('exame')
  ) {
    return templates.saude;
  }

  if (
    message.includes('contrato') ||
    message.includes('aluguel') ||
    message.includes('dívida') ||
    message.includes('divida') ||
    message.includes('inadimpl') ||
    message.includes('multa')
  ) {
    return templates.civil;
  }

  if (
    message.includes('golpe') ||
    message.includes('fraude') ||
    message.includes('roubo') ||
    message.includes('clone') ||
    message.includes('hack') ||
    message.includes('dados') ||
    message.includes('pix') ||
    message.includes('cartão') ||
    message.includes('cartao')
  ) {
    return templates.digital;
  }

  return templates.consumidor;
}
