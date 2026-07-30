// ==================== DOCUMENTOS ====================

// Built-in templates grouped by category
const docGroups=[
  {
    id:'assembleia',
    label:'Assembleia',
    icon:'🏛️',
    templates:[
      {id:'convocacao',icon:'📢',nome:'Convocação de Assembleia',desc:'Convocação para assembleia geral',
        campos:[
          {id:'tipo',label:'Tipo',tipo:'select',opts:['Extraordinária','Ordinária']},
          {id:'dia-evento',label:'Dia da Assembleia (ex: 07 de agosto de 2025)',tipo:'text'},
          {id:'hora1',label:'1ª Convocação (hora)',tipo:'text',default:'19h30'},
          {id:'hora2',label:'2ª Convocação (hora)',tipo:'text',default:'20h00'},
          {id:'local',label:'Local',tipo:'text',default:'área do pilotis do próprio Edifício'},
          {id:'pauta',label:'Pauta (um item por linha)',tipo:'textarea'},
          {id:'data',label:'Data de emissão',tipo:'date'}
        ],
        template:(f,g)=>{
          const tipo=f.tipo||'Extraordinária';
          const pautaItems=(f.pauta||'').split('\n').filter(p=>p.trim()).map(p=>`- ${p.trim()}`);
          const pautaText=pautaItems.length?pautaItems.join('\n'):'- [descrever pauta]';
          return `${g.nome.toUpperCase()}\n${g.cnpj} - ${g.endereco}\n\nCONVOCAÇÃO DE ASSEMBLÉIA ${tipo.toUpperCase()}\n\nPrezados condôminos,\n\nNa qualidade de Síndica deste Condomínio, sirvo-me da presente para convocar V.Sas. para participarem da Assembleia Geral ${tipo}, a realizar-se no próximo dia ${f['dia-evento']||'[data]'}, na ${f.local||'área do pilotis do próprio Edifício'}, às ${f.hora1||'19h30'} em primeira convocação, contando com a presença de pelo menos metade dos votos totais, ou às ${f.hora2||'20h00'} em segunda convocação, no mesmo dia e local, com qualquer número de presentes, para deliberarem sobre a seguinte ORDEM DO DIA:\n\n${pautaText}\n\nOBSERVAÇÕES:\n\n* É lícito aos senhores condôminos se fazerem representar na Assembleia ora convocada por procuradores, munidos com procurações específicas;\n\n* A ausência dos senhores condôminos não os desobrigam de aceitarem como tácita concordância aos assuntos que forem tratados e deliberados.\n\n* Os condôminos em atraso nos pagamentos de suas taxas condominiais apenas poderão participar como ouvintes e não poderão votar nas deliberações.\n\n${f.data?formatDateBR(f.data):'Recife, ______ de __________ de '+state.year+'.'}\n\nAtenciosamente,\n\n_____________________________________\n${g.sindico||'[Síndico(a)]'}\nSíndica ${g.nome}`;
        }
      },
      {id:'ata-presenca',icon:'📝',nome:'Ata de Presença — Assembleia',desc:'Lista de assinaturas de presença',
        campos:[
          {id:'tipo-ass',label:'Tipo de assembleia',tipo:'text',default:'Extraordinária'},
          {id:'data',label:'Data',tipo:'date'}
        ],
        template:(f,g)=>`ATA DE PRESENÇA DA ASSEMBLEIA GERAL ${(f['tipo-ass']||'EXTRAORDINÁRIA').toUpperCase()}\nDO ${g.nome.toUpperCase()}, CNPJ ${g.cnpj}, localizado à ${g.endereco}, realizada ${f.data?'em '+formatDateBR(f.data):'na data de ___/___/_____'}.\n\n${UNITS.map(u=>`Apto. ${u} ____________________________________________________________`).join('\n\n')}`
      }
    ]
  },
  {
    id:'comunicacoes',
    label:'Comunicações',
    icon:'📣',
    templates:[
      {id:'notificacao',icon:'⚠️',nome:'Notificação de Infração',desc:'Notificação formal ao condômino',fotos:true,
        campos:[
          {id:'num-notif',label:'Nº da Notificação',tipo:'text',default:'001'},
          {id:'apto',label:'Apartamento',tipo:'select-apto'},
          {id:'nome-morador',label:'Nome do(a) morador(a)',tipo:'text'},
          {id:'data-infracao',label:'Data da Infração',tipo:'text'},
          {id:'assunto',label:'Infração (título curto)',tipo:'text'},
          {id:'descricao-infracao',label:'Descrição detalhada da infração',tipo:'textarea'},
          {id:'artigos',label:'Artigos do Regimento (ex: itens 2.27 e 2.28)',tipo:'text'},
          {id:'texto-artigos',label:'Transcrição dos artigos (opcional)',tipo:'textarea'},
          {id:'data',label:'Data do documento',tipo:'date'}
        ],
        template:(f,g)=>{
          const sindico=g.sindico||'[Síndico(a)]';
          const textoArtigos=f['texto-artigos']?`\n${f['texto-artigos']}\n`:'';
          const artigos=f.artigos?`\nConforme determinado nos ${f.artigos} do Regimento Interno:\n${textoArtigos}`:'';
          return `NOTIFICAÇÃO DE INFRAÇÃO REGULAMENTO INTERNO\n\nNº NOTIFICAÇÃO: ${f['num-notif']||'001'}\nINFRAÇÃO: ${f.assunto||'[descrever infração]'}\nDATA DA INFRAÇÃO: ${f['data-infracao']||'[data]'}\n\n${f.data?formatDateBR(f.data):'Recife, ______ de __________ de '+state.year+'.'}\n\nÀ unidade ${f.apto||'[apto]'} do ${g.nome}, ${g.endereco}, CNPJ ${g.cnpj}.\n\nPrezado(a) ${f['nome-morador']||'Condômino(a)'},\n\nNa qualidade de síndica deste Condomínio, e atendendo à determinação do Corpo Diretivo, tem a presente finalidade de adverti-lo(a) por desrespeito às normas do Condomínio.\n${artigos}\n${f['descricao-infracao']||'[Descreva aqui os detalhes da infração, circunstâncias, testemunhos ou evidências disponíveis.]'}\n\nAinda conforme determinado nos itens 3.2, 3.8 e 3.9 do Regimento Interno, em caso de ato de infração, a unidade autônoma deverá ser primeiramente notificada, motivo pelo qual enviamos esta primeira notificação e, em se repetindo o ato pela unidade, ocasionará em uma multa correspondente a 01 (uma) quota condominial vigente, quando da primeira infração.\n\nEsta notificação tem validade de 6 meses e, em havendo descumprimento reiterado desta mesma falta dentro deste período, poderá gerar, contra a unidade residencial faltosa uma segunda notificação e aplicação de multa.\n\nSendo assim, e certos de sua compreensão, solicitamos sua intervenção e orientação aos moradores de seu apartamento, bem como a visitantes e fornecedores, para que esse fato não mais se repita, sob pena de multa por desrespeito aos estatutos do Condomínio.\n\nColoco-me à disposição para quaisquer dúvidas e esclarecimentos.\n\nAtenciosamente,\n\n_____________________________________\n${sindico}\nSíndica ${g.nome}\n\n\nCiente,\n\n_____________________________________\nUnidade ${f.apto||'[apto]'} do ${g.nome}`;
        }
      }
    ]
  },
  {
    id:'protocolos',
    label:'Protocolos',
    icon:'📬',
    templates:[
      {id:'protocolo-boletos',icon:'📬',nome:'Protocolo — Entrega de Boletos',desc:'Lista de protocolo de entrega de boletos',
        campos:[
          {id:'mes',label:'Mês de referência',tipo:'select-mes'},
          {id:'taxa-extra',label:'Incluir taxa extra? (deixar em branco se não)',tipo:'text'},
          {id:'data',label:'Data',tipo:'date'}
        ],
        template:(f,g)=>{
          const rows=UNITS.map(u=>`Apto. ${u} ____________________________________________`);
          const lastIdx=rows.length-1;
          return `${g.nome.toUpperCase()}\nCNPJ ${g.cnpj} — ${g.endereco}\n\nPROTOCOLO DE ENTREGA DE BOLETOS\nTAXA MENSAL${f['taxa-extra']?' + TAXA EXTRA: '+f['taxa-extra']:''} — ${f.mes||MONTHS[new Date().getMonth()].toUpperCase()} ${state.year}\n\n${rows.join('\n\n')}\n\n\n\n\n${f.data?formatDateBR(f.data):'Recife, ______ de __________ de '+state.year+'.'}\n\n_________________________________\n${g.sindico||'[Síndico(a)]'}\nSíndica ${g.nome}`;
        }
      },
      {id:'protocolo-comunicados',icon:'📮',nome:'Protocolo — Entrega de Comunicados',desc:'Lista de protocolo de recebimento',
        campos:[
          {id:'assunto',label:'Assunto do comunicado',tipo:'text'},
          {id:'data',label:'Data',tipo:'date'}
        ],
        template:(f,g)=>{
          const rows=UNITS.map(u=>`Apto. ${u} ____________________________________________`);
          return `${g.nome.toUpperCase()}\nCNPJ ${g.cnpj} — ${g.endereco}\n\nPROTOCOLO DE ENTREGA DE COMUNICADOS\n${f.assunto?'Assunto: '+f.assunto:''}\n\n${rows.join('\n\n')}\n\n\n\n\n${f.data?formatDateBR(f.data):'Recife, ______ de __________ de '+state.year+'.'}`;
        }
      }
    ]
  },
  {
    id:'recibos',
    label:'Recibos',
    icon:'🧾',
    templates:[
      {id:'recibo-servico',icon:'📋',nome:'Recibo — Serviços Fornecedores',desc:'Recibo para prestadores externos',
        campos:[
          {id:'nome-prest',label:'Nome do prestador',tipo:'text'},
          {id:'cpf-prest',label:'CPF',tipo:'text'},
          {id:'valor',label:'Valor (R$)',tipo:'number'},
          {id:'valor-ext',label:'Valor por extenso',tipo:'text'},
          {id:'descricao',label:'Descrição do serviço',tipo:'textarea'},
          {id:'parcela',label:'Parcela (ex: 1/2)',tipo:'text'},
          {id:'data',label:'Data',tipo:'date'}
        ],
        template:(f,g)=>`${g.nome.toUpperCase()}\n\nRECIBO\n\nR$ ${f.valor||'___,__'}\n\nDeclaro que recebi do ${g.nome}, CNPJ ${g.cnpj}, situado à ${g.endereco}, a importância de R$ ${f.valor||'___,__'} (${f['valor-ext']||'__________'}), referente ${f.parcela?'à parcela '+f.parcela+' d':'ao '}${f.descricao||'[descrição do serviço]'}, e pelo que dou total quitação.\n\n${f.data?formatDateBR(f.data):'Recife, ______ de __________ de '+state.year+'.'}\n\n\n___________________________________________________\n${f['nome-prest']||'_____________________'}\nCPF: ${f['cpf-prest']||'___.___.___-__'}`
      },
      {id:'recibo-func-extra',icon:'👷',nome:'Recibo Extra — Funcionário',desc:'Recibo para serviço extra do zelador',
        _selectFunc:true,
        campos:[
          {id:'_func-selector',label:'Funcionário',tipo:'func-selector'},
          {id:'nome-func',label:'Nome do funcionário',tipo:'text',default:'Wellington Gomes da Silva'},
          {id:'cpf-func',label:'CPF',tipo:'text',default:'042.250.384-32'},
          {id:'valor',label:'Valor (R$)',tipo:'number'},
          {id:'valor-ext',label:'Valor por extenso',tipo:'text'},
          {id:'descricao',label:'Descrição do serviço',tipo:'textarea'},
          {id:'data',label:'Data',tipo:'date'}
        ],
        template:(f,g)=>`${g.nome.toUpperCase()}\n\nRECIBO\n\nR$ ${f.valor||'___,__'}\n\nEu, ${f['nome-func']||g.zelador||'Wellington Gomes da Silva'}, recebi do ${g.nome}, CNPJ ${g.cnpj}, situado à ${g.endereco}, a importância de R$ ${f.valor||'___,__'} (${f['valor-ext']||'__________'}), referente ao ${f.descricao||'[descrição do serviço]'}. Confirmo que realizei o serviço fora do meu horário de trabalho como funcionário, e pelo que dou total quitação.\n\n${f.data?formatDateBR(f.data):'Recife, ______ de __________ de '+state.year+'.'}\n\n\n___________________________________\n${f['nome-func']||g.zelador||'Wellington Gomes da Silva'}\nCPF: ${f['cpf-func']||'042.250.384-32'}`
      },
      {id:'recibo-prev-ferias',icon:'📅',nome:'Recibo Previsão Pagamentos Férias',desc:'Detalhamento de pagamentos no período de férias',
        _prevFerias:true,
        campos:[
          {id:'ano-ref',label:'Ano de referência',tipo:'text',default:new Date().getFullYear().toString()}
        ],
        template:(f,g)=>{
          // This template is rendered specially via renderPrevFeriasPreview()
          return document.getElementById('prev-ferias-preview-data')?
            document.getElementById('prev-ferias-preview-data').value : '[Preencha os dados acima]';
        }
      },
      {id:'recibo-trab-temp',icon:'🔄',nome:'Recibo — Trabalho Temporário / Férias',desc:'Recibo de cobertura de férias do zelador',
        _selectFunc:true,
        campos:[
          {id:'_func-selector',label:'Funcionário',tipo:'func-selector'},
          {id:'nome-func',label:'Nome do funcionário',tipo:'text',default:'Wellington Gomes da Silva'},
          {id:'cpf-func',label:'CPF',tipo:'text',default:'042.250.384-32'},
          {id:'valor',label:'Valor (R$)',tipo:'number'},
          {id:'valor-ext',label:'Valor por extenso',tipo:'text'},
          {id:'dias',label:'Quantidade de dias úteis',tipo:'number',default:'8'},
          {id:'freq',label:'Frequência (ex: 2 vezes por semana)',tipo:'text',default:'2 vezes por semana'},
          {id:'mes-ref',label:'Mês de referência (ex: novembro de 2025)',tipo:'text'},
          {id:'valor-dia',label:'Valor/dia (SIECC PE)',tipo:'text',default:'R$ 51,16'},
          {id:'data',label:'Data do recibo',tipo:'date'}
        ],
        template:(f,g)=>`${g.nome.toUpperCase()}\n\nRECIBO\n\nR$ ${f.valor||'___,__'}\n\nRecebi do ${g.nome}, CNPJ ${g.cnpj}, situado a ${g.endereco}, a importância de R$ ${f.valor||'___,__'} (${f['valor-ext']||'__________'}), referente ao serviço temporário de cobertura de férias do zelador do condomínio, tendo trabalhado ${f.dias||'8'} dias úteis, intercalados em ${f.freq||'2 vezes por semana'}, durante o mês de ${f['mes-ref']||'[mês de referência]'}, e pelo qual dou total quitação. O valor foi calculado em cima do que está descrito na convenção coletiva (SIECC PE), que determina o valor/dia em ${f['valor-dia']||'R$ 51,16'}.\n\n${f.data?formatDateBR(f.data):'Recife, ______ de __________ de '+state.year+'.'}\n\n\n__________________________________\n${f['nome-func']||'Wellington Gomes da Silva'}\nCPF: ${f['cpf-func']||'042.250.384-32'}`
      },
      {id:'recibo-vale-alimentacao',icon:'🍽️',nome:'Recibo — Vale Alimentação',desc:'Protocolo de entrega do vale alimentação',
        _selectFunc:true,
        campos:[
          {id:'_func-selector',label:'Funcionário',tipo:'func-selector'},
          {id:'nome-func',label:'Nome do funcionário',tipo:'text',default:'WELLINGTON GOMES DA SILVA'},
          {id:'cpf-func',label:'CPF',tipo:'text',default:'042.250.384-32'},
          {id:'cartao-va',label:'Nº Cartão Pluxee',tipo:'text'},
          {id:'valor',label:'Valor (R$)',tipo:'number',default:'455'},
          {id:'periodo-ini',label:'Período início (ex: 01/05/2026)',tipo:'text'},
          {id:'periodo-fim',label:'Período fim (ex: 31/05/2026)',tipo:'text'},
          {id:'data',label:'Data do recibo',tipo:'date'}
        ],
        template:(f,g)=>`${g.nome.toUpperCase()}\nCNPJ ${g.cnpj} - ${g.endereco}\n\nPROTOCOLO DE ENTREGA DO VALE ALIMENTAÇÃO\n\nNome func.: ${f['nome-func']||'WELLINGTON GOMES DA SILVA'}\nPeríodo: ${f['periodo-ini']||'__/__/____'} A ${f['periodo-fim']||'__/__/____'}\n\nValor: R$ ${f.valor||'455,00'}\n\nPROTOCOLO DE ENTREGA DO VALE ALIMENTAÇÃO CONFORME CONVENÇÃO COLETIVA DE TRABALHO, REFERENTE AO MÊS DO PERÍODO ACIMA MENCIONADO. VALOR PAGO EM CARTÃO ALIMENTAÇÃO PLUXEE Nº ${f['cartao-va']||'[número do cartão]'}.\n\n${f.data?formatDateBR(f.data):'Recife, ______ de __________ de '+state.year+'.'}\n\n\n_____________________________________\n${f['nome-func']||'WELLINGTON GOMES DA SILVA'}\nCPF ${f['cpf-func']||'042.250.384-32'}`
      },
      {id:'recibo-vale-transporte',icon:'🚌',nome:'Recibo — Vale Transporte',desc:'Protocolo de entrega do vale transporte',
        _selectFunc:true,
        campos:[
          {id:'_func-selector',label:'Funcionário',tipo:'func-selector'},
          {id:'nome-func',label:'Nome do funcionário',tipo:'text',default:'WELLINGTON GOMES DA SILVA'},
          {id:'cpf-func',label:'CPF',tipo:'text',default:'042.250.384-32'},
          {id:'cartao-vt',label:'Nº Cartão VEM',tipo:'text'},
          {id:'periodo',label:'Período (ex: mai/26)',tipo:'text'},
          {id:'dias-uteis',label:'Dias úteis no mês',tipo:'number',default:'25'},
          {id:'qtd-vt',label:'Passagens por dia',tipo:'number',default:'2'},
          {id:'valor-unit',label:'Valor unitário (R$)',tipo:'number',default:'4.50'},
          {id:'feriados',label:'Feriados (um por linha)',tipo:'textarea'},
          {id:'data',label:'Data do recibo',tipo:'date'}
        ],
        template:(f,g)=>{
          const feriados=(f.feriados||'').split('\n').filter(x=>x.trim()).map((x,i)=>`${i+1} ${x.trim()}`).join('\n');
          const qtdPorDia=parseInt(f['qtd-vt']||2);const diasUteis=parseInt(f['dias-uteis']||25);const qtdTotal=diasUteis*qtdPorDia;const vtTotal=(parseFloat(f['valor-unit']||4.50)*qtdTotal).toFixed(2);
          return `${g.nome.toUpperCase()}\nCNPJ ${g.cnpj} - ${g.endereco}\n\nPROTOCOLO DE ENTREGA VALE TRANSPORTE\n\nNome func.: ${f['nome-func']||'WELLINGTON GOMES DA SILVA'}\nPeríodo: ${f.periodo||'[mês/ano]'}\n\nPROTOCOLO DE ENTREGA DO VALE TRANSPORTE, REFERENTE AO MÊS DO PERÍODO ACIMA MENCIONADO. VALOR PAGO EM CARTÃO VEM TRABALHADOR Nº ${f['cartao-vt']||'[número do cartão]'}.\n\nTipo | Dias úteis | Qtd/dia VT | Valor unitário | Valor total\nA    | ${f['dias-uteis']||25}         | ${qtdPorDia}          | R$ ${f['valor-unit']||'4,50'}         | R$ ${vtTotal}\n\n${f.data?formatDateBR(f.data):'Recife, ______ de __________ de '+state.year+'.'}\n\n_____________________________________\n${f['nome-func']||'WELLINGTON GOMES DA SILVA'}\nCPF ${f['cpf-func']||'042.250.384-32'}${feriados?'\n\nFERIADOS:\n'+feriados:''}`;
        }
      }
    ]
  },
  {
    id:'outros',
    label:'Outros',
    icon:'📁',
    templates:[
      {id:'nada-consta',icon:'🏠',nome:'Nada Consta / Quitação',desc:'Declaração de quitação de débitos',
        campos:[
          {id:'apto',label:'Apartamento',tipo:'select-apto'},
          {id:'nome-sindico',label:'Nome do(a) Síndico(a)',tipo:'text',default:'Juliana Britto de Azevedo Maia'},
          {id:'data',label:'Data',tipo:'date'}
        ],
        template:(f,g)=>`${g.nome.toUpperCase()}\nCNPJ ${g.cnpj} — ${g.endereco}\n\nDECLARAÇÃO DE QUITAÇÃO DO CONDOMÍNIO\n\nEu, ${f['nome-sindico']||g.sindico||'[Síndico(a)]'}, na qualidade de síndica do ${g.nome}, situado à ${g.endereco}, declaro para os devidos fins que o apto. ${f.apto||'[apto]'} está adimplente com todas as obrigações junto a este condomínio, não havendo qualquer débito inerente à unidade autônoma até a presente data.\n\nPor ser verdade assino a presente.\n\n${f.data?formatDateBR(f.data):'Recife, ______ de __________ de '+state.year+'.'}\n\n\n___________________________________________________\n${f['nome-sindico']||g.sindico||'[Síndico(a)]'}\nSíndica ${g.nome}`
      },
      {id:'capa-balancete',icon:'📊',nome:'Capa Balancete',desc:'Capa para o demonstrativo financeiro mensal',
        _capa:true,
        campos:[
          {id:'mes',label:'Mês de referência',tipo:'select-mes'},
          {id:'ano',label:'Ano',tipo:'text',default:new Date().getFullYear().toString()}
        ],
        template:(f,g)=>{
          const mes=f.mes||MONTHS[new Date().getMonth()].toUpperCase();
          const ano=f.ano||state.year;
          const mesNum=MONTHS.findIndex(m=>m.toUpperCase()===mes.toUpperCase())+1;
          const mm=String(mesNum).padStart(2,'0');
          const diasMes=new Date(ano,mesNum,0).getDate();
          const nomeShort=(g.nome||'').replace(/^Condomínio\s+Edifício\s+/i,'CONDOMÍNIO EDF. ').replace(/^Condomínio\s+/i,'').toUpperCase();
          return `[CAPA]\n${nomeShort}\nCNPJ ${g.cnpj} - ${g.endereco} - CEP ${g.cep||'_____-___'}\n\nDEMONSTRATIVO FINANCEIRO\n\n${mes} ${ano}\n\n(01/${mm}/${ano} a ${diasMes}/${mm}/${ano})`;
        }
      }
    ]
  }
];

