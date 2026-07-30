// ==================== CALENDÁRIO ====================
function renderCalendario(){
  const tbody=document.getElementById('feriados-tbody');
  tbody.innerHTML=state.feriados.sort((a,b)=>a.data.localeCompare(b.data)).map((f,i)=>`
    <tr>
      <td>${f.data.split('-').reverse().join('/')}</td>
      <td>${f.desc}</td>
      <td><span class="badge ${f.tipo==='Nacional'?'blue':f.tipo==='Estadual'?'green':'amber'}">${f.tipo}</span></td>
      <td><button class="btn" style="padding:3px 8px;font-size:11px;color:var(--red)" onclick="removeFeriado(${i})">✕</button></td>
    </tr>`).join('');
  
  const tbody2=document.getElementById('diasuteis-tbody');
  tbody2.innerHTML=MONTHS.map((mes,i)=>{
    const total=getDaysInMonth(state.year,i);
    const wknd=getWeekend(state.year,i);
    const fer=getFeriadosMes(state.year,i);
    const uteis=total-wknd-fer;
    return`<tr><td>${mes}</td><td class="tnum" style="text-align:right">${total}</td><td class="tnum" style="text-align:right">${wknd}</td><td class="tnum" style="text-align:right;color:var(--red)">${fer}</td><td class="tnum" style="text-align:right;font-weight:600;color:var(--green)">${uteis}</td></tr>`;
  }).join('');
}

function saveFeriado(){
  state.feriados.push({data:document.getElementById('fer-data').value,desc:document.getElementById('fer-desc').value,tipo:document.getElementById('fer-tipo').value});
  save();closeModal('modal-add-feriado');renderCalendario();
}

function removeFeriado(i){
  state.feriados.splice(i,1);save();renderCalendario();
}

// ==================== CONDÔMINOS ====================
function renderCondominios(){
  const tbody=document.getElementById('condominios-tbody');
  tbody.innerHTML=state.condominos.map((c,i)=>`
    <tr>
      <td><strong>${c.apto}</strong></td>
      <td>${c.nome}</td>
      <td style="font-family:var(--mono);font-size:12px">${c.cpf}</td>
      <td>${c.email||'—'}</td>
      <td>${c.tel||'—'}</td>
      <td class="tnum">${brl(c.taxa)}</td>
      <td><span class="badge ${c.status==='Ativo'?'green':c.status==='Isento'?'amber':'red'}">${c.status}</span></td>
      <td>
        <button class="btn" style="padding:3px 8px;font-size:11px" onclick="editCondomino(${i})">Editar</button>
        <button class="btn" style="padding:3px 8px;font-size:11px" onclick="gerarNadaConsta(${i})">Nada Consta</button>
      </td>
    </tr>`).join('');
}

function saveCondomino(editIdx){
  const dados={
    apto:document.getElementById('cond-apto').value,
    nome:document.getElementById('cond-nome').value,
    cpf:document.getElementById('cond-cpf').value,
    morador:(document.getElementById('cond-morador')||{}).value||'',
    email:document.getElementById('cond-email').value,
    tel:document.getElementById('cond-tel').value,
    taxa:parseFloat(document.getElementById('cond-taxa').value)||0,
    status:document.getElementById('cond-status').value,
    obs:document.getElementById('cond-obs').value
  };
  if(editIdx!==undefined && editIdx>=0){
    state.condominos[editIdx]=dados;
  } else {
    state.condominos.push(dados);
  }
  save();
  // Reset modal back to add mode
  document.querySelector('#modal-add-condominios .modal-title').textContent='Cadastrar Condômino';
  const btn=document.querySelector('#modal-add-condominios .modal-footer .btn.primary');
  btn.textContent='Cadastrar';
  btn.onclick=()=>saveCondomino();
  closeModal('modal-add-condominios');
  renderCondominios();
}

