// ==================== STATE ====================
const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const UNITS = ['101','102','103','104','201','202','203','204','301','302','303','304'];

let state = {
  year: 2026,
  currentMonth: 3, // Abril é o último fechado
  setupDone: true,
  condominos: [
    {apto:'101',nome:'Apto 101 Edf. Carolina',cpf:'063.420.434-34',email:'',tel:'',taxa:450,status:'Ativo',obs:''},
    {apto:'102',nome:'Apto 102 Edf. Carolina',cpf:'127.289.344-87',email:'',tel:'',taxa:450,status:'Ativo',obs:''},
    {apto:'103',nome:'Apto 103 Edf. Carolina',cpf:'127.448.834-68',email:'',tel:'',taxa:450,status:'Ativo',obs:''},
    {apto:'104',nome:'Apto 104 Edf. Carolina',cpf:'497.667.914-49',email:'',tel:'',taxa:450,status:'Ativo',obs:''},
    {apto:'201',nome:'Apto 201 Edf. Carolina',cpf:'630.530.638-91',email:'',tel:'',taxa:450,status:'Ativo',obs:''},
    {apto:'202',nome:'Apto 202 Edf. Carolina',cpf:'292.959.124-20',email:'',tel:'',taxa:450,status:'Ativo',obs:''},
    {apto:'203',nome:'Apto 203 Edf. Carolina',cpf:'082.272.504-59',email:'',tel:'',taxa:450,status:'Ativo',obs:''},
    {apto:'204',nome:'Apto 204 Edf. Carolina',cpf:'578.070.514-34',email:'',tel:'',taxa:450,status:'Ativo',obs:''},
    {apto:'301',nome:'Apto 301 Edf. Carolina',cpf:'042.770.064-77',email:'',tel:'',taxa:450,status:'Ativo',obs:''},
    {apto:'302',nome:'Apto 302 Edf. Carolina',cpf:'008.873.294-03',email:'',tel:'',taxa:0,  status:'Isento',obs:'Isento conforme aprovação em assembleia de 30/01/2018. Ata registrada.'},
    {apto:'303',nome:'Apto 303 Edf. Carolina',cpf:'109.178.638-01',email:'',tel:'',taxa:450,status:'Ativo',obs:''},
    {apto:'304',nome:'Apto 304 Edf. Carolina',cpf:'129.273.847-20',email:'',tel:'',taxa:450,status:'Ativo',obs:''}
  ],
  funcionarios: [
    {
      nome:'Wellington Gomes da Silva',
      cpf:'042.250.384-32',
      nasc:'',cargo:'Zelador',admissao:'',
      tel:'',email:'',
      cartaoVA:'',opVA:'',
      cartaoVT:'',opVT:'Grande Recife Consórcio',
      rg:'',pis:'',end:'',obs:''
    }
  ],
  fornecedores: [],
  alertas: [
    {id:'ext-1',   nome:'Recarga de Extintores',            data:''},
    {id:'fossa-1', nome:'Esgotamento de Fossa',              data:''},
    {id:'seg-1',   nome:'Renovação do Seguro',               data:''},
    {id:'cert-1',  nome:'Renovação do Certificado Digital',  data:''}
  ],
  gestao:{
    nome:'Condomínio Edifício Carolina',
    cnpj:'09.057.612/0001-95',
    endereco:'Rua Dom José Lopes, nº 744, Boa Viagem, Recife/PE',
    cep:'51021-370',
    cidade:'Recife/PE',
    sindico:'Juliana Britto de Azevedo Maia',
    sindicoApto:'302',
    subsindico:'',
    cons1:'Jeizes Silva de Lira',
    cons2:'Maria da Conceição Santos Oliveira',
    zelador:'Wellington Gomes da Silva',
    assembleiaIsencaoData:'2018-01-30'
  },
  encargos:{
    salario:1639.05, va:455, vt:207, cobSocial:50,
    inssPct:33.015, fgtsPct:8
  },
  vtConfig:{valor:4.50, qtd:2},
  feriados:[
    {data:'2026-01-01',desc:'Confraternização Universal',tipo:'Nacional'},
    {data:'2026-02-16',desc:'Segunda de Carnaval',tipo:'Municipal'},
    {data:'2026-02-17',desc:'Terça de Carnaval',tipo:'Municipal'},
    {data:'2026-02-18',desc:'Quarta de Cinzas (até 14h)',tipo:'Municipal'},
    {data:'2026-04-03',desc:'Paixão de Cristo',tipo:'Nacional'},
    {data:'2026-04-21',desc:'Tiradentes',tipo:'Nacional'},
    {data:'2026-05-01',desc:'Dia do Trabalho',tipo:'Nacional'},
    {data:'2026-06-04',desc:'Corpus Christi',tipo:'Nacional'},
    {data:'2026-06-24',desc:'São João (Pernambuco)',tipo:'Estadual'},
    {data:'2026-09-07',desc:'Independência do Brasil',tipo:'Nacional'},
    {data:'2026-10-12',desc:'Nossa Senhora Aparecida',tipo:'Nacional'},
    {data:'2026-10-27',desc:'Aniversário de Recife',tipo:'Municipal'},
    {data:'2026-11-02',desc:'Finados',tipo:'Nacional'},
    {data:'2026-11-15',desc:'Proclamação da República',tipo:'Nacional'},
    {data:'2026-11-20',desc:'Consciência Negra',tipo:'Nacional'},
    {data:'2026-12-08',desc:'Imaculada Conceição',tipo:'Estadual'},
    {data:'2026-12-25',desc:'Natal',tipo:'Nacional'}
  ],
  balancetes:{
    2026:{
      // JANEIRO
      0:{
        fechado:true, obs:'',
        saldoInicial:256.97,
        receitas:[
          {categoria:'taxa-mensal',unidade:'101',valor:400,   data:'2026-01-01',desc:'Taxa mensal 01/2026'},
          {categoria:'taxa-mensal',unidade:'102',valor:400,   data:'2026-01-01',desc:'Taxa mensal 01/2026'},
          {categoria:'taxa-mensal',unidade:'103',valor:400,   data:'2026-01-01',desc:'Taxa mensal 01/2026'},
          {categoria:'taxa-mensal',unidade:'104',valor:408.4, data:'2026-01-01',desc:'Taxa mensal 01/2026 (inclui correção)'},
          {categoria:'taxa-mensal',unidade:'201',valor:400,   data:'2026-01-01',desc:'Taxa mensal 01/2026'},
          {categoria:'taxa-mensal',unidade:'202',valor:400,   data:'2026-01-01',desc:'Taxa mensal 01/2026'},
          {categoria:'taxa-mensal',unidade:'203',valor:400,   data:'2026-01-01',desc:'Taxa mensal 01/2026'},
          {categoria:'taxa-mensal',unidade:'204',valor:400,   data:'2026-01-01',desc:'Taxa mensal 01/2026'},
          {categoria:'taxa-mensal',unidade:'301',valor:400,   data:'2026-01-01',desc:'Taxa mensal 01/2026'},
          {categoria:'taxa-mensal',unidade:'302',valor:0,     data:'2026-01-01',desc:'Isento conforme assembleia 30/01/2018'},
          {categoria:'taxa-mensal',unidade:'303',valor:400,   data:'2026-01-01',desc:'Taxa mensal 01/2026'},
          {categoria:'taxa-mensal',unidade:'304',valor:400,   data:'2026-01-01',desc:'Taxa mensal 01/2026'},
          {categoria:'taxa-extra', unidade:'101',valor:50,    data:'2026-01-01',desc:'Taxa extra - fossa séptica parc. única',isReserva:false},
          {categoria:'taxa-extra', unidade:'102',valor:51.06, data:'2026-01-01',desc:'Taxa extra - fossa séptica parc. única',isReserva:false},
          {categoria:'taxa-extra', unidade:'103',valor:50,    data:'2026-01-01',desc:'Taxa extra - fossa séptica parc. única',isReserva:false},
          {categoria:'taxa-extra', unidade:'104',valor:51.06, data:'2026-01-01',desc:'Taxa extra - fossa séptica parc. única',isReserva:false},
          {categoria:'taxa-extra', unidade:'202',valor:50,    data:'2026-01-01',desc:'Taxa extra - fossa séptica parc. única',isReserva:false},
          {categoria:'taxa-extra', unidade:'204',valor:50,    data:'2026-01-01',desc:'Taxa extra - fossa séptica parc. única',isReserva:false},
          {categoria:'taxa-extra', unidade:'301',valor:50,    data:'2026-01-01',desc:'Taxa extra - fossa séptica parc. única',isReserva:false},
          {categoria:'taxa-extra', unidade:'303',valor:50,    data:'2026-01-01',desc:'Taxa extra - fossa séptica parc. única',isReserva:false},
          {categoria:'taxa-extra', unidade:'304',valor:50,    data:'2026-01-01',desc:'Taxa extra - fossa séptica parc. única',isReserva:false}
        ],
        despesas:[
          {categoria:'sal-mensal', valor:619.48, data:'2026-01-12',desc:'Salários - 1ª quinzena (01/2026)'},
          {categoria:'sal-mensal', valor:804.46, data:'2026-01-28',desc:'Salários - 2ª quinzena (01/2026)'},
          {categoria:'vale-al',    valor:455,    data:'2026-01-19',desc:'Vale alimentação (02/2026)'},
          {categoria:'vale-al',    valor:30,     data:'2026-01-08',desc:'Vale alimentação - complemento ajuste valor'},
          {categoria:'vale-tr',    valor:204.95, data:'2026-01-27',desc:'Vale transporte (02/2026)'},
          {categoria:'inss',       valor:534.16, data:'2026-01-15',desc:'INSS e PIS (12/2025)'},
          {categoria:'fgts',       valor:215.88, data:'2026-01-15',desc:'FGTS (12/2025)'},
          {categoria:'fgts',       valor:61.39,  data:'2026-01-19',desc:'FGTS (férias ou 13º)'},
          {categoria:'celpe',      valor:156.16, data:'2026-01-09',desc:'CELPE (12/2025) - consumo: 117 KWh'},
          {categoria:'compesa',    valor:741.24, data:'2026-01-14',desc:'COMPESA (12/2025) - consumo: 78 m³'},
          {categoria:'seguro',     valor:220.99, data:'2026-01-20',desc:'Seguro condomínio (parcela 03/10)'},
          {categoria:'adm',        valor:190,    data:'2026-01-14',desc:'Taxa administração (01/2026)'},
          {categoria:'secovi',     valor:55,     data:'2026-01-15',desc:'SECOVI/SIECC/PE (01/2026)'},
          {categoria:'agua',       valor:9,      data:'2026-01-21',desc:'Água (galão)'},
          {categoria:'obras',      valor:101.30, data:'2026-01-07',desc:'Material manutenção fossa - Ferreira Costa (NF 002524329)'},
          {categoria:'obras',      valor:46.99,  data:'2026-01-07',desc:'Reembolso Wellington - materiais manutenção (Ferreira Pinto 12,99 + Armazém 34,00)'}
        ]
      },
      // FEVEREIRO
      1:{
        fechado:true, obs:'',
        saldoInicial:676.49,
        receitas:[
          {categoria:'taxa-mensal',unidade:'101',valor:450,   data:'2026-02-01',desc:'Taxa mensal 02/2026'},
          {categoria:'taxa-mensal',unidade:'102',valor:450,   data:'2026-02-01',desc:'Taxa mensal 02/2026'},
          {categoria:'taxa-mensal',unidade:'103',valor:460.94,data:'2026-02-01',desc:'Taxa mensal 02/2026 (inclui correção)'},
          {categoria:'taxa-mensal',unidade:'104',valor:450,   data:'2026-02-01',desc:'Taxa mensal 02/2026'},
          {categoria:'taxa-mensal',unidade:'201',valor:450,   data:'2026-02-01',desc:'Taxa mensal 02/2026'},
          {categoria:'taxa-mensal',unidade:'202',valor:450,   data:'2026-02-01',desc:'Taxa mensal 02/2026'},
          {categoria:'taxa-mensal',unidade:'203',valor:450,   data:'2026-02-01',desc:'Taxa mensal 02/2026'},
          {categoria:'taxa-mensal',unidade:'204',valor:450,   data:'2026-02-01',desc:'Taxa mensal 02/2026'},
          {categoria:'taxa-mensal',unidade:'301',valor:450,   data:'2026-02-01',desc:'Taxa mensal 02/2026'},
          {categoria:'taxa-mensal',unidade:'302',valor:0,     data:'2026-02-01',desc:'Isento conforme assembleia 30/01/2018'},
          {categoria:'taxa-mensal',unidade:'303',valor:450,   data:'2026-02-01',desc:'Taxa mensal 02/2026'},
          {categoria:'taxa-mensal',unidade:'304',valor:450,   data:'2026-02-01',desc:'Taxa mensal 02/2026'}
        ],
        despesas:[
          {categoria:'sal-mensal', valor:619.48, data:'2026-02-12',desc:'Salários - 1ª quinzena (02/2026)'},
          {categoria:'sal-mensal', valor:806.01, data:'2026-02-25',desc:'Salários - 2ª quinzena (02/2026)'},
          {categoria:'vale-al',    valor:455,    data:'2026-02-23',desc:'Vale alimentação (03/2026)'},
          {categoria:'vale-tr',    valor:222.58, data:'2026-02-23',desc:'Vale transporte (03/2026)'},
          {categoria:'inss',       valor:557.51, data:'2026-02-12',desc:'INSS e PIS (01/2026)'},
          {categoria:'fgts',       valor:221.49, data:'2026-02-16',desc:'FGTS (01/2026)'},
          {categoria:'celpe',      valor:154.88, data:'2026-02-06',desc:'CELPE (01/2026) - consumo: 122 KWh'},
          {categoria:'compesa',    valor:741.24, data:'2026-02-10',desc:'COMPESA (01/2026) - consumo: 90 m³'},
          {categoria:'seguro',     valor:220.99, data:'2026-02-18',desc:'Seguro condomínio (parcela 04/10)'},
          {categoria:'adm',        valor:190,    data:'2026-02-10',desc:'Taxa administração (02/2026)'},
          {categoria:'secovi',     valor:55,     data:'2026-02-13',desc:'SECOVI/SIECC/PE (02/2026)'},
          {categoria:'agua',       valor:9,      data:'2026-02-27',desc:'Água (galão)'},
          {categoria:'obras',      valor:11.97,  data:'2026-02-02',desc:'Lâmpada (TUPAN - NF 119480)'}
        ]
      },
      // MARÇO
      2:{
        fechado:true, obs:'',
        saldoInicial:1372.28,
        receitas:[
          {categoria:'taxa-mensal',unidade:'101',valor:450,   data:'2026-03-01',desc:'Taxa mensal 03/2026'},
          {categoria:'taxa-mensal',unidade:'102',valor:450,   data:'2026-03-01',desc:'Taxa mensal 03/2026'},
          {categoria:'taxa-mensal',unidade:'103',valor:450,   data:'2026-03-01',desc:'Taxa mensal 03/2026'},
          {categoria:'taxa-mensal',unidade:'104',valor:450,   data:'2026-03-01',desc:'Taxa mensal 03/2026'},
          {categoria:'taxa-mensal',unidade:'201',valor:450,   data:'2026-03-01',desc:'Taxa mensal 03/2026'},
          {categoria:'taxa-mensal',unidade:'202',valor:450,   data:'2026-03-01',desc:'Taxa mensal 03/2026'},
          {categoria:'taxa-mensal',unidade:'203',valor:450,   data:'2026-03-01',desc:'Taxa mensal 03/2026'},
          {categoria:'taxa-mensal',unidade:'204',valor:450,   data:'2026-03-01',desc:'Taxa mensal 03/2026'},
          {categoria:'taxa-mensal',unidade:'301',valor:450,   data:'2026-03-01',desc:'Taxa mensal 03/2026'},
          {categoria:'taxa-mensal',unidade:'302',valor:0,     data:'2026-03-01',desc:'Isento conforme assembleia 30/01/2018'},
          {categoria:'taxa-mensal',unidade:'303',valor:450,   data:'2026-03-01',desc:'Taxa mensal 03/2026'},
          {categoria:'taxa-mensal',unidade:'304',valor:450,   data:'2026-03-01',desc:'Taxa mensal 03/2026'},
          {categoria:'taxa-extra', unidade:'101',valor:166,   data:'2026-03-01',desc:'Taxa extra - tratamento e pintura fachada parc. 1/10'},
          {categoria:'taxa-extra', unidade:'102',valor:166,   data:'2026-03-01',desc:'Taxa extra - tratamento e pintura fachada parc. 1/10'},
          {categoria:'taxa-extra', unidade:'103',valor:166,   data:'2026-03-01',desc:'Taxa extra - tratamento e pintura fachada parc. 1/10'},
          {categoria:'taxa-extra', unidade:'104',valor:166,   data:'2026-03-01',desc:'Taxa extra - tratamento e pintura fachada parc. 1/10'},
          {categoria:'taxa-extra', unidade:'201',valor:168.05,data:'2026-03-01',desc:'Taxa extra - tratamento e pintura fachada parc. 1/10'},
          {categoria:'taxa-extra', unidade:'202',valor:166,   data:'2026-03-01',desc:'Taxa extra - tratamento e pintura fachada parc. 1/10'},
          {categoria:'taxa-extra', unidade:'203',valor:166,   data:'2026-03-01',desc:'Taxa extra - tratamento e pintura fachada parc. 1/10'},
          {categoria:'taxa-extra', unidade:'204',valor:166,   data:'2026-03-01',desc:'Taxa extra - tratamento e pintura fachada parc. 1/10'},
          {categoria:'taxa-extra', unidade:'301',valor:166,   data:'2026-03-01',desc:'Taxa extra - tratamento e pintura fachada parc. 1/10'},
          {categoria:'taxa-extra', unidade:'302',valor:166,   data:'2026-03-01',desc:'Taxa extra - tratamento e pintura fachada parc. 1/10'},
          {categoria:'taxa-extra', unidade:'303',valor:166,   data:'2026-03-01',desc:'Taxa extra - tratamento e pintura fachada parc. 1/10'},
          {categoria:'taxa-extra', unidade:'304',valor:166,   data:'2026-03-01',desc:'Taxa extra - tratamento e pintura fachada parc. 1/10'}
        ],
        despesas:[
          {categoria:'sal-mensal', valor:619.48, data:'2026-03-13',desc:'Salários - 1ª quinzena (03/2026)'},
          {categoria:'sal-mensal', valor:806.01, data:'2026-03-27',desc:'Salários - 2ª quinzena (03/2026)'},
          {categoria:'vale-al',    valor:455,    data:'2026-03-25',desc:'Vale alimentação (04/2026)'},
          {categoria:'vale-tr',    valor:223.60, data:'2026-03-25',desc:'Vale transporte (04/2026)'},
          {categoria:'vale-tr',    valor:21.88,  data:'2026-03-10',desc:'VT - complemento ajuste valor janeiro e fevereiro/2026'},
          {categoria:'inss',       valor:562.83, data:'2026-03-25',desc:'INSS e PIS (02/2026)'},
          {categoria:'fgts',       valor:221.49, data:'2026-03-16',desc:'FGTS (02/2026)'},
          {categoria:'celpe',      valor:144.02, data:'2026-03-09',desc:'CELPE (02/2026) - consumo: 113 KWh'},
          {categoria:'compesa',    valor:741.24, data:'2026-03-13',desc:'COMPESA (02/2026) - consumo: 80 m³'},
          {categoria:'seguro',     valor:220.99, data:'2026-03-20',desc:'Seguro condomínio (parcela 05/10)'},
          {categoria:'adm',        valor:190,    data:'2026-03-09',desc:'Taxa administração (03/2026)'},
          {categoria:'secovi',     valor:55,     data:'2026-03-13',desc:'SECOVI/SIECC/PE (03/2026)'}
        ]
      },
      // ABRIL
      3:{
        fechado:true, obs:'',
        saldoInicial:4054.79,
        receitas:[
          {categoria:'taxa-mensal',unidade:'101',valor:450, data:'2026-04-01',desc:'Taxa mensal 04/2026'},
          {categoria:'taxa-mensal',unidade:'102',valor:450, data:'2026-04-01',desc:'Taxa mensal 04/2026'},
          {categoria:'taxa-mensal',unidade:'103',valor:450, data:'2026-04-01',desc:'Taxa mensal 04/2026'},
          {categoria:'taxa-mensal',unidade:'104',valor:450, data:'2026-04-01',desc:'Taxa mensal 04/2026'},
          {categoria:'taxa-mensal',unidade:'201',valor:450, data:'2026-04-01',desc:'Taxa mensal 04/2026'},
          {categoria:'taxa-mensal',unidade:'202',valor:450, data:'2026-04-01',desc:'Taxa mensal 04/2026'},
          {categoria:'taxa-mensal',unidade:'203',valor:450, data:'2026-04-01',desc:'Taxa mensal 04/2026'},
          {categoria:'taxa-mensal',unidade:'204',valor:450, data:'2026-04-01',desc:'Taxa mensal 04/2026'},
          {categoria:'taxa-mensal',unidade:'301',valor:450, data:'2026-04-01',desc:'Taxa mensal 04/2026'},
          {categoria:'taxa-mensal',unidade:'302',valor:0,   data:'2026-04-01',desc:'Isento conforme assembleia 30/01/2018'},
          {categoria:'taxa-mensal',unidade:'303',valor:450, data:'2026-04-01',desc:'Taxa mensal 04/2026'},
          {categoria:'taxa-mensal',unidade:'304',valor:450, data:'2026-04-01',desc:'Taxa mensal 04/2026'},
          {categoria:'taxa-extra', unidade:'101',valor:166, data:'2026-04-01',desc:'Taxa extra - tratamento e pintura fachada parc. 2/10'},
          {categoria:'taxa-extra', unidade:'102',valor:166, data:'2026-04-01',desc:'Taxa extra - tratamento e pintura fachada parc. 2/10'},
          {categoria:'taxa-extra', unidade:'103',valor:166, data:'2026-04-01',desc:'Taxa extra - tratamento e pintura fachada parc. 2/10'},
          {categoria:'taxa-extra', unidade:'104',valor:166, data:'2026-04-01',desc:'Taxa extra - tratamento e pintura fachada parc. 2/10'},
          {categoria:'taxa-extra', unidade:'201',valor:166, data:'2026-04-01',desc:'Taxa extra - tratamento e pintura fachada parc. 2/10'},
          {categoria:'taxa-extra', unidade:'202',valor:166, data:'2026-04-01',desc:'Taxa extra - tratamento e pintura fachada parc. 2/10'},
          {categoria:'taxa-extra', unidade:'203',valor:166, data:'2026-04-01',desc:'Taxa extra - tratamento e pintura fachada parc. 2/10'},
          {categoria:'taxa-extra', unidade:'204',valor:166, data:'2026-04-01',desc:'Taxa extra - tratamento e pintura fachada parc. 2/10'},
          {categoria:'taxa-extra', unidade:'301',valor:166, data:'2026-04-01',desc:'Taxa extra - tratamento e pintura fachada parc. 2/10'},
          {categoria:'taxa-extra', unidade:'302',valor:166, data:'2026-04-01',desc:'Taxa extra - tratamento e pintura fachada parc. 2/10'},
          {categoria:'taxa-extra', unidade:'303',valor:166, data:'2026-04-01',desc:'Taxa extra - tratamento e pintura fachada parc. 2/10'},
          {categoria:'taxa-extra', unidade:'304',valor:166, data:'2026-04-01',desc:'Taxa extra - tratamento e pintura fachada parc. 2/10'}
        ],
        despesas:[
          {categoria:'sal-mensal', valor:619.48, data:'2026-04-13',desc:'Salários - 1ª quinzena (04/2026)'},
          {categoria:'sal-mensal', valor:806.01, data:'2026-04-27',desc:'Salários - 2ª quinzena (04/2026)'},
          {categoria:'vale-al',    valor:455,    data:'2026-04-27',desc:'Vale alimentação (04/2026)'},
          {categoria:'vale-tr',    valor:232.83, data:'2026-04-27',desc:'Vale transporte (05/2026)'},
          {categoria:'inss',       valor:221.49, data:'2026-04-15',desc:'INSS e PIS (03/2026)'},
          {categoria:'fgts',       valor:557.51, data:'2026-04-17',desc:'FGTS (03/2026)'},
          {categoria:'celpe',      valor:139.95, data:'2026-04-08',desc:'CELPE (03/2026) - consumo: 102 KWh'},
          {categoria:'compesa',    valor:741.24, data:'2026-04-13',desc:'COMPESA (03/2026) - consumo: 89 m³'},
          {categoria:'seguro',     valor:220.99, data:'2026-04-17',desc:'Seguro condomínio (parcela 06/10)'},
          {categoria:'adm',        valor:190,    data:'2026-04-09',desc:'Taxa administração (04/2026)'},
          {categoria:'secovi',     valor:55,     data:'2026-04-15',desc:'SECOVI/SIECC/PE (04/2026)'},
          {categoria:'agua',       valor:10,     data:'2026-04-10',desc:'Água (galão)'},
          {categoria:'outros',     valor:268,    data:'2026-04-15',desc:'Uniformes Wellington - Casa do Condomínio'},
          {categoria:'obras',      valor:550,    data:'2026-04-10',desc:'Josinaldo José dos Santos - obras manutenção telhado (1/2)'},
          {categoria:'obras',      valor:169.04, data:'2026-04-11',desc:'Material reparos vazamento telhado - Tupan Construções'},
          {categoria:'obras',      valor:100,    data:'2026-04-30',desc:'Wellington Gomes da Silva - serviço reparos vazamento telhado'}
        ]
      }
    }
  },
  taxasExtras:[
    {desc:'Esgotamento fossa séptica',valorUnit:50,parcelas:1,inicio:'2026-01',arrecadado:452.12,usado:0},
    {desc:'Tratamento e pintura da fachada',valorUnit:166,parcelas:10,inicio:'2026-03',arrecadado:3986.05,usado:0}
  ],
  docHistorico:[]
};

