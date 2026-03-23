export interface Question {
  id: string;
  text: string;
  type: 'choice' | 'text' | 'yesno';
  options?: string[];
  required: boolean;
}

export interface CategoryQuestions {
  category: string;
  icon: string;
  questions: Question[];
}

export const categoryQuestions: Record<string, CategoryQuestions> = {
  'cobranca': {
    category: 'Cobrança indevida',
    icon: '🛒',
    questions: [
      {
        id: 'tipo_cobranca',
        text: 'Qual tipo de cobrança indevida?',
        type: 'choice',
        options: [
          'Conta de telefone/internet',
          'Cartão de crédito',
          'Banco (tarifa/taxa)',
          'Água/Luz/Gás',
          'Outro serviço'
        ],
        required: true
      },
      {
        id: 'valor',
        text: 'Qual o valor cobrado indevidamente? (aproximadamente)',
        type: 'text',
        required: true
      },
      {
        id: 'negativado',
        text: 'Seu nome está negativado (Serasa/SPC)?',
        type: 'yesno',
        required: true
      },
      {
        id: 'tentou_resolver',
        text: 'Já tentou resolver com a empresa?',
        type: 'yesno',
        required: true
      },
      {
        id: 'detalhes',
        text: 'Conte o que aconteceu (com suas palavras):',
        type: 'text',
        required: true
      }
    ]
  },
  'demissao': {
    category: 'Demissão e verbas',
    icon: '💼',
    questions: [
      {
        id: 'tipo_demissao',
        text: 'Como foi sua demissão?',
        type: 'choice',
        options: [
          'Sem justa causa',
          'Com justa causa',
          'Pedi demissão',
          'Acordo',
          'Ainda não fui demitido'
        ],
        required: true
      },
      {
        id: 'carteira_assinada',
        text: 'Você tinha carteira assinada?',
        type: 'yesno',
        required: true
      },
      {
        id: 'tempo_trabalho',
        text: 'Quanto tempo trabalhou na empresa?',
        type: 'choice',
        options: [
          'Menos de 1 ano',
          '1 a 2 anos',
          '2 a 5 anos',
          'Mais de 5 anos'
        ],
        required: true
      },
      {
        id: 'recebeu_verbas',
        text: 'Recebeu todas as verbas (férias, 13º, aviso prévio, FGTS)?',
        type: 'yesno',
        required: true
      },
      {
        id: 'detalhes',
        text: 'Explique sua situação (com suas palavras):',
        type: 'text',
        required: true
      }
    ]
  },
  'pensao': {
    category: 'Pensão alimentícia',
    icon: '❤️',
    questions: [
      {
        id: 'situacao',
        text: 'Você está:',
        type: 'choice',
        options: [
          'Pagando pensão',
          'Recebendo pensão',
          'Querendo pedir pensão',
          'Querendo mudar o valor'
        ],
        required: true
      },
      {
        id: 'tem_acordo',
        text: 'Já existe decisão judicial ou acordo?',
        type: 'yesno',
        required: true
      },
      {
        id: 'idade_filho',
        text: 'Idade do(s) filho(s):',
        type: 'choice',
        options: [
          'Menor de 12 anos',
          '12 a 18 anos',
          'Maior de 18 anos'
        ],
        required: true
      },
      {
        id: 'guarda',
        text: 'Quem tem a guarda?',
        type: 'choice',
        options: [
          'Eu tenho',
          'Outra pessoa tem',
          'Guarda compartilhada',
          'Sem definição'
        ],
        required: true
      },
      {
        id: 'detalhes',
        text: 'Explique sua situação (com suas palavras):',
        type: 'text',
        required: true
      }
    ]
  },
  'plano_saude': {
    category: 'Plano de saúde',
    icon: '🏥',
    questions: [
      {
        id: 'problema',
        text: 'Qual o problema?',
        type: 'choice',
        options: [
          'Negaram cirurgia',
          'Negaram exame',
          'Negaram consulta/internação',
          'Cancelaram meu plano',
          'Aumento abusivo',
          'Não querem reembolsar'
        ],
        required: true
      },
      {
        id: 'urgente',
        text: 'É urgente? (risco de vida ou saúde)',
        type: 'yesno',
        required: true
      },
      {
        id: 'tem_pedido_medico',
        text: 'Tem pedido médico por escrito?',
        type: 'yesno',
        required: true
      },
      {
        id: 'carencia',
        text: 'Já cumpriu a carência do plano?',
        type: 'yesno',
        required: true
      },
      {
        id: 'detalhes',
        text: 'Explique o que aconteceu (com suas palavras):',
        type: 'text',
        required: true
      }
    ]
  },
  'golpe': {
    category: 'Golpe ou fraude',
    icon: '📱',
    questions: [
      {
        id: 'tipo_golpe',
        text: 'Que tipo de golpe foi?',
        type: 'choice',
        options: [
          'Pix',
          'Cartão clonado',
          'Compra online (não recebi)',
          'Empréstimo que não fiz',
          'WhatsApp/Instagram hackeado',
          'Outro golpe'
        ],
        required: true
      },
      {
        id: 'valor',
        text: 'Quanto você perdeu? (aproximadamente)',
        type: 'text',
        required: true
      },
      {
        id: 'bo',
        text: 'Já registrou Boletim de Ocorrência (B.O.)?',
        type: 'yesno',
        required: true
      },
      {
        id: 'comunicou_banco',
        text: 'Já comunicou o banco/empresa?',
        type: 'yesno',
        required: true
      },
      {
        id: 'detalhes',
        text: 'Conte o que aconteceu (com suas palavras):',
        type: 'text',
        required: true
      }
    ]
  },
  'contrato': {
    category: 'Problema com contrato',
    icon: '📄',
    questions: [
      {
        id: 'tipo_contrato',
        text: 'Que tipo de contrato?',
        type: 'choice',
        options: [
          'Aluguel',
          'Compra e venda',
          'Prestação de serviço',
          'Empréstimo',
          'Consórcio',
          'Outro contrato'
        ],
        required: true
      },
      {
        id: 'problema',
        text: 'Qual o problema?',
        type: 'choice',
        options: [
          'Querem me cobrar multa',
          'Não cumpriram o combinado',
          'Quero cancelar',
          'Me enganaram',
          'Outro problema'
        ],
        required: true
      },
      {
        id: 'tem_contrato_escrito',
        text: 'Tem o contrato por escrito?',
        type: 'yesno',
        required: true
      },
      {
        id: 'detalhes',
        text: 'Explique sua situação (com suas palavras):',
        type: 'text',
        required: true
      }
    ]
  }
};

export function getCategoryKey(text: string): string {
  const map: Record<string, string> = {
    'Cobrança indevida': 'cobranca',
    'Demissão e verbas': 'demissao',
    'Pensão alimentícia': 'pensao',
    'Plano de saúde': 'plano_saude',
    'Golpe ou fraude': 'golpe',
    'Problema com contrato': 'contrato'
  };
  return map[text] || 'contrato';
}

export function buildMessage(category: string, answers: Record<string, string>): string {
  const categoryInfo = categoryQuestions[category];
  let message = `Meu problema é: ${categoryInfo.category}\n\n`;

  categoryInfo.questions.forEach(q => {
    const answer = answers[q.id];
    if (answer) {
      message += `${q.text}\n→ ${answer}\n\n`;
    }
  });

  return message;
}