function editCondomino(i){
  const c=state.condominos[i];
  // Reuse the cadastro modal in edit mode
  document.querySelector('#modal-add-condominios .modal-title').textContent='Editar Condômino';
  document.querySelector('#modal-add-condominios .modal-footer .btn.primary').textContent='Salvar Alterações';
  document.querySelector('#modal-add-condominios .modal-footer .btn.primary').onclick=()=>saveCondomino(i);
  // Fill fields
  document.getElementById('cond-apto').value=c.apto||'';
  document.getElementById('cond-cpf').value=c.cpf||'';
  document.getElementById('cond-nome').value=c.nome||'';
  const mor=document.getElementById('cond-morador');if(mor)mor.value=c.morador||'';
  document.getElementById('cond-email').value=c.email||'';
  document.getElementById('cond-tel').value=c.tel||'';
  document.getElementById('cond-taxa').value=c.taxa||'';
  document.getElementById('cond-status').value=c.status||'Ativo';
  document.getElementById('cond-obs').value=c.obs||'';
  showModal('modal-add-condominios');
}

function gerarNadaConsta(i){
  const c=state.condominos[i];
  const g=state.gestao;
  const hoje=new Date();
  const meses=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  const win=window.open('','_blank');
  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:Arial;max-width:700px;margin:0 auto;padding:40px;font-size:11pt}h1{text-align:center;font-size:12pt}p{line-height:1.8;margin-bottom:12px}.sig{margin-top:60px;text-align:center;border-top:1pt solid #000;padding-top:8px;font-size:10pt}@media print{button{display:none}}</style></head><body>
  <button onclick="window.print()">Imprimir / PDF</button>
  <h1>${g.nome.toUpperCase()}</h1>
  <p style="text-align:center">CNPJ ${g.cnpj} — ${g.endereco}</p>
  <h2 style="text-align:center;margin-top:24px">DECLARAÇÃO DE QUITAÇÃO DO CONDOMÍNIO</h2>
  <p style="margin-top:24px">Eu, ${g.sindico}, na qualidade de síndica do ${g.nome}, situado à ${g.endereco}, declaro para os devidos fins que o apto. ${c.apto} está adimplente com todas as obrigações junto a este condomínio, não havendo, portanto, qualquer débito inerente à unidade autônoma que possa ser objeto de ação, de qualquer natureza, no presente ou futuro, dando ao mesmo plena e geral quitação de suas obrigações até a presente data.</p>
  <p>Por ser verdade assino a presente.</p>
  <p>Recife, ${hoje.getDate()} de ${meses[hoje.getMonth()]} de ${hoje.getFullYear()}.</p>
  <div class="sig">${g.sindico}<br>Síndica ${g.nome}</div>
  </body></html>`);
}

// ==================== FORNECEDORES ====================
function renderFornecedores(){
  const lista=document.getElementById('forn-lista');
  if(!lista)return;
  if(!state.fornecedores.length){
    lista.innerHTML=`<div class="card"><div class="empty"><svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg><p>Nenhum fornecedor cadastrado.</p></div></div>`;
    return;
  }
  // Group by service category
  lista.innerHTML=`<div class="card">
    <table>
      <thead>
        <tr>
          <th>Nome / Empresa</th>
          <th>Serviço / Função</th>
          <th>Telefone</th>
          <th>CPF / CNPJ</th>
          <th>PIX</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${state.fornecedores.map((f,i)=>`
        <tr>
          <td>
            <div style="font-weight:500">${f.nome}</div>
            ${f.email?`<div style="font-size:12px;color:var(--text3)">${f.email}</div>`:''}
          </td>
          <td><span class="badge blue">${f.servico||'—'}</span></td>
          <td>
            ${f.tel?`<a href="tel:${f.tel}" style="color:var(--accent2);text-decoration:none;font-size:13px">${f.tel}</a>`:'—'}
          </td>
          <td style="font-family:var(--mono);font-size:12px">${f.doc||'—'}</td>
          <td>
            ${f.pix?`<div style="font-size:12px">
              <div style="font-family:var(--mono)">${f.pix}</div>
              ${f.pixTipo?`<div style="color:var(--text3);font-size:11px">${f.pixTipo}</div>`:''}
            </div>`:'—'}
          </td>
          <td>
            <div style="display:flex;gap:4px">
              <button class="btn" style="padding:4px 8px;font-size:11px" onclick="editFornecedor(${i})">Editar</button>
              <button class="btn" style="padding:4px 8px;font-size:11px;color:var(--red)" onclick="removeFornecedor(${i})">✕</button>
            </div>
          </td>
        </tr>
        ${f.obs?`<tr><td colspan="6" style="padding:4px 12px 10px;font-size:12px;color:var(--text3);border-bottom:1px solid var(--border)">${f.obs}</td></tr>`:''}
        `).join('')}
      </tbody>
    </table>
  </div>`;
}

function abrirModalFornecedor(){
  document.getElementById('forn-modal-title').textContent='Cadastrar Fornecedor';
  document.getElementById('forn-edit-idx').value='-1';
  ['forn-nome','forn-servico','forn-tel','forn-email','forn-doc','forn-pix','forn-obs'].forEach(id=>{
    const el=document.getElementById(id);if(el)el.value='';
  });
  document.getElementById('forn-pix-tipo').value='';
  showModal('modal-add-fornecedor');
}

function saveFornecedor(){
  const idx=parseInt(document.getElementById('forn-edit-idx').value);
  const dados={
    nome:document.getElementById('forn-nome').value.trim(),
    servico:document.getElementById('forn-servico').value.trim(),
    tel:document.getElementById('forn-tel').value.trim(),
    email:document.getElementById('forn-email').value.trim(),
    doc:document.getElementById('forn-doc').value.trim(),
    pix:document.getElementById('forn-pix').value.trim(),
    pixTipo:document.getElementById('forn-pix-tipo').value,
    obs:document.getElementById('forn-obs').value.trim()
  };
  if(!dados.nome){document.getElementById('forn-nome').focus();return;}
  if(idx>=0){state.fornecedores[idx]=dados;}
  else{state.fornecedores.push(dados);}
  save();
  closeModal('modal-add-fornecedor');
  renderFornecedores();
}

function editFornecedor(i){
  const f=state.fornecedores[i];
  document.getElementById('forn-modal-title').textContent='Editar Fornecedor';
  document.getElementById('forn-edit-idx').value=i;
  document.getElementById('forn-nome').value=f.nome||'';
  document.getElementById('forn-servico').value=f.servico||'';
  document.getElementById('forn-tel').value=f.tel||'';
  document.getElementById('forn-email').value=f.email||'';
  document.getElementById('forn-doc').value=f.doc||'';
  document.getElementById('forn-pix').value=f.pix||'';
  document.getElementById('forn-pix-tipo').value=f.pixTipo||'';
  document.getElementById('forn-obs').value=f.obs||'';
  showModal('modal-add-fornecedor');
}

function removeFornecedor(i){
  if(!confirm('Excluir fornecedor "'+state.fornecedores[i].nome+'"?'))return;
  state.fornecedores.splice(i,1);
  save();renderFornecedores();
}

// ==================== FUNCIONÁRIOS ====================
function renderFuncionarios(){
  const lista=document.getElementById('func-lista');
  if(!lista)return;
  if(!state.funcionarios.length){
    lista.innerHTML=`<div class="card"><div class="empty"><svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a7 7 0 0 1 13 0"/></svg><p>Nenhum funcionário cadastrado.</p></div></div>`;
    return;
  }
  lista.innerHTML=state.funcionarios.map((f,i)=>{
    const hoje=new Date();
    const nasc=f.nasc?new Date(f.nasc):null;
    const idade=nasc?Math.floor((hoje-nasc)/(365.25*24*3600*1000)):null;
    const anivers=nasc?`${String(nasc.getUTCDate()).padStart(2,'0')}/${String(nasc.getUTCMonth()+1).padStart(2,'0')}`:'—';
    const admissao=f.admissao?new Date(f.admissao):null;
    const tempoEmp=admissao?Math.floor((hoje-admissao)/(365.25*24*3600*1000)):null;
    return`<div class="card" style="margin-bottom:16px">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px">
        <div style="display:flex;align-items:center;gap:16px;flex:1">
          <div style="width:52px;height:52px;border-radius:50%;background:var(--accent-light);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:600;color:var(--accent);flex-shrink:0">${f.nome.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
          <div style="flex:1">
            <div style="font-size:15px;font-weight:600;margin-bottom:2px">${f.nome}</div>
            <div style="font-size:13px;color:var(--text3)">${f.cargo||'Funcionário'} ${tempoEmp!==null?'· '+tempoEmp+(tempoEmp===1?' ano':' anos')+' de empresa':''}</div>
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-shrink:0">
          <button class="btn" style="padding:5px 10px;font-size:12px" onclick="editFuncionario(${i})">Editar</button>
          <button class="btn" style="padding:5px 10px;font-size:12px;color:var(--red)" onclick="removeFuncionario(${i})">Excluir</button>
        </div>
      </div>
      <div class="sep"></div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
        <div>
          <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Dados Pessoais</div>
          <div style="display:flex;flex-direction:column;gap:6px">
            <div style="display:flex;justify-content:space-between;font-size:13px"><span style="color:var(--text3)">CPF</span><span style="font-family:var(--mono);font-size:12px">${f.cpf||'—'}</span></div>
            <div style="display:flex;justify-content:space-between;font-size:13px"><span style="color:var(--text3)">RG</span><span style="font-family:var(--mono);font-size:12px">${f.rg||'—'}</span></div>
            <div style="display:flex;justify-content:space-between;font-size:13px"><span style="color:var(--text3)">PIS/PASEP</span><span style="font-family:var(--mono);font-size:12px">${f.pis||'—'}</span></div>
            <div style="display:flex;justify-content:space-between;font-size:13px"><span style="color:var(--text3)">Aniversário</span><span><strong>${anivers}</strong>${idade!==null?' ('+idade+' anos)':''}</span></div>
            <div style="display:flex;justify-content:space-between;font-size:13px"><span style="color:var(--text3)">Admissão</span><span>${f.admissao?f.admissao.split('-').reverse().join('/'):'—'}</span></div>
          </div>
        </div>
        <div>
          <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Contato</div>
          <div style="display:flex;flex-direction:column;gap:6px">
            <div style="display:flex;justify-content:space-between;font-size:13px"><span style="color:var(--text3)">Telefone</span><span>${f.tel||'—'}</span></div>
            <div style="display:flex;justify-content:space-between;font-size:13px"><span style="color:var(--text3)">E-mail</span><span style="font-size:12px">${f.email||'—'}</span></div>
            ${f.end?`<div style="font-size:12px;color:var(--text3);margin-top:4px">${f.end}</div>`:''}
          </div>
        </div>
        <div>
          <div style="font-size:11px;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Benefícios</div>
          <div style="display:flex;flex-direction:column;gap:6px">
            <div style="font-size:12px;color:var(--text3);font-weight:500;margin-bottom:2px">Vale Alimentação</div>
            <div style="display:flex;justify-content:space-between;font-size:13px"><span style="color:var(--text3)">Cartão</span><span style="font-family:var(--mono);font-size:12px">${f.cartaoVA||'—'}</span></div>
            <div style="display:flex;justify-content:space-between;font-size:13px"><span style="color:var(--text3)">Operadora</span><span>${f.opVA||'—'}</span></div>
            <div style="font-size:12px;color:var(--text3);font-weight:500;margin-top:8px;margin-bottom:2px">Vale Transporte</div>
            <div style="display:flex;justify-content:space-between;font-size:13px"><span style="color:var(--text3)">Cartão</span><span style="font-family:var(--mono);font-size:12px">${f.cartaoVT||'—'}</span></div>
            <div style="display:flex;justify-content:space-between;font-size:13px"><span style="color:var(--text3)">Operadora</span><span>${f.opVT||'—'}</span></div>
          </div>
        </div>
      </div>
      ${f.obs?`<div style="margin-top:12px;padding:10px 12px;background:var(--surface2);border-radius:8px;font-size:12px;color:var(--text3)">${f.obs}</div>`:''}
    </div>`;
  }).join('');
}