// ==================== AUTENTICAÇÃO ====================
const LOGIN_SESSION_KEY = 'cond_auth_v1';

// Apenas o identificador da conta (não é segredo, é só o "usuário" mostrado
// na tela de login). A senha em si é validada no Apps Script, não aqui.
const USUARIO_APP = 'condominiocarolinarecife@gmail.com';

function estaLogado() {
  try {
    const s = sessionStorage.getItem(LOGIN_SESSION_KEY);
    return s === 'ok';
  } catch(e) { return false; }
}

function marcarLogado() {
  try { sessionStorage.setItem(LOGIN_SESSION_KEY, 'ok'); } catch(e) {}
}

async function fazerLogin() {
  const usuario   = document.getElementById('login-usuario').value.trim();
  const senha     = document.getElementById('login-senha').value;
  const erro      = document.getElementById('login-erro');
  const btnLogin  = document.getElementById('btn-login');

  if (!usuario || !senha) {
    erro.textContent = 'Preencha usuário e senha.';
    erro.style.display = 'block';
    return;
  }

  erro.style.display = 'none';
  if (btnLogin) { btnLogin.disabled = true; btnLogin.textContent = 'Verificando…'; }

  try {
    const url = SHEETS_URL + '?key=' + SHEETS_KEY + '&action=login'
      + '&usuario=' + encodeURIComponent(usuario)
      + '&senha=' + encodeURIComponent(senha);
    const resp = await fetchComRetry(url, {});
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const json = await resp.json();
    if (!json.ok) throw new Error(json.erro || 'Resposta inválida do servidor');

    if (json.autorizado) {
      marcarLogado();
      document.getElementById('tela-login').style.display = 'none';
      document.getElementById('main').style.display = '';
      document.querySelector('nav').style.display = '';
    } else {
      erro.textContent = 'Usuário ou senha incorretos.';
      erro.style.display = 'block';
      document.getElementById('login-senha').value = '';
      document.getElementById('login-senha').focus();
    }
  } catch(e) {
    erro.textContent = 'Não foi possível verificar o login agora. Confira sua conexão e tente novamente.';
    erro.style.display = 'block';
    console.warn('[Login] Erro:', e.message);
  } finally {
    if (btnLogin) { btnLogin.disabled = false; btnLogin.textContent = 'Entrar'; }
  }
}