// Custom templates stored in state
if(!state.customTemplates) state.customTemplates=[];

function getAllTemplates(){
  // Merge built-ins with customs
  const builtins=docGroups.flatMap(g=>g.templates.map(t=>({...t,_grupo:g.id})));
  const customs=(state.customTemplates||[]).map(t=>({...t,_grupo:t.categoria||'outros',_custom:true,
    template:(f,g)=>{
      let txt=t.textoBase||'';
      txt=txt.replace(/\{nome_cond\}/g,g.nome||'').replace(/\{cnpj\}/g,g.cnpj||'').replace(/\{endereco\}/g,g.endereco||'').replace(/\{sindico\}/g,g.sindico||'');
      (t.campos||[]).forEach(c=>{txt=txt.replace(new RegExp('\\{'+c.id+'\\}','g'),f[c.id]||'');});
      return txt;
    }
  }));
  return [...builtins,...customs];
}

function getTemplateById(id){
  return getAllTemplates().find(t=>t.id===id);
}

function formatDateBR(iso){
  if(!iso)return '';
  try{
    const [y,m,d]=iso.split('-');
    const months=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
    return `Recife, ${parseInt(d)} de ${months[parseInt(m)-1]} de ${y}.`;
  }catch(e){return iso;}
}
// Formata data ISO (aaaa-mm-dd) para dd/mm/aaaa, usado nas descrições automáticas de isenção
function formatDateBRShort(iso){
  if(!iso)return '';
  try{
    const [y,m,d]=iso.split('-');
    return `${d}/${m}/${y}`;
  }catch(e){return iso;}
}