function saveFuncionario(){
  const idx=parseInt(document.getElementById('func-edit-idx').value);
  const dados={
    nome:document.getElementById('func-nome').value.trim(),
    cpf:document.getElementById('func-cpf').value.trim(),
    nasc:document.getElementById('func-nasc').value,
    cargo:document.getElementById('func-cargo').value.trim(),
    admissao:document.getElementById('func-admissao').value,
    tel:document.getElementById('func-tel').value.trim(),
    email:document.getElementById('func-email').value.trim(),
    cartaoVA:document.getElementById('func-cartao-va').value.trim(),
    opVA:document.getElementById('func-op-va').value.trim(),
    cartaoVT:document.getElementById('func-cartao-vt').value.trim(),
    opVT:document.getElementById('func-op-vt').value.trim(),
    rg:document.getElementById('func-rg').value.trim(),
    pis:document.getElementById('func-pis').value.trim(),
    end:document.getElementById('func-end').value.trim(),
    obs:document.getElementById('func-obs').value.trim()
  };
  if(!dados.nome){document.getElementById('func-nome').focus();return;}
  if(idx>=0){state.funcionarios[idx]=dados;}
  else{state.funcionarios.push(dados);}
  // sync zelador name on gestao for use in documents
  if(state.funcionarios.length===1||idx===0){state.gestao.zelador=dados.nome;}
  save();
  closeModal('modal-add-funcionario');
  renderFuncionarios();
}