function mostrarTrocaSenha() {
  // Abre modal de trocar senha direto da tela de login
  // (antes de estar logado — valida a senha atual)
  showModal('modal-trocar-senha');
}

async function salvarNovaSenha() {
  // Funciona tanto do modal standalone quanto da aba Configurações
  const isConfig = document.getElementById('cs-atual') &&
                   document.getElementById('cs-atual').offsetParent !== null;

  const idAtual    = isConfig ? 'cs-atual'    : 'ts-atual';
  const idNova     = isConfig ? 'cs-nova'     : 'ts-nova';
  const idConfirma = isConfig ? 'cs-confirma' : 'ts-confirma';
  const idErro     = isConfig ? 'conf-senha-erro' : 'trocar-senha-erro';
  const idOk       = isConfig ? 'conf-senha-ok'   : null;

  const atual    = document.getElementById(idAtual).value;
  const nova     = document.getElementById(idNova).value;
  const confirma = document.getElementById(idConfirma).value;
  const erroEl   = document.getElementById(idErro);

  const mostrarErro = (msg) => {
    erroEl.textContent = msg;
    erroEl.style.display = 'block';
  };

  erroEl.style.display = 'none';

  if (nova.length < 6) {
    mostrarErro('A nova senha deve ter pelo menos 6 caracteres.');
    return;
  }
  if (nova !== confirma) {
    mostrarErro('As senhas não coincidem.');
    return;
  }

  try {
    const url = SHEETS_URL + '?key=' + SHEETS_KEY + '&action=trocarSenha'
      + '&usuario=' + encodeURIComponent(USUARIO_APP)
      + '&senhaAtual=' + encodeURIComponent(atual)
      + '&novaSenha=' + encodeURIComponent(nova);
    const resp = await fetchComRetry(url, {});
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const json = await resp.json();
    if (!json.ok) throw new Error(json.erro || 'Resposta inválida do servidor');
    if (!json.autorizado) {
      mostrarErro(json.erro || 'Senha atual incorreta.');
      return;
    }
  } catch(e) {
    mostrarErro('Não foi possível trocar a senha agora. Confira sua conexão e tente novamente.');
    console.warn('[TrocarSenha] Erro:', e.message);
    return;
  }

  // Limpa campos
  [idAtual, idNova, idConfirma].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  if (isConfig && idOk) {
    const okEl = document.getElementById(idOk);
    okEl.textContent = '✅ Senha alterada com sucesso!';
    okEl.style.display = 'block';
    setTimeout(() => { okEl.style.display = 'none'; }, 3000);
  } else {
    closeModal('modal-trocar-senha');
    alert('✅ Senha alterada com sucesso!');
  }
}