let activeTemplate=null;
let docFotos=[];

function renderDocumentos(){
  const container=document.getElementById('doc-templates-grid');

  // Build grouped view
  const allCustoms=(state.customTemplates||[]);
  const groupsWithCustoms=[...docGroups.map(g=>({
    ...g,
    templates:[...g.templates,...allCustoms.filter(c=>(c.categoria||'outros')===g.id).map(t=>({...t,_custom:true}))]
  }))];

  container.innerHTML=groupsWithCustoms.map(g=>`
    <div style="margin-bottom:24px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <span style="font-size:16px">${g.icon}</span>
        <div style="font-size:11px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.1em">${g.label}</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
        ${g.templates.map(t=>`
          <div class="doc-template" onclick="openDocTemplate('${t.id}')" style="position:relative">
            ${t._custom?`<button onclick="event.stopPropagation();excluirModelo('${t.id}')" style="position:absolute;top:8px;right:8px;background:none;border:none;cursor:pointer;color:var(--text3);font-size:11px" title="Excluir">✕</button>`:''}
            <div class="doc-icon"><span style="font-size:20px">${t.icon||'📄'}</span></div>
            <div><div style="font-size:13px;font-weight:500;margin-bottom:2px">${t.nome}</div><div style="font-size:12px;color:var(--text3)">${t.desc||''}</div></div>
          </div>`).join('')}
      </div>
    </div>`).join('');
}