function editFuncionario(i){
  const f=state.funcionarios[i];
  document.getElementById('func-modal-title').textContent='Editar Funcionário';
  document.getElementById('func-edit-idx').value=i;
  document.getElementById('func-nome').value=f.nome||'';
  document.getElementById('func-cpf').value=f.cpf||'';
  document.getElementById('func-nasc').value=f.nasc||'';
  document.getElementById('func-cargo').value=f.cargo||'';
  document.getElementById('func-admissao').value=f.admissao||'';
  document.getElementById('func-tel').value=f.tel||'';
  document.getElementById('func-email').value=f.email||'';
  document.getElementById('func-cartao-va').value=f.cartaoVA||'';
  document.getElementById('func-op-va').value=f.opVA||'';
  document.getElementById('func-cartao-vt').value=f.cartaoVT||'';
  document.getElementById('func-op-vt').value=f.opVT||'';
  document.getElementById('func-rg').value=f.rg||'';
  document.getElementById('func-pis').value=f.pis||'';
  document.getElementById('func-end').value=f.end||'';
  document.getElementById('func-obs').value=f.obs||'';
  showModal('modal-add-funcionario');
}

function removeFuncionario(i){
  if(!confirm('Excluir funcionário "'+state.funcionarios[i].nome+'"?'))return;
  state.funcionarios.splice(i,1);
  save();renderFuncionarios();
}