function toggleSenhaVisivel(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
  btn.style.opacity = input.type === 'text' ? '1' : '0.5';
}

function sair() {
  try { sessionStorage.removeItem(LOGIN_SESSION_KEY); } catch(e) {}
  location.reload();
}


// Os dados são salvos na nuvem via Google Apps Script.
// O localStorage funciona como cache local e fallback offline.

const STORAGE_KEY   = 'cond_state_v2';
const BACKUP_VERSION = '2.0';
// URL/chave do Apps Script já existente (planilha "Banco de Dados edf
// carolina") — atualizada em 30/07/2026 após nova implantação.
const SHEETS_URL    = 'https://script.google.com/macros/s/AKfycbzvWAXINvD7ChlGiRAHO2B_mOeeEAlVw6DYalwpK_idYqmfMfGphH_wHgrLsppdF5KlQA/exec';
const SHEETS_KEY    = 'carolina2025';

let _saveTimer     = null;   // debounce do save na nuvem
let _sincronizando = false;  // evita chamadas paralelas
let _dadosNuvem    = false;  // true quando já carregou da nuvem

// ── Indicador de status ─────────────────────────────────────
function setSyncStatus(msg, tipo) {
  // tipo: 'loading' | 'ok' | 'error' | 'offline'
  let el = document.getElementById('sync-status');
  if (!el) return;
  el.textContent = msg;
  el.className = 'sync-badge sync-' + tipo;
  if (tipo === 'ok' || tipo === 'offline') {
    setTimeout(() => { if (el.textContent === msg) el.textContent = ''; }, 4000);
  }
}