function openDocTemplate(id){
  const t=getTemplateById(id);
  if(!t)return;
  activeTemplate=t;
  docFotos=[];
  const duasViasChk=document.getElementById('doc-duas-vias');
  if(duasViasChk) duasViasChk.checked=false;
  document.getElementById('doc-editor-title').textContent=t.nome;
  const form=document.getElementById('doc-form-fields');

  // Special form: Previsão de Pagamentos Férias
  if(t._prevFerias){
    form.innerHTML=buildPrevFeriasForm();
    document.getElementById('doc-fotos-block').style.display='none';
    document.getElementById('doc-editor').style.display='block';
    document.getElementById('doc-editor').scrollIntoView({behavior:'smooth'});
    updatePrevFeriasPreview();
    return;
  }

  // Render normal campos with func-selector support
  const funcSelectorHtml=t._selectFunc?buildFuncSelectorHtml():'';
  const camposHtml=(t.campos||[]).filter(c=>c.tipo!=='func-selector').map(c=>{
    if(c.tipo==='select-apto')return`<div class="form-group"><label class="form-label">${c.label}</label><select onchange="updateDocPreview()" data-field="${c.id}"><option value="">Selecionar</option>${UNITS.map(u=>`<option>${u}</option>`).join('')}</select></div>`;
    if(c.tipo==='select-mes')return`<div class="form-group"><label class="form-label">${c.label}</label><select onchange="updateDocPreview()" data-field="${c.id}">${MONTHS.map(m=>`<option>${m.toUpperCase()}</option>`).join('')}</select></div>`;
    if(c.tipo==='select')return`<div class="form-group"><label class="form-label">${c.label}</label><select onchange="updateDocPreview()" data-field="${c.id}">${(c.opts||[]).map(o=>`<option>${o}</option>`).join('')}</select></div>`;
    if(c.tipo==='textarea')return`<div class="form-group" style="grid-column:span 3"><label class="form-label">${c.label}</label><textarea rows="3" oninput="updateDocPreview()" data-field="${c.id}" placeholder="${c.label}">${c.default||''}</textarea></div>`;
    return`<div class="form-group"><label class="form-label">${c.label}</label><input type="${c.tipo}" oninput="updateDocPreview()" data-field="${c.id}" value="${c.default||''}" placeholder="${c.label}"></div>`;
  }).join('');

  form.innerHTML=`${funcSelectorHtml}<div class="form-row-3" style="margin-top:${t._selectFunc?'12px':'16px'}">${camposHtml}</div>`;

  // Auto-fill from first funcionário if available
  if(t._selectFunc && state.funcionarios && state.funcionarios.length>0){
    setTimeout(()=>fillFuncData(0,t.id),50);
  }

  // Show/hide photos block
  document.getElementById('doc-fotos-block').style.display=t.fotos?'block':'none';
  document.getElementById('doc-fotos-list').innerHTML='';

  document.getElementById('doc-editor').style.display='block';
  document.getElementById('doc-editor').scrollIntoView({behavior:'smooth'});
  updateDocPreview();
}