function resetFuncModal(){
  document.getElementById('func-modal-title').textContent='Cadastrar Funcionário';
  document.getElementById('func-edit-idx').value='-1';
  ['func-nome','func-cpf','func-nasc','func-cargo','func-admissao','func-tel','func-email',
   'func-cartao-va','func-op-va','func-cartao-vt','func-op-vt','func-rg','func-pis','func-end','func-obs']
  .forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
}

// ==================== GESTÃO ====================
function renderGestao(){
  const g=state.gestao;
  const set=(id,val)=>{const el=document.getElementById(id);if(el)el.value=val||'';};
  set('gest-nome',g.nome);set('gest-cnpj',g.cnpj);set('gest-end',g.endereco);
  set('gest-cep',g.cep);set('gest-cidade',g.cidade);
  set('gest-sindico',g.sindico);set('gest-subsindico',g.subsindico);
  set('gest-cons1',g.cons1);set('gest-cons2',g.cons2);
  set('gest-assembleia-isencao',g.assembleiaIsencaoData||'');
  // Populate sindico apto
  const sel=document.getElementById('gest-sindico-apto');
  if(sel){sel.value=g.sindicoApto||'';}
  atualizarInfoSindicoApto();
  renderAlertasGestao();
}

function atualizarInfoSindicoApto(){
  const apto=state.gestao.sindicoApto;
  const info=document.getElementById('gest-sindico-apto-info');
  if(!info)return;
  if(!apto){info.textContent='';return;}
  const c=state.condominos.find(x=>x.apto===apto);
  if(c){
    info.textContent=`Apto ${apto} — ${c.nome||''}  |  Status atual: ${c.status}  |  Taxa: ${brl(c.taxa)}`;
    info.style.color=c.status==='Isento'?'var(--green)':'var(--amber)';
  }
}

function atualizarAptSindico(){
  const novoApto=document.getElementById('gest-sindico-apto').value;
  const antigoApto=state.gestao.sindicoApto;

  // Remove isenção do apto anterior, se existia e for diferente
  if(antigoApto && antigoApto!==novoApto){
    const anterior=state.condominos.find(c=>c.apto===antigoApto);
    if(anterior && anterior.status==='Isento'){
      if(confirm(`Remover isenção do Apto ${antigoApto} (${anterior.nome||''})?`)){
        anterior.status='Ativo';
        anterior.taxa=state.condominos.find(c=>c.status==='Ativo'&&c.taxa>0)?.taxa||450;
      }
    }
  }

  // Aplicar isenção no novo apto
  if(novoApto){
    const novo=state.condominos.find(c=>c.apto===novoApto);
    if(novo){
      novo.status='Isento';
      novo.taxa=0;
      const dataAss=state.gestao.assembleiaIsencaoData;
      const textoIsencao='Isento — Apartamento do(a) Síndico(a)'+(dataAss?` conforme assembleia de ${formatDateBRShort(dataAss)}`:'')+'.';
      if(!novo.obs.includes('Isento')) novo.obs=(novo.obs?novo.obs+' — ':'')+textoIsencao;
    }
  }

  state.gestao.sindicoApto=novoApto||'';
  save();
  atualizarInfoSindicoApto();
  alert(novoApto
    ? `Isenção aplicada ao Apto ${novoApto}. Salve os dados de gestão para confirmar.`
    : 'Nenhum apartamento marcado como isento por síndico.');
}