// ── Leitura da nuvem ────────────────────────────────────────
// ── Codificação dos dados para envio ───────────────────────
function estadoParaComprimido(obj) {
  const json = JSON.stringify(obj);
  return btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '.');
}

function comprimidoParaEstado(str) {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/').replace(/\./g, '=');
  return JSON.parse(decodeURIComponent(escape(atob(b64))));
}

// Tenta um fetch várias vezes com backoff exponencial (300ms, 600ms, 1200ms…)
// antes de desistir. Como o salvamento usa mode:'no-cors', erros HTTP do
// próprio Apps Script não chegam aqui — isso só pega falhas de rede/DNS/timeout.
async function fetchComRetry(url, opcoes, tentativas = 3) {
  let ultimoErro;
  for (let i = 0; i < tentativas; i++) {
    try {
      return await fetch(url, opcoes);
    } catch (e) {
      ultimoErro = e;
      if (i < tentativas - 1) {
        await new Promise(r => setTimeout(r, 300 * Math.pow(2, i)));
      }
    }
  }
  throw ultimoErro;
}

async function salvarNaNuvem(silencioso) {
  if (_sincronizando) return;
  _sincronizando = true;
  if (!silencioso) setSyncStatus('Salvando…', 'loading');
  try {
    state._salvoEm = new Date().toISOString();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) {}

    const dados = estadoParaComprimido(state);
    const CHUNK = 1400;
    const total = Math.ceil(dados.length / CHUNK);

    for (let i = 0; i < total; i++) {
      const parte = encodeURIComponent(dados.slice(i * CHUNK, (i + 1) * CHUNK));
      const url = SHEETS_URL + '?key=' + SHEETS_KEY + '&action=salvar&dados=' + parte + '&total=' + total + '&parte=' + i;
      // Se uma parte falhar mesmo após as tentativas, interrompe o envio das
      // partes seguintes: melhor reportar "salvo localmente" do que dizer que
      // deu certo com o dado incompleto na nuvem.
      await fetchComRetry(url, { mode: 'no-cors' });
    }

    if (!silencioso) setSyncStatus('Salvo ✓', 'ok');
  } catch(e) {
    console.warn('[Sheets] Erro ao salvar:', e.message);
    setSyncStatus('Salvo localmente', 'offline');
  } finally {
    _sincronizando = false;
  }
}