function buildFuncSelectorHtml(){
  const funcs=state.funcionarios||[];
  if(!funcs.length)return'';
  const opts=funcs.map((f,i)=>`<option value="${i}">${f.nome||'Funcionário '+(i+1)}</option>`).join('');
  return`<div style="background:var(--accent-light);border:1px solid #c5d9f5;border-radius:10px;padding:12px 16px;display:flex;align-items:center;gap:12px;margin-top:16px">
    <svg fill="none" stroke="var(--accent2)" stroke-width="1.8" width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/></svg>
    <div style="flex:1">
      <label class="form-label" style="margin-bottom:4px;color:var(--accent)">Preencher dados do funcionário:</label>
      <select id="func-doc-selector" onchange="fillFuncDataFromSelect(this)" style="width:100%">
        ${opts}
      </select>
    </div>
  </div>`;
}

function fillFuncDataFromSelect(sel){
  const idx=parseInt(sel.value);
  fillFuncData(idx, activeTemplate?activeTemplate.id:'');
}

function fillFuncData(idx, templateId){
  const f=state.funcionarios[idx];
  if(!f)return;
  const set=(field,val)=>{
    const el=document.querySelector(`#doc-form-fields [data-field="${field}"]`);
    if(el){el.value=val||'';el.dispatchEvent(new Event('input'));}
  };
  set('nome-func', (f.nome||'').toUpperCase());
  set('cpf-func', f.cpf||'');
  // VA card
  if(f.cartaoVA) set('cartao-va', f.cartaoVA);
  // VT card
  if(f.cartaoVT) set('cartao-vt', f.cartaoVT);
  updateDocPreview();
}

function addFotoSlot(){
  const idx=docFotos.length;
  docFotos.push({src:'',legenda:''});
  const list=document.getElementById('doc-fotos-list');
  const div=document.createElement('div');
  div.id=`foto-slot-${idx}`;
  div.style.cssText='display:grid;grid-template-columns:140px 1fr auto;gap:12px;align-items:center;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:12px';
  div.innerHTML=`
    <div style="text-align:center">
      <img id="foto-preview-${idx}" src="" style="max-width:120px;max-height:80px;border-radius:6px;object-fit:cover;display:none">
      <label style="cursor:pointer;display:block">
        <input type="file" accept="image/*" style="display:none" onchange="loadFoto(${idx},this)">
        <div style="background:var(--accent-light);color:var(--accent);padding:6px 10px;border-radius:6px;font-size:12px;font-weight:500">Escolher imagem</div>
      </label>
    </div>
    <div class="form-group" style="margin:0">
      <label class="form-label">Legenda</label>
      <input type="text" placeholder="Descrição da imagem" oninput="docFotos[${idx}].legenda=this.value" style="width:100%">
    </div>
    <button onclick="removeFotoSlot(${idx})" style="background:none;border:1px solid var(--border2);border-radius:6px;padding:6px 8px;cursor:pointer;color:var(--red);font-size:13px">✕</button>`;
  list.appendChild(div);
}