function saveGestao(){
  state.gestao.nome=document.getElementById('gest-nome').value;
  state.gestao.cnpj=document.getElementById('gest-cnpj').value;
  state.gestao.endereco=document.getElementById('gest-end').value;
  state.gestao.cep=document.getElementById('gest-cep').value;
  state.gestao.cidade=document.getElementById('gest-cidade').value;
  state.gestao.sindico=document.getElementById('gest-sindico').value;
  state.gestao.subsindico=document.getElementById('gest-subsindico').value;
  state.gestao.cons1=document.getElementById('gest-cons1').value;
  state.gestao.cons2=document.getElementById('gest-cons2').value;
  state.gestao.assembleiaIsencaoData=document.getElementById('gest-assembleia-isencao').value;
  save();updateCondNome();alert('Dados salvos!');
}

// ==================== ALERTAS DE VERIFICAÇÃO ====================
// Classifica um alerta conforme a proximidade da data (mês/aaaa) informada, usando a data real de hoje.
function classificarAlerta(dataYYYYMM){
  if(!dataYYYYMM) return {status:'sem-data', diffMeses:null};
  const hoje=new Date();
  const anoAtual=hoje.getFullYear(), mesAtual=hoje.getMonth()+1;
  const [y,m]=dataYYYYMM.split('-').map(Number);
  const diffMeses=(y*12+m)-(anoAtual*12+mesAtual);
  let status;
  if(diffMeses<0) status='red';        // já passou da data
  else if(diffMeses===0) status='orange'; // é neste mês
  else if(diffMeses<=2) status='amber';   // faltando 1 ou 2 meses
  else status='ok';                       // ainda distante
  return {status, diffMeses};
}

const ALERTA_STATUS_INFO={
  red:   {cor:'var(--red)',    bg:'#FBE9E7', label:'Vencido'},
  orange:{cor:'#E8720C',       bg:'#FDECD8', label:'Neste mês'},
  amber: {cor:'var(--amber)',  bg:'#FDF3D8', label:'Se aproximando'},
  ok:    {cor:'var(--green)',  bg:'#EAF3DE', label:'Em dia'},
  'sem-data':{cor:'var(--text3)', bg:'var(--surface2)', label:'Sem data cadastrada'}
};

function formatMesAnoAlerta(dataYYYYMM){
  if(!dataYYYYMM) return '';
  const [y,m]=dataYYYYMM.split('-');
  const meses=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  return `${meses[parseInt(m)-1]}/${y}`;
}

// Ordena por urgência: vencido > neste mês > se aproximando > em dia > sem data
function ordenarAlertasPorUrgencia(lista){
  const ordem={red:0,orange:1,amber:2,ok:3,'sem-data':4};
  return [...lista].sort((a,b)=>{
    const sa=classificarAlerta(a.data).status, sb=classificarAlerta(b.data).status;
    if(ordem[sa]!==ordem[sb]) return ordem[sa]-ordem[sb];
    return (a.data||'9999').localeCompare(b.data||'9999');
  });
}