async function carregarDaNuvem() {
  try {
    setSyncStatus('Carregando…', 'loading');
    const url = SHEETS_URL + '?key=' + SHEETS_KEY + '&action=ler';
    const resp = await fetchComRetry(url, {});
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    const json = await resp.json();
    if (!json.ok) throw new Error(json.erro || 'Resposta inválida');

    if (json.dados && json.dados.trim()) {
      const remoto = comprimidoParaEstado(json.dados);
      const tsLocal  = state._salvoEm  ? new Date(state._salvoEm).getTime() : 0;
      const tsRemoto = remoto._salvoEm ? new Date(remoto._salvoEm).getTime() : 0;

      if (tsRemoto > tsLocal) {
        state = Object.assign(state, remoto);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) {}
        setSyncStatus('Sincronizado ✓', 'ok');
        return true;
      }
    } else {
      await salvarNaNuvem(true);
    }
    setSyncStatus('Sincronizado ✓', 'ok');
    return false;
  } catch(e) {
    console.warn('[Sheets] Erro ao carregar:', e.message);
    setSyncStatus('Offline — dados locais', 'offline');
    return false;
  }
}

// ── save() — chamada em toda alteração ─────────────────────
function save() {
  // 1. Salva local imediatamente (nunca perde)
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch(e) {
    console.error('localStorage cheio:', e);
  }
  // 2. Envia para nuvem com debounce de 1.5s
  clearTimeout(_saveTimer);
  _saveTimer = setTimeout(() => salvarNaNuvem(false), 1500);
}