function removeFotoSlot(idx){
  const el=document.getElementById(`foto-slot-${idx}`);
  if(el)el.remove();
  docFotos[idx]=null;
}

function loadFoto(idx,input){
  const file=input.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=e=>{
    docFotos[idx].src=e.target.result;
    const img=document.getElementById(`foto-preview-${idx}`);
    if(img){img.src=e.target.result;img.style.display='block';}
  };
  reader.readAsDataURL(file);
}

// ==================== PREVISÃO FÉRIAS BUILDER ====================
const ITENS_FERIAS=[
  'Complemento de salário','Vale alimentação (VA)','Férias - salário','1/3 de férias',
  '13º salário - Parcela 01/02','13º salário - Parcela 02/02',
  'Contrato avulso zelador','Vale transporte (VT)','Saldo salário','INSS','FGTS','Outros'
];

let prevFeriasData={ano:new Date().getFullYear().toString(),datas:[],diasAvulso:[],obs:''};

function buildPrevFeriasForm(){
  prevFeriasData={ano:new Date().getFullYear().toString(),datas:[],diasAvulso:[],obs:''};
  return `<div style="margin-top:16px">
    <div class="form-row-3" style="margin-bottom:16px">
      <div class="form-group"><label class="form-label">Ano de referência</label>
        <input type="text" id="pf-ano" value="${new Date().getFullYear()}" oninput="prevFeriasData.ano=this.value;renderPrevFeriasPreview()">
      </div>
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <div style="font-size:12px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:.06em">Datas de Pagamento</div>
      <button class="btn" onclick="addPFData()" style="padding:5px 12px;font-size:12px">+ Adicionar data</button>
    </div>
    <div id="pf-datas-list"></div>
    <div class="sep"></div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <div style="font-size:12px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:.06em">Dias de Trabalho Avulso</div>
      <button class="btn" onclick="addPFDia()" style="padding:5px 12px;font-size:12px">+ Adicionar dia</button>
    </div>
    <div id="pf-dias-list" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px"></div>
    <div class="form-group">
      <label class="form-label">Observações</label>
      <textarea id="pf-obs" rows="3" placeholder="Ex: A partir de dezembro/2025 retornam os pagamentos normais..." oninput="prevFeriasData.obs=this.value;renderPrevFeriasPreview()"></textarea>
    </div>
    <input type="hidden" id="prev-ferias-preview-data" value="">
  </div>`;
}

function addPFData(){
  const idx=prevFeriasData.datas.length;
  prevFeriasData.datas.push({data:'',itens:[]});
  const list=document.getElementById('pf-datas-list');
  const div=document.createElement('div');
  div.id=`pf-data-${idx}`;
  div.style.cssText='background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:14px;margin-bottom:12px';
  div.innerHTML=`<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
      <div class="form-group" style="margin:0;flex:1"><label class="form-label">Data do pagamento</label>
        <input type="date" oninput="prevFeriasData.datas[${idx}].data=this.value;renderPrevFeriasPreview()">
      </div>
      <button onclick="removePFData(${idx})" style="margin-top:18px;background:none;border:1px solid var(--border2);border-radius:6px;padding:5px 8px;cursor:pointer;color:var(--red);font-size:12px">✕ Remover</button>
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
      <div style="font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.06em">Itens desta data</div>
      <button class="btn" onclick="addPFItem(${idx})" style="padding:4px 10px;font-size:11px">+ Item</button>
    </div>
    <div id="pf-itens-${idx}"></div>
    <div style="margin-top:8px;text-align:right;font-size:12px;font-weight:600;color:var(--accent)">Total: R$ <span id="pf-total-${idx}">0,00</span></div>`;
  list.appendChild(div);
}

function removePFData(idx){
  prevFeriasData.datas[idx]=null;
  const el=document.getElementById(`pf-data-${idx}`);
  if(el)el.remove();
  renderPrevFeriasPreview();
}

function addPFItem(dataIdx){
  const itens=prevFeriasData.datas[dataIdx].itens;
  const iIdx=itens.length;
  itens.push({desc:'',ref:'',valor:0});
  const container=document.getElementById(`pf-itens-${dataIdx}`);
  const row=document.createElement('div');
  row.id=`pf-item-${dataIdx}-${iIdx}`;
  row.style.cssText='display:grid;grid-template-columns:2fr 1.2fr 1fr auto;gap:8px;margin-bottom:8px;align-items:end';
  const optsHtml=ITENS_FERIAS.map(o=>`<option value="${o}">${o}</option>`).join('');
  row.innerHTML=`<div class="form-group" style="margin:0"><label class="form-label" style="font-size:10px">Item</label>
      <select onchange="prevFeriasData.datas[${dataIdx}].itens[${iIdx}].desc=this.value;updatePFTotal(${dataIdx});renderPrevFeriasPreview()">
        <option value="">Selecionar...</option>${optsHtml}</select></div>
    <div class="form-group" style="margin:0"><label class="form-label" style="font-size:10px">Referência (mês/ano)</label>
      <input type="text" placeholder="Ex: Novembro/2025" oninput="prevFeriasData.datas[${dataIdx}].itens[${iIdx}].ref=this.value;renderPrevFeriasPreview()"></div>
    <div class="form-group" style="margin:0"><label class="form-label" style="font-size:10px">Valor (R$)</label>
      <input type="number" step="0.01" oninput="prevFeriasData.datas[${dataIdx}].itens[${iIdx}].valor=parseFloat(this.value)||0;updatePFTotal(${dataIdx});renderPrevFeriasPreview()"></div>
    <button onclick="removePFItem(${dataIdx},${iIdx})" style="background:none;border:1px solid var(--border2);border-radius:6px;padding:5px 7px;cursor:pointer;color:var(--red);font-size:11px;margin-bottom:0">✕</button>`;
  container.appendChild(row);
}

function removePFItem(dataIdx,iIdx){
  prevFeriasData.datas[dataIdx].itens[iIdx]=null;
  const el=document.getElementById(`pf-item-${dataIdx}-${iIdx}`);
  if(el)el.remove();
  updatePFTotal(dataIdx);
  renderPrevFeriasPreview();
}