function renderAlertasDashboard(){
  const cont=document.getElementById('dash-alertas-list');
  if(!cont)return;
  const lista=ordenarAlertasPorUrgencia(state.alertas||[]);
  if(lista.length===0){
    cont.innerHTML='<div class="empty"><p>Nenhum alerta cadastrado. Cadastre em Gestão do Condomínio.</p></div>';
    return;
  }
  cont.innerHTML=`<div style="display:flex;flex-direction:column;gap:8px">
    ${lista.map(a=>{
      const {status}=classificarAlerta(a.data);
      const info=ALERTA_STATUS_INFO[status];
      return `<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 12px;border-radius:8px;background:${info.bg}">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="width:9px;height:9px;border-radius:50%;background:${info.cor};display:inline-block;flex-shrink:0"></span>
          <span style="font-size:13px;font-weight:500">${a.nome}</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:12px;color:${info.cor};font-weight:600">${a.data?formatMesAnoAlerta(a.data):'Sem data'} — ${info.label}</span>
          <button class="btn" style="padding:3px 9px;font-size:11px" onclick="irParaAlertasGestao()">Editar</button>
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

function irParaAlertasGestao(){
  const navBtn=[...document.querySelectorAll('.nav-item')].find(n=>n.getAttribute('onclick')?.includes("'gestao'"));
  showPanel('gestao', navBtn);
  setTimeout(()=>document.getElementById('card-alertas-gestao')?.scrollIntoView({behavior:'smooth',block:'center'}),100);
}

function renderAlertasGestao(){
  const cont=document.getElementById('tabela-alertas-gestao');
  if(!cont)return;
  const lista=state.alertas||[];
  if(lista.length===0){
    cont.innerHTML='<div class="empty"><p>Nenhum alerta cadastrado ainda.</p></div>';
    return;
  }
  cont.innerHTML=`<table style="width:100%;border-collapse:collapse">
    <thead><tr>
      <th style="text-align:left;padding:6px 8px;font-size:11px;font-weight:600;color:var(--text3);border-bottom:1px solid var(--border)">Alerta</th>
      <th style="text-align:left;padding:6px 8px;font-size:11px;font-weight:600;color:var(--text3);border-bottom:1px solid var(--border)">Próxima verificação</th>
      <th style="text-align:left;padding:6px 8px;font-size:11px;font-weight:600;color:var(--text3);border-bottom:1px solid var(--border)">Status</th>
      <th style="width:150px"></th>
    </tr></thead>
    <tbody>
      ${lista.map(a=>{
        const {status}=classificarAlerta(a.data);
        const info=ALERTA_STATUS_INFO[status];
        return `<tr>
          <td style="padding:6px 8px;font-size:13px">${a.nome}</td>
          <td style="padding:6px 8px">
            <input type="month" value="${a.data||''}" onchange="atualizarDataAlerta('${a.id}',this.value)" style="padding:3px 6px;border:1px solid var(--border2);border-radius:5px;font-family:var(--mono);font-size:12px">
          </td>
          <td style="padding:6px 8px">
            <span style="display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:${info.cor}">
              <span style="width:8px;height:8px;border-radius:50%;background:${info.cor};display:inline-block"></span>${info.label}
            </span>
          </td>
          <td style="padding:6px 8px;text-align:right">
            <button class="btn" style="padding:4px 10px;font-size:12px" onclick="excluirAlerta('${a.id}')">Excluir</button>
          </td>
        </tr>`;
      }).join('')}
    </tbody>
  </table>`;
}

function atualizarDataAlerta(id, novaData){
  const a=(state.alertas||[]).find(x=>x.id===id);
  if(!a)return;
  a.data=novaData;
  save();
  renderAlertasGestao();
  renderAlertasDashboard();
}

function excluirAlerta(id){
  const a=(state.alertas||[]).find(x=>x.id===id);
  if(!a)return;
  if(!confirm(`Excluir o alerta "${a.nome}"?`))return;
  state.alertas=state.alertas.filter(x=>x.id!==id);
  save();
  renderAlertasGestao();
  renderAlertasDashboard();
}

function mostrarFormNovoAlerta(){
  document.getElementById('form-novo-alerta').style.display='block';
  document.getElementById('novo-alerta-nome').value='';
  document.getElementById('novo-alerta-data').value='';
  document.getElementById('novo-alerta-nome').focus();
}

function cancelarNovoAlerta(){
  document.getElementById('form-novo-alerta').style.display='none';
}

function salvarNovoAlerta(){
  const nome=document.getElementById('novo-alerta-nome').value.trim();
  const data=document.getElementById('novo-alerta-data').value;
  if(!nome){alert('Informe o nome do alerta.');return;}
  if(!state.alertas) state.alertas=[];
  state.alertas.push({id:'alerta-'+Date.now(), nome, data});
  save();
  cancelarNovoAlerta();
  renderAlertasGestao();
  renderAlertasDashboard();
}