// ── Inicialização ───────────────────────────────────────────
async function iniciarApp() {
  // 1. Carrega do localStorage imediatamente
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) state = Object.assign(state, JSON.parse(s));
  } catch(e) {}
  limparBackupsAntigos(); // garante que backups antigos de sessões anteriores não acumulem

  // 2. Verifica se está logado
  if (!estaLogado()) {
    document.getElementById('tela-login').style.display = 'flex';
    document.getElementById('main').style.display = 'none';
    document.querySelector('nav').style.display = 'none';
    // Ainda busca dados da nuvem em background para ter dados frescos ao logar
    carregarDaNuvem().then(() => {});
    return;
  }

  // 3. Está logado — mostra o app
  document.getElementById('tela-login').style.display = 'none';
  document.getElementById('main').style.display = '';
  document.querySelector('nav').style.display = '';

  // 4. Renderiza com dados locais
  renderDashboard();
  calcSimulador();
  updateCondNome();
  atualizarInfoBackup();
  if (!state.setupDone) {
    document.getElementById('modal-onboarding').classList.add('open');
  }

  // 5. Busca versão da nuvem em background
  const atualizado = await carregarDaNuvem();

  // 6. Se havia dados mais recentes na nuvem, re-renderiza
  if (atualizado) {
    renderDashboard();
    updateCondNome();
    atualizarInfoBackup();
    const panel = document.querySelector('.panel.active');
    const id = panel ? panel.id.replace('panel-', '') : 'dashboard';
    const renders = {
      dashboard:renderDashboard, balancete:renderBalancete, orcamento:renderOrcamento,
      simulador:calcSimulador, reserva:renderReserva, encargos:calcEncargos,
      vt:renderVT, calendario:renderCalendario, condominios:renderCondominios,
      funcionarios:renderFuncionarios, fornecedores:renderFornecedores,
      gestao:renderGestao, documentos:renderDocumentos
    };
    if (renders[id]) renders[id]();
  }
}