function updatePFTotal(dataIdx){
  const d=prevFeriasData.datas[dataIdx];
  if(!d)return;
  const total=(d.itens||[]).filter(Boolean).reduce((s,i)=>s+(parseFloat(i.valor)||0),0);
  const el=document.getElementById(`pf-total-${dataIdx}`);
  if(el)el.textContent=total.toLocaleString('pt-BR',{minimumFractionDigits:2});
}

function addPFDia(){
  const idx=prevFeriasData.diasAvulso.length;
  prevFeriasData.diasAvulso.push('');
  const list=document.getElementById('pf-dias-list');
  const div=document.createElement('div');
  div.id=`pf-dia-${idx}`;
  div.style.cssText='display:flex;align-items:center;gap:6px;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:6px 10px';
  div.innerHTML=`<input type="date" oninput="prevFeriasData.diasAvulso[${idx}]=this.value;renderPrevFeriasPreview()" style="border:none;background:transparent;font-size:13px;padding:0;width:140px">
    <button onclick="prevFeriasData.diasAvulso[${idx}]=null;this.closest('div').remove();renderPrevFeriasPreview()" style="background:none;border:none;cursor:pointer;color:var(--text3);font-size:12px">✕</button>`;
  list.appendChild(div);
}

function renderPrevFeriasPreview(){
  const g=state.gestao;
  const ano=document.getElementById('pf-ano')?document.getElementById('pf-ano').value:prevFeriasData.ano;
  let txt=`${g.nome||'CONDOMÍNIO'}\nCNPJ ${g.cnpj||''} - ${g.endereco||''}\n\nDetalhamento de pagamento de férias – ${ano}\n\nDetalhamento dos Itens por Data\n`;

  prevFeriasData.datas.filter(Boolean).forEach(d=>{
    if(!d)return;
    const itens=(d.itens||[]).filter(Boolean);
    const total=itens.reduce((s,i)=>s+(parseFloat(i.valor)||0),0);
    const dataFmt=d.data?formatDateSimple(d.data):'[data]';
    txt+=`\n${dataFmt} — Total Pago: R$ ${total.toLocaleString('pt-BR',{minimumFractionDigits:2})}\n\n`;
    const maxDesc=Math.max(30,...itens.map(i=>(i.desc||'').length));
    const maxRef=Math.max(13,...itens.map(i=>(i.ref||'').length));
    txt+=`${'Item'.padEnd(maxDesc+2)}| ${'Referência'.padEnd(maxRef+1)}| Valor\n`;
    txt+=`${'-'.repeat(maxDesc+2)}+-${'-'.repeat(maxRef+1)}+-----------\n`;
    itens.forEach(i=>{
      const v=parseFloat(i.valor||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
      txt+=`${(i.desc||'').padEnd(maxDesc+2)}| ${(i.ref||'').padEnd(maxRef+1)}| R$ ${v}\n`;
    });
  });

  const obs=document.getElementById('pf-obs')?document.getElementById('pf-obs').value:'';
  if(obs.trim()){txt+=`\nObservações:\n${obs.trim().split('\n').map(l=>`- ${l}`).join('\n')}\n`;}

  const dias=(prevFeriasData.diasAvulso||[]).filter(Boolean);
  if(dias.length){
    const nomes=['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
    txt+=`\nDias previstos para trabalho avulso do zelador:\n`;
    dias.forEach(d=>{
      if(d){const dt=new Date(d+'T12:00:00');txt+=`- ${formatDateSimple(d)} (${nomes[dt.getDay()]})\n`;}
    });
  }

  const hidden=document.getElementById('prev-ferias-preview-data');
  if(hidden)hidden.value=txt;
  const preview=document.getElementById('doc-preview');
  if(preview)preview.textContent=txt;
}

function formatDateSimple(iso){
  if(!iso)return'';
  try{const [y,m,d]=iso.split('-');return`${d}/${m}/${y}`;}catch(e){return iso;}
}

function updateDocPreview(){
  if(!activeTemplate)return;
  if(activeTemplate._prevFerias){renderPrevFeriasPreview();return;}
  const fields={};
  document.querySelectorAll('#doc-form-fields [data-field]').forEach(el=>{fields[el.dataset.field]=el.value;});
  document.getElementById('doc-preview').textContent=activeTemplate.template(fields,state.gestao);
}

function closeDocEditor(){
  document.getElementById('doc-editor').style.display='none';
  activeTemplate=null;
  docFotos=[];
}

function generateDocPDF(){
  const g=state.gestao;
  let previewText='';
  if(activeTemplate&&activeTemplate._prevFerias){
    const h=document.getElementById('prev-ferias-preview-data');
    previewText=h?h.value:'';
  } else {
    previewText=document.getElementById('doc-preview').textContent;
  }

  const fotos=docFotos.filter(f=>f&&f.src);
  const fotoHTML=fotos.length?`<hr style="margin:30px 0"><h3 style="font-family:Arial;font-size:13pt">IMAGENS COMPROBATÓRIAS</h3>`+fotos.map(f=>`<div style="margin-bottom:20px;text-align:center"><img src="${f.src}" style="max-width:100%;max-height:350px;object-fit:contain;border:1px solid #ddd;border-radius:4px"><div style="font-size:10pt;color:#555;margin-top:6px;font-family:Arial">${f.legenda||''}</div></div>`).join(''):'';

  // Capa balancete: special centered full-page layout
  const isCapa=activeTemplate&&activeTemplate._capa;
  let bodyContent='';
  if(isCapa){
    const clean=previewText.replace('[CAPA]\n','');
    const lines=clean.split('\n');
    const nome=lines[0]||'';
    const cnpjLine=lines[1]||'';
    const demIdx=lines.findIndex(l=>l.includes('DEMONSTRATIVO'));
    const mesPeriodo=lines.slice(demIdx+1).filter(l=>l.trim());
    bodyContent=`<div style="text-align:center;font-family:Arial;padding-top:100px">
      <div style="font-size:15pt;font-weight:700;letter-spacing:.5px">${nome}</div>
      <div style="font-size:10pt;color:#444;margin-top:6px">${cnpjLine}</div>
      <div style="margin-top:80px;font-size:17pt;font-weight:700;letter-spacing:1px">DEMONSTRATIVO FINANCEIRO</div>
      ${mesPeriodo.map((l,i)=>`<div style="font-size:${i===0?'15':'12'}pt;margin-top:${i===0?'24':'10'}px;font-weight:${i===0?'700':'400'};color:${i>0?'#555':'#000'}">${l}</div>`).join('')}
    </div>`;
  } else {
    // Converte tabela de texto em HTML real para o PDF
    const tabelaRegex = /Tipo \| Dias úteis \| Qtd\/dia VT \| Valor unitário \| Valor total\n(.+)/;
    let pdfText = previewText;
    if(tabelaRegex.test(pdfText)){
      pdfText = pdfText.replace(tabelaRegex, (match, dataRow) => {
        const cols = dataRow.split('|').map(c=>c.trim());
        return `__TABLE__<table style="border-collapse:collapse;width:100%;margin:8px 0;font-family:Arial;font-size:11pt"><thead><tr style="border-bottom:2px solid #333"><th style="text-align:left;padding:6px 10px">Tipo</th><th style="text-align:left;padding:6px 10px">Dias úteis</th><th style="text-align:left;padding:6px 10px">Qtd/dia VT</th><th style="text-align:left;padding:6px 10px">Valor unitário</th><th style="text-align:left;padding:6px 10px">Valor total</th></tr></thead><tbody><tr><td style="padding:6px 10px">${cols[0]||''}</td><td style="padding:6px 10px">${cols[1]||''}</td><td style="padding:6px 10px">${cols[2]||''}</td><td style="padding:6px 10px">${cols[3]||''}</td><td style="padding:6px 10px">${cols[4]||''}</td></tr></tbody></table>__ENDTABLE__`;
      });
      const parts = pdfText.split(/__TABLE__|__ENDTABLE__/);
      // parts[0]=antes, parts[1]=tabela HTML, parts[2]=depois
      bodyContent = `<pre style="white-space:pre-wrap;font-family:Arial;font-size:11pt;line-height:1.8">${parts[0]||''}</pre>`
        + (parts[1]||'')
        + `<pre style="white-space:pre-wrap;font-family:Arial;font-size:11pt;line-height:1.8">${parts[2]||''}</pre>`
        + fotoHTML;
    } else {
      bodyContent=`<pre style="white-space:pre-wrap;font-family:Arial;font-size:11pt;line-height:1.8">${pdfText}</pre>${fotoHTML}`;
    }
  }

  const win=window.open('','_blank');
  const duasVias=document.getElementById('doc-duas-vias')?.checked;
  if(duasVias){
    const corte=`<div style="border-top:2px dashed #999;margin:18px 0;padding-top:6px;text-align:center;font-size:9pt;color:#888;font-family:Arial">✂ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</div>`;
    const viaTag=(n)=>`<div style="text-align:right;font-size:9pt;color:#888;font-family:Arial;margin-bottom:-8px">${n}ª via</div>`;
    bodyContent=`${viaTag(1)}${bodyContent}${corte}${viaTag(2)}${bodyContent}`;
  }
  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{max-width:700px;margin:0 auto;padding:40px;font-size:11pt}@media print{button{display:none}}</style></head><body><button onclick="window.print()" style="margin-bottom:20px;padding:8px 20px;font-size:13px">Imprimir / Salvar PDF</button>${bodyContent}</body></html>`);

  state.docHistorico.unshift({tipo:activeTemplate.nome,data:new Date().toLocaleDateString('pt-BR'),preview:previewText.substring(0,100)+'...'});
  save();
  const hist=document.getElementById('doc-historico');
  hist.innerHTML=state.docHistorico.map(d=>`
    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--border)">
      <div><div style="font-size:13px;font-weight:500">${d.tipo}</div><div style="font-size:12px;color:var(--text3)">${d.data}</div></div>
    </div>`).join('');
}

// ==================== GERADOR DE MODELOS ====================
function openGerador(){
  showModal('modal-gerador');
}

function salvarNovoModelo(){
  const nome=document.getElementById('gen-nome').value.trim();
  if(!nome){document.getElementById('gen-nome').focus();return;}
  const cat=document.getElementById('gen-categoria').value;
  const icone=document.getElementById('gen-icone').value.trim()||'📄';
  const desc=document.getElementById('gen-desc').value.trim();
  const texto=document.getElementById('gen-texto').value;

  // Build campos from checked boxes
  const campos=[];
  const addCampo=(checkId,campo)=>{if(document.getElementById(checkId).checked)campos.push(campo);};
  addCampo('gen-f-apto',{id:'apto',label:'Apartamento',tipo:'select-apto'});
  addCampo('gen-f-data',{id:'data',label:'Data',tipo:'date'});
  addCampo('gen-f-nome-pessoa',{id:'nome-pessoa',label:'Nome da pessoa',tipo:'text'});
  addCampo('gen-f-cpf',{id:'cpf',label:'CPF',tipo:'text'});
  addCampo('gen-f-valor',{id:'valor',label:'Valor (R$)',tipo:'number'});
  addCampo('gen-f-valor-ext',{id:'valor-ext',label:'Valor por extenso',tipo:'text'});
  addCampo('gen-f-mes',{id:'mes',label:'Mês de referência',tipo:'select-mes'});
  addCampo('gen-f-assunto',{id:'assunto',label:'Assunto / Infração',tipo:'text'});
  addCampo('gen-f-descricao',{id:'descricao',label:'Descrição / Observação',tipo:'textarea'});
  addCampo('gen-f-parcela',{id:'parcela',label:'Parcela (ex: 1/2)',tipo:'text'});
  addCampo('gen-f-local',{id:'local',label:'Local',tipo:'text'});
  const temFotos=document.getElementById('gen-f-fotos').checked;

  const id='custom-'+Date.now();
  if(!state.customTemplates)state.customTemplates=[];
  state.customTemplates.push({id,icon:icone,nome,desc,categoria:cat,campos,textoBase:texto,fotos:temFotos});
  save();
  closeModal('modal-gerador');
  renderDocumentos();
  // Reset form
  ['gen-nome','gen-desc','gen-texto'].forEach(i=>{const el=document.getElementById(i);if(el)el.value='';});
  document.getElementById('gen-icone').value='📄';
}

function excluirModelo(id){
  if(!confirm('Excluir este modelo personalizado?'))return;
  state.customTemplates=(state.customTemplates||[]).filter(t=>t.id!==id);
  save();
  renderDocumentos();
}