// ==================== BACKUP E RESTAURAÇÃO ====================

function gerarBackup() {
  try {
    const backup = {
      _versao:     BACKUP_VERSION,
      _chave:      STORAGE_KEY,
      _geradoEm:   new Date().toISOString(),
      _geradoPor:  state.gestao?.sindico || 'Síndico(a)',
      _condominio: state.gestao?.nome    || 'Condomínio',
      dados:       state
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    const data = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
    a.href     = url;
    a.download = `backup_carolina_${data}.json`;
    a.click();
    URL.revokeObjectURL(url);
    state._ultimoBackup = new Date().toISOString();
    save();
    atualizarInfoBackup();
  } catch(e) { alert('Erro ao gerar backup: ' + e.message); }
}

function restaurarBackup() {
  const input    = document.createElement('input');
  input.type     = 'file';
  input.accept   = '.json';
  input.onchange = e => {
    const file   = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const backup = JSON.parse(ev.target.result);
        if (!backup._versao || !backup.dados)
          return alert('❌ Arquivo inválido. Este não é um backup do Condomínio Carolina.');
        if (backup._chave && backup._chave !== STORAGE_KEY)
          return alert('❌ Este backup pertence a outro sistema.');

        const geradoEm  = backup._geradoEm  ? new Date(backup._geradoEm).toLocaleString('pt-BR') : 'data desconhecida';
        const geradoPor = backup._geradoPor || 'desconhecido';

        if (!confirm(
          `Restaurar backup?\n\n` +
          `Condomínio: ${backup._condominio || ''}\n` +
          `Gerado em: ${geradoEm}\n` +
          `Por: ${geradoPor}\n\n` +
          `⚠️ Todos os dados atuais serão substituídos.\n\nDeseja continuar?`
        )) return;

        // Guarda cópia dos dados atuais antes
        try { localStorage.setItem(STORAGE_KEY + '_pre_restore_' + Date.now(), JSON.stringify(state)); } catch(e) {}
        limparBackupsAntigos();

        state = Object.assign(state, backup.dados);
        save(); // salva local + nuvem
        alert('✅ Backup restaurado! A página será recarregada.');
        location.reload();
      } catch(e) { alert('❌ Erro ao ler o arquivo: ' + e.message); }
    };
    reader.readAsText(file);
  };
  input.click();
}

// Mantém apenas os N backups automáticos (_pre_restore_) mais recentes no
// localStorage, evitando que a cota do navegador (5-10MB) estoure com o tempo.
const MAX_BACKUPS_PRE_RESTORE = 5;
function limparBackupsAntigos() {
  try {
    const prefixo = STORAGE_KEY + '_pre_restore_';
    const chaves = Object.keys(localStorage)
      .filter(k => k.startsWith(prefixo))
      .sort((a, b) => Number(b.slice(prefixo.length)) - Number(a.slice(prefixo.length))); // mais novo primeiro

    chaves.slice(MAX_BACKUPS_PRE_RESTORE).forEach(k => {
      try { localStorage.removeItem(k); } catch(e) {}
    });
  } catch(e) { console.warn('Erro ao limpar backups antigos:', e.message); }
}

function atualizarInfoBackup() {
  const el = document.getElementById('ultimo-backup-info');
  if (!el) return;
  if (state._ultimoBackup) {
    el.textContent = 'Último backup: ' + new Date(state._ultimoBackup).toLocaleString('pt-BR');
    el.style.color = 'var(--green)';
  } else {
    el.textContent = 'Nenhum backup gerado ainda.';
    el.style.color = 'var(--amber)';
  }
}






