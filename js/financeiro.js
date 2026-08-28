// ==================== BALANCETE ====================
function renderBalancete(){
  const tabs=document.getElementById('month-tabs-bal');
  tabs.innerHTML=MONTHS.map((m,i)=>`<button class="month-tab${i===state.currentMonth?' active':''}${i<state.currentMonth?' closed':''}" onclick="selectMonth(${i})">${m.substring(0,3)}</button>`).join('');
  renderMonthContent();
}

function selectMonth(i){
  state.currentMonth=i;
  renderBalancete();
}

function renderMonthContent(){
  const m=state.currentMonth;
  const bal=state.balancetes[state.year]?.[m]||{receitas:[],despesas:[],obs:'',fechado:false};
  
  // Summary cards
  const totalR=calcTotalReceitas(m);
  const totalD=calcTotalDespesas(m);
  const saldo=totalR-totalD;
  const saldoAnt=calcSaldoAnterior(m);
  const saldoFinal=saldoAnt+saldo;
  
  document.getElementById('bal-summary-cards').innerHTML=`
    <div class="metric-card blue"><div class="metric-label">Receitas ${MONTHS[m]}</div><div class="metric-value">${brl(totalR)}</div></div>
    <div class="metric-card red"><div class="metric-label">Despesas ${MONTHS[m]}</div><div class="metric-value">${brl(totalD)}</div></div>
    <div class="metric-card ${saldo>=0?'green':'red'}"><div class="metric-label">Resultado Mês</div><div class="metric-value">${brl(saldo)}</div></div>
    <div class="metric-card"><div class="metric-label">Saldo Final em Conta</div><div class="metric-value">${brl(saldoFinal)}</div></div>
  `;

  // Receitas
  const recSection=document.getElementById('bal-receitas-content');
  const recData=getReceitasPorGrupo(m);
  recSection.innerHTML=recData.map(g=>`
    <div style="margin-bottom:14px">
      <div style="font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;padding:6px 0;border-bottom:1px solid var(--border);margin-bottom:6px">${g.nome} — ${brl(g.total)}</div>
      ${g.items.map(it=>`
        <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid var(--border);gap:8px">
          <span style="font-size:13px;color:var(--text2);flex:1">${it.desc}</span>
          <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
            ${it.isTaxaExtra ? `<label style="display:flex;align-items:center;gap:4px;font-size:11px;color:var(--text3);cursor:pointer">
              <input type="checkbox" ${it.isReserva!==false?'checked':''} onchange="toggleIsReserva(${it.recIdx},this.checked)" style="cursor:pointer">
              Reserva
            </label>` : ''}
            <span style="font-size:13px;font-family:var(--mono);color:var(--green);min-width:70px;text-align:right">${brl(it.valor)}</span>
            <button onclick="editReceita(${it.recIdx})" style="background:none;border:1px solid var(--border2);border-radius:5px;padding:2px 7px;font-size:11px;cursor:pointer;color:var(--text2)">Editar</button>
            <button onclick="deleteReceita(${it.recIdx})" style="background:none;border:1px solid var(--border2);border-radius:5px;padding:2px 7px;font-size:11px;cursor:pointer;color:var(--red)">✕</button>
          </div>
        </div>`).join('')}
    </div>`).join('');

  // Despesas
  const despSection=document.getElementById('bal-despesas-content');
  const despData=getDespesasPorGrupo(m);
  despSection.innerHTML=despData.map(g=>`
    <div style="margin-bottom:14px">
      <div style="font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;padding:6px 0;border-bottom:1px solid var(--border);margin-bottom:6px">${g.nome} — ${brl(g.total)}</div>
      ${g.items.map(it=>`
        <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid var(--border);gap:8px">
          <span style="font-size:13px;color:var(--text2);flex:1">${it.desc}</span>
          <div style="display:flex;align-items:center;gap:8px;flex-shrink:0">
            <span style="font-size:13px;font-family:var(--mono);color:var(--red);min-width:70px;text-align:right">${brl(it.valor)}</span>
            <button onclick="editDespesa(${it.despIdx})" style="background:none;border:1px solid var(--border2);border-radius:5px;padding:2px 7px;font-size:11px;cursor:pointer;color:var(--text2)">Editar</button>
            <button onclick="deleteDespesa(${it.despIdx})" style="background:none;border:1px solid var(--border2);border-radius:5px;padding:2px 7px;font-size:11px;cursor:pointer;color:var(--red)">✕</button>
          </div>
        </div>`).join('')}
    </div>`).join('');

  // Resumo
  const reservaFunc=calcReservaFuncAcum(m);
  const reservaTaxa=calcReservaTaxaAcum(m);
  const saldoLivre=saldoFinal-reservaFunc-reservaTaxa;
  
  document.getElementById('bal-resumo-grid').innerHTML=`
    <div style="text-align:center;padding:16px;background:var(--surface2);border-radius:10px">
      <div style="font-size:12px;color:var(--text3);margin-bottom:6px">Saldo Inicial</div>
      <div style="font-size:20px;font-weight:600;font-family:var(--mono)">${brl(saldoAnt)}</div>
    </div>
    <div style="text-align:center;padding:16px;background:var(--green-light);border-radius:10px">
      <div style="font-size:12px;color:var(--green);margin-bottom:6px">+ Receitas do Mês</div>
      <div style="font-size:20px;font-weight:600;font-family:var(--mono);color:var(--green)">${brl(totalR)}</div>
    </div>
    <div style="text-align:center;padding:16px;background:var(--red-light);border-radius:10px">
      <div style="font-size:12px;color:var(--red);margin-bottom:6px">- Despesas do Mês</div>
      <div style="font-size:20px;font-weight:600;font-family:var(--mono);color:var(--red)">${brl(totalD)}</div>
    </div>`;

  document.getElementById('bal-reservas-grid').innerHTML=`
    <div class="metric-card" style="background:var(--accent-light)">
      <div class="metric-label">Reserva Funcionário</div>
      <div class="metric-value" style="font-size:16px;color:var(--accent)">${brl(reservaFunc)}</div>
      <div class="metric-sub">Férias + 13º acumulado</div>
    </div>
    <div class="metric-card" style="background:var(--amber-light)">
      <div class="metric-label">Reserva Taxa Extra</div>
      <div class="metric-value" style="font-size:16px;color:var(--amber)">${brl(reservaTaxa)}</div>
      <div class="metric-sub">Arrecadado - Usado</div>
    </div>
    <div class="metric-card" style="background:var(--green-light)">
      <div class="metric-label">Saldo Livre para Uso</div>
      <div class="metric-value" style="font-size:16px;color:var(--green)">${brl(saldoLivre)}</div>
      <div class="metric-sub">Saldo total - reservas</div>
    </div>`;

  document.getElementById('bal-pendencias').innerHTML=`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div style="padding:10px;background:var(--amber-light);border-radius:8px">
        <div style="font-size:11px;color:var(--amber);font-weight:600;margin-bottom:4px">Receitas não recolhidas</div>
        <div style="font-size:13px;color:var(--text2)">Unidades em atraso: <strong>${state.condominos.filter(c=>c.status==='Inadimplente').length}</strong></div>
      </div>
      <div style="padding:10px;background:var(--surface2);border-radius:8px">
        <div style="font-size:11px;color:var(--text3);font-weight:600;margin-bottom:4px">Dívidas do condomínio</div>
        <div style="font-size:13px;color:var(--text2)">Pagamentos pendentes: <strong>0</strong></div>
      </div>
    </div>`;

  document.getElementById('bal-obs').value=bal.obs||'';
  document.getElementById('btn-fechamento-txt').textContent=bal.fechado?'Reabrir Mês':'Fechar Mês';
}

function calcTotalReceitas(m){
  const b=state.balancetes[state.year]?.[m];
  if(b&&b.receitas&&b.receitas.length){
    return b.receitas.reduce((s,r)=>s+Number(r.valor||0),0);
  }
  return 0;
}

function calcTotalDespesas(m){
  const b=state.balancetes[state.year]?.[m];
  if(b&&b.despesas&&b.despesas.length){
    return b.despesas.reduce((s,d)=>s+Number(d.valor||0),0);
  }
  return 0;
}

function calcSaldoAnterior(m){
  // Use explicit saldoInicial if stored on the balancete
  const b=state.balancetes[state.year]?.[m];
  if(b&&b.saldoInicial!==undefined) return b.saldoInicial;
  // Otherwise accumulate from month 0
  const b0=state.balancetes[state.year]?.[0];
  let s=(b0&&b0.saldoInicial!==undefined)?b0.saldoInicial:0;
  for(let i=0;i<m;i++){s+=calcTotalReceitas(i)-calcTotalDespesas(i);}
  return s;
}

function calcReservaFuncAcum(m){
  // Reserva cumulativa: começa do valor trazido do ano anterior (reservaFuncInicial), ou zero se não houver
  // Desconta: sal-ferias, sal-13, sal-cob
  // Desconta também: inss e fgts quando marcados como isReservaFunc (referentes a férias/13)
  const reservaMes = calcReservaMensal();
  let acum = state.balancetes[state.year]?.[0]?.reservaFuncInicial || 0;
  for(let i = 0; i <= m; i++){
    acum += reservaMes;
    if(i > 0){ // Janeiro nunca desconta — pagamentos são do ano anterior
      const b = state.balancetes[state.year]?.[i];
      if(b && b.despesas){
        b.despesas.forEach(d=>{
          if(d.categoria==='sal-ferias' || d.categoria==='sal-13' || d.categoria==='sal-cob'){
            acum -= Number(d.valor||0);
          }
          // INSS ou FGTS marcados como referentes a férias/13
          if((d.categoria==='inss'||d.categoria==='fgts') && d.isReservaFunc){
            acum -= Number(d.valor||0);
          }
        });
      }
    }
  }
  return Math.max(0, acum);
}

function calcReservaMensal(){
  const sal     = state.encargos.salario || 1639.05;
  const fgtsPct = (state.encargos.fgtsPct || 8) / 100;
  const salLiq  = sal * (1 - 0.08);
  const terco   = sal / 3;
  const recLiqFerias = salLiq + terco - terco * 0.08;
  const encFerias    = sal*fgtsPct + sal*0.33 + sal*0.01
                     + terco*fgtsPct + terco*0.33 + terco*0.01;
  const custoFerias  = recLiqFerias + encFerias;
  const enc13        = sal*fgtsPct + sal*0.33 + sal*0.01;
  const custo13      = salLiq + enc13;
  return (custoFerias + custo13) / 12;
}

function calcReservaTaxaAcum(m){
  // Acumula receitas de taxa extra marcadas como reserva (não reposição)
  // até o mês m, menos o que foi usado via despesas obras-taxa
  // Começa do valor trazido do ano anterior (reservaTaxaInicial), ou zero se não houver
  let acum = state.balancetes[state.year]?.[0]?.reservaTaxaInicial || 0;
  for(let i = 0; i <= m; i++){
    const b = state.balancetes[state.year]?.[i];
    if(!b) continue;
    // Receitas de taxa extra marcadas como reserva
    (b.receitas||[]).forEach(r=>{
      if(r.categoria==='taxa-extra' && r.isReserva !== false) acum += Number(r.valor||0);
    });
    // Saídas via uso de taxa extra
    (b.despesas||[]).forEach(d=>{
      if(d.categoria==='obras-taxa') acum -= Number(d.valor||0);
    });
  }
  return Math.max(0, acum);
}

function getReceitasPorGrupo(m){
  const b=state.balancetes[state.year]?.[m];
  let grupos=[
    {nome:'1.1 — Taxas de Condomínio', items:[], total:0},
    {nome:'1.2 — Taxas Extras', items:[], total:0},
    {nome:'1.3 — Recebimentos em Atraso', items:[], total:0},
    {nome:'1.4 — Receitas Extraordinárias', items:[], total:0}
  ];
  if(b&&b.receitas){
    b.receitas.forEach(r=>{
      const gi={'taxa-mensal':0,'taxa-extra':1,'atraso':2,'outras':3}[r.categoria]??0;
      if(grupos[gi]){
        grupos[gi].items.push({
          desc:`Apto ${r.unidade}${r.desc?' — '+r.desc:''}`,
          valor:r.valor,
          isReserva: r.isReserva,
          isTaxaExtra: r.categoria==='taxa-extra',
          idx: grupos[gi].items.length,
          recIdx: (state.balancetes[state.year]?.[m]?.receitas||[]).indexOf(r)
        });
        grupos[gi].total+=Number(r.valor);
      }
    });
  }
  return grupos.filter(g=>g.total>0);
}

function getDespesasPorGrupo(m){
  const b=state.balancetes[state.year]?.[m];
  if(!b||!b.despesas?.length)return[];
  const catMap={
    'sal-mensal':'2.1 — Funcionário','sal-ferias':'2.1 — Funcionário','sal-13':'2.1 — Funcionário',
    'sal-cob':'2.1 — Funcionário','vale-al':'2.1 — Funcionário','vale-tr':'2.1 — Funcionário',
    'inss':'2.1 — Funcionário','fgts':'2.1 — Funcionário',
    'celpe':'2.2 — Despesas Recorrentes','compesa':'2.2 — Despesas Recorrentes',
    'seguro':'2.2 — Despesas Recorrentes','adm':'2.2 — Despesas Recorrentes',
    'secovi':'2.4 — Taxas Sindicais',
    'agua':'2.5 — Despesas Diversas','limpeza':'2.5 — Despesas Diversas','outros':'2.5 — Despesas Diversas',
    'obras':'2.6 — Obras e Manutenção','obras-taxa':'2.7 — Uso Taxa Extra'
  };
  const grupos={};
  b.despesas.forEach(d=>{
    const gNome=catMap[d.categoria]||'2.5 — Despesas Diversas';
    if(!grupos[gNome])grupos[gNome]={nome:gNome,items:[],total:0};
    grupos[gNome].items.push({desc:d.desc||d.categoria,valor:d.valor,despIdx:(state.balancetes[state.year]?.[m]?.despesas||[]).indexOf(d)});
    grupos[gNome].total+=Number(d.valor||0);
  });
  const order=['2.1 — Funcionário','2.2 — Despesas Recorrentes','2.3 — Despesas Bancárias','2.4 — Taxas Sindicais','2.5 — Despesas Diversas','2.6 — Obras e Manutenção','2.7 — Uso Taxa Extra'];
  return order.map(k=>grupos[k]).filter(Boolean);
}

function saveBal(){
  const m=state.currentMonth;
  if(!state.balancetes[state.year])state.balancetes[state.year]={};
  if(!state.balancetes[state.year][m])state.balancetes[state.year][m]={receitas:[],despesas:[],obs:'',fechado:false};
  state.balancetes[state.year][m].obs=document.getElementById('bal-obs').value;
  save();
  alert('Balancete salvo!');
}

function toggleFechamento(){
  const m=state.currentMonth;
  if(!state.balancetes[state.year])state.balancetes[state.year]={};
  if(!state.balancetes[state.year][m])state.balancetes[state.year][m]={receitas:[],despesas:[],obs:'',fechado:false};
  state.balancetes[state.year][m].fechado=!state.balancetes[state.year][m].fechado;
  save();
  renderBalancete();
}

// --- Editar / Excluir receita ---
function editReceita(idx){
  const m=state.currentMonth;
  const r=state.balancetes[state.year]?.[m]?.receitas?.[idx];
  if(!r)return;
  document.getElementById('er-idx').value=idx;
  document.getElementById('er-unidade').value=r.unidade||'';
  document.getElementById('er-valor').value=r.valor||'';
  document.getElementById('er-data').value=r.data||'';
  document.getElementById('er-desc').value=r.desc||'';
  showModal('modal-edit-receita');
}
function saveEditReceita(){
  const m=state.currentMonth;
  const idx=parseInt(document.getElementById('er-idx').value);
  const r=state.balancetes[state.year][m].receitas[idx];
  r.valor=parseFloat(document.getElementById('er-valor').value)||0;
  r.data=document.getElementById('er-data').value;
  r.desc=document.getElementById('er-desc').value;
  save();closeModal('modal-edit-receita');renderMonthContent();
}
function deleteReceita(idx){
  if(!confirm('Excluir este lançamento de receita?'))return;
  const m=state.currentMonth;
  state.balancetes[state.year][m].receitas.splice(idx,1);
  save();renderMonthContent();
}

// --- Editar / Excluir despesa ---
function editDespesa(idx){
  const m=state.currentMonth;
  const d=state.balancetes[state.year]?.[m]?.despesas?.[idx];
  if(!d)return;
  document.getElementById('ed-idx').value=idx;
  document.getElementById('ed-categoria').value=d.categoria||'outros';
  document.getElementById('ed-valor').value=d.valor||'';
  document.getElementById('ed-data').value=d.data||'';
  document.getElementById('ed-desc').value=d.desc||'';
  showModal('modal-edit-despesa');
}
function saveEditDespesa(){
  const m=state.currentMonth;
  const idx=parseInt(document.getElementById('ed-idx').value);
  const d=state.balancetes[state.year][m].despesas[idx];
  d.categoria=document.getElementById('ed-categoria').value;
  d.valor=parseFloat(document.getElementById('ed-valor').value)||0;
  d.data=document.getElementById('ed-data').value;
  d.desc=document.getElementById('ed-desc').value;
  save();closeModal('modal-edit-despesa');renderMonthContent();
}
function deleteDespesa(idx){
  if(!confirm('Excluir este lançamento de despesa?'))return;
  const m=state.currentMonth;
  state.balancetes[state.year][m].despesas.splice(idx,1);
  save();renderMonthContent();
}

// --- Lancamento em lote ---
// Gera a descrição padrão de uma unidade para o lançamento em lote, conforme categoria e status
function loteDescPadrao(c, cat){
  if(cat==='taxa-mensal'){
    if(c.status==='Isento'){
      const d=state.gestao.assembleiaIsencaoData;
      return d ? `Isento conforme assembleia ${formatDateBRShort(d)}` : 'Isento conforme assembleia';
    }
    const periodo=(document.getElementById('lote-periodo')?.value||'').trim();
    return periodo ? `Taxa Mensal ${periodo}` : 'Taxa Mensal';
  }
  // taxa-extra
  const motivo=(document.getElementById('lote-motivo')?.value||'').trim();
  const parcela=(document.getElementById('lote-parcela')?.value||'').trim();
  let desc='Taxa Extra';
  if(motivo) desc+=' '+motivo;
  desc+= parcela ? ` Parcela ${parcela}` : ' Parcela Única';
  return desc;
}
// Reaplica a descrição padrão a todas as unidades (chamado quando período/motivo/parcela mudam)
function reaplicarDescLote(){
  const cat=document.getElementById('lote-categoria').value;
  state.condominos.forEach(c=>{
    const el=document.getElementById('lote-desc-'+c.apto);
    if(el) el.value=loteDescPadrao(c,cat);
  });
}
function buildLoteTable(){
  const cat=document.getElementById('lote-categoria').value;
  const isTaxaExtra=cat==='taxa-extra';
  const isTaxaMensal=cat==='taxa-mensal';
  document.getElementById('lote-taxa-extra-flag').style.display=isTaxaExtra?'block':'none';
  document.getElementById('lote-extra-wrap').style.display=isTaxaExtra?'block':'none';
  const periodoWrap=document.getElementById('lote-periodo-wrap');
  periodoWrap.style.display=isTaxaMensal?'block':'none';
  if(isTaxaMensal){
    const periodoEl=document.getElementById('lote-periodo');
    if(periodoEl && !periodoEl.value){
      const mes=String(state.currentMonth+1).padStart(2,'0');
      periodoEl.value=`${mes}/${state.year}`;
    }
  }
  document.getElementById('lote-table').innerHTML=`
    <table style="width:100%;border-collapse:collapse">
      <thead><tr>
        <th style="text-align:left;padding:6px 8px;font-size:11px;font-weight:600;color:var(--text3);border-bottom:1px solid var(--border)">Apt.</th>
        <th style="text-align:left;padding:6px 8px;font-size:11px;font-weight:600;color:var(--text3);border-bottom:1px solid var(--border)">Condômino</th>
        <th style="text-align:right;padding:6px 8px;font-size:11px;font-weight:600;color:var(--text3);border-bottom:1px solid var(--border)">Valor (R$)</th>
        <th style="text-align:left;padding:6px 8px;font-size:11px;font-weight:600;color:var(--text3);border-bottom:1px solid var(--border)">Descrição</th>
        <th style="text-align:center;padding:6px 8px;font-size:11px;font-weight:600;color:var(--text3);border-bottom:1px solid var(--border)">Incluir</th>
      </tr></thead>
      <tbody>
        ${state.condominos.map(c=>`<tr>
          <td style="padding:5px 8px;font-size:13px;font-weight:600">${c.apto}</td>
          <td style="padding:5px 8px;font-size:12px;color:var(--text2)">${c.nome}</td>
          <td style="padding:5px 8px;text-align:right">
            <input type="number" id="lote-val-${c.apto}" value="${c.status==='Isento'?0:c.taxa}"
              step="0.01" style="width:90px;text-align:right;font-family:var(--mono);font-size:13px;padding:3px 6px;border:1px solid var(--border2);border-radius:5px">
          </td>
          <td style="padding:5px 8px">
            <input type="text" id="lote-desc-${c.apto}" value="${(loteDescPadrao(c,cat)||'').replace(/"/g,'&quot;')}"
              style="width:100%;min-width:180px;font-size:12px;padding:3px 6px;border:1px solid var(--border2);border-radius:5px">
          </td>
          <td style="padding:5px 8px;text-align:center">
            <input type="checkbox" id="lote-inc-${c.apto}" ${c.status==='Isento'?'':'checked'}>
          </td>
        </tr>`).join('')}
      </tbody>
    </table>`;
}
function applyLotePadrao(){
  const v=document.getElementById('lote-valor-padrao').value;
  if(!v)return;
  state.condominos.forEach(c=>{
    const el=document.getElementById('lote-val-'+c.apto);
    if(el&&c.status!=='Isento') el.value=v;
  });
}
function saveLoteReceita(){
  const m=state.currentMonth;
  const cat=document.getElementById('lote-categoria').value;
  const data=document.getElementById('lote-data').value;
  const isReserva=cat==='taxa-extra'?document.getElementById('lote-is-reserva').checked:undefined;
  if(!state.balancetes[state.year])state.balancetes[state.year]={};
  if(!state.balancetes[state.year][m])state.balancetes[state.year][m]={receitas:[],despesas:[],obs:'',fechado:false};
  let count=0;
  state.condominos.forEach(c=>{
    const inc=document.getElementById('lote-inc-'+c.apto);
    if(!inc||!inc.checked)return;
    const val=parseFloat(document.getElementById('lote-val-'+c.apto)?.value||0)||0;
    const desc=document.getElementById('lote-desc-'+c.apto)?.value||'';
    state.balancetes[state.year][m].receitas.push({
      categoria:cat, unidade:c.apto, valor:val, data, desc,
      isReserva: cat==='taxa-extra' ? isReserva : undefined
    });
    count++;
  });
  save();closeModal('modal-lote-receita');renderMonthContent();
  // brief feedback
  const btn=document.querySelector('#modal-lote-receita .btn.primary');
  if(btn){const orig=btn.textContent;btn.textContent=`✓ ${count} lançados`;setTimeout(()=>btn.textContent=orig,2000);}
}


// --- Lançamento de despesas recorrentes em lote (todas as categorias do mês corrente, de uma vez) ---

// Cada linha da tela: chave (id único), rótulo, tipo de campo extra, e se o período padrão é o mês atual ou o mês anterior
const LOTE_DESPESA_ROWS=[
  {key:'celpe',        label:'CELPE (Energia)',            tipo:'consumo', unidadeConsumo:'KWh', periodoTipo:'anterior'},
  {key:'compesa',      label:'COMPESA (Água/Esgoto)',       tipo:'consumo', unidadeConsumo:'m³',  periodoTipo:'anterior'},
  {key:'sal-mensal-1', label:'Salário - 1ª quinzena',       tipo:'simples',  periodoTipo:'atual'},
  {key:'sal-mensal-2', label:'Salário - 2ª quinzena',       tipo:'simples',  periodoTipo:'atual'},
  {key:'vale-al',      label:'Vale Alimentação',            tipo:'simples',  periodoTipo:'atual'},
  {key:'vale-tr',      label:'Vale Transporte',             tipo:'simples',  periodoTipo:'atual'},
  {key:'inss',         label:'INSS + PIS',                  tipo:'reserva',  periodoTipo:'anterior'},
  {key:'fgts',         label:'FGTS',                        tipo:'reserva',  periodoTipo:'anterior'},
  {key:'seguro',       label:'Seguro Condomínio',           tipo:'parcela'},
  {key:'adm',          label:'Taxa Administração',          tipo:'simples',  periodoTipo:'atual'},
  {key:'secovi',       label:'SECOVI/SIECC/PE',             tipo:'simples',  periodoTipo:'atual'}
];

// A categoria "real" gravada na despesa (as duas linhas de quinzena viram a mesma categoria sal-mensal)
function categoriaRealLinhaRecorrente(key){
  if(key==='sal-mensal-1'||key==='sal-mensal-2') return 'sal-mensal';
  return key;
}

function periodoDefaultLinhaRecorrente(row){
  const m=state.currentMonth, ano=state.year;
  const mes=String(m+1).padStart(2,'0');
  const mRef = m===0 ? `12/${ano-1}` : `${String(m).padStart(2,'0')}/${ano}`;
  return row.periodoTipo==='anterior' ? mRef : `${mes}/${ano}`;
}

function gerarDescLinhaRecorrente(key, periodo, extra){
  extra=extra||{};
  switch(key){
    case 'celpe':        return `CELPE (${periodo})`+(extra.consumo?` - consumo: ${extra.consumo} KWh`:'');
    case 'compesa':      return `COMPESA (${periodo})`+(extra.consumo?` - consumo: ${extra.consumo} m³`:'');
    case 'sal-mensal-1': return `Salários - 1ª quinzena (${periodo})`;
    case 'sal-mensal-2': return `Salários - 2ª quinzena (${periodo})`;
    case 'vale-al':      return `Vale alimentação (${periodo})`;
    case 'vale-tr':       return `Vale transporte (${periodo})`;
    case 'inss':          return `INSS e PIS (${periodo})`;
    case 'fgts':          return `FGTS (${periodo})`;
    case 'seguro':        return `Seguro condomínio`+(extra.parcela?` (parcela ${extra.parcela})`:'');
    case 'adm':           return `Taxa administração (${periodo})`;
    case 'secovi':        return `SECOVI/SIECC/PE (${periodo})`;
    default: return '';
  }
}

function renderLinhaRecorrente(row){
  const m=state.currentMonth, ano=state.year;
  const mes=String(m+1).padStart(2,'0');
  const dataDefault=`${ano}-${mes}-05`;
  const periodo=periodoDefaultLinhaRecorrente(row);
  const inputStyle='padding:3px 6px;border:1px solid var(--border2);border-radius:5px';
  let detalheHtml='';
  if(row.tipo==='consumo'){
    detalheHtml=`<input type="number" id="lde-consumo-${row.key}" placeholder="Consumo (${row.unidadeConsumo})" style="width:110px;${inputStyle};font-size:12px">`;
  } else if(row.tipo==='parcela'){
    detalheHtml=`<input type="text" id="lde-parcela-${row.key}" placeholder="ex: 3/10" style="width:80px;${inputStyle};font-size:12px">`;
  } else if(row.tipo==='reserva'){
    detalheHtml=`<label style="font-size:11px;display:flex;align-items:center;gap:4px;cursor:pointer;white-space:nowrap"><input type="checkbox" id="lde-reserva-${row.key}"> Férias/13º</label>`;
  }
  return `<tr>
    <td style="padding:6px 8px;text-align:center"><input type="checkbox" id="lde-incluir-${row.key}" checked></td>
    <td style="padding:6px 8px;font-size:13px;white-space:nowrap">${row.label}</td>
    <td style="padding:6px 8px"><input type="text" id="lde-periodo-${row.key}" value="${periodo}" style="width:85px;${inputStyle};font-family:var(--mono);font-size:12px"></td>
    <td style="padding:6px 8px">${detalheHtml}</td>
    <td style="padding:6px 8px"><input type="date" id="lde-data-${row.key}" value="${dataDefault}" style="${inputStyle};font-size:12px"></td>
    <td style="padding:6px 8px;text-align:right"><input type="number" step="0.01" id="lde-valor-${row.key}" placeholder="0,00" style="width:100px;text-align:right;${inputStyle};font-family:var(--mono);font-size:13px"></td>
  </tr>`;
}

function renderLoteDespesaTable(){
  const th=(txt,align)=>`<th style="text-align:${align||'left'};padding:6px 8px;font-size:11px;font-weight:600;color:var(--text3);border-bottom:1px solid var(--border);white-space:nowrap">${txt}</th>`;
  const cont=document.getElementById('lote-despesa-linhas');
  cont.innerHTML=`
    <table style="width:100%;border-collapse:collapse">
      <thead><tr>
        ${th('Incluir','center')}${th('Categoria')}${th('Período')}${th('Detalhe')}${th('Data pagto.')}${th('Valor (R$)','right')}
      </tr></thead>
      <tbody>${LOTE_DESPESA_ROWS.map(row=>renderLinhaRecorrente(row)).join('')}</tbody>
    </table>`;
  const labelEl=document.getElementById('lde-mes-ano-label');
  if(labelEl) labelEl.textContent=`${MONTHS[state.currentMonth]}/${state.year}`;
}

function abrirModalLoteDespesa(){
  renderLoteDespesaTable();
  showModal('modal-lote-despesa');
}

function saveLoteDespesas(){
  const m=state.currentMonth, ano=state.year;
  if(!state.balancetes[ano]) state.balancetes[ano]={};
  if(!state.balancetes[ano][m]) state.balancetes[ano][m]={receitas:[],despesas:[],obs:'',fechado:false};
  const destino=state.balancetes[ano][m].despesas;
  let count=0;
  LOTE_DESPESA_ROWS.forEach(row=>{
    const incluir=document.getElementById('lde-incluir-'+row.key)?.checked;
    if(!incluir) return;
    const valor=document.getElementById('lde-valor-'+row.key)?.value;
    if(!valor) return; // pula linhas sem valor preenchido
    const periodo=document.getElementById('lde-periodo-'+row.key)?.value || '';
    const data=document.getElementById('lde-data-'+row.key)?.value || '';
    const consumo=document.getElementById('lde-consumo-'+row.key)?.value || '';
    const parcela=document.getElementById('lde-parcela-'+row.key)?.value || '';
    const isReserva=document.getElementById('lde-reserva-'+row.key)?.checked || false;
    const desc=gerarDescLinhaRecorrente(row.key, periodo, {consumo, parcela});
    const item={categoria:categoriaRealLinhaRecorrente(row.key), valor:parseFloat(valor)||0, data, desc};
    if(row.tipo==='reserva') item.isReservaFunc=isReserva;
    destino.push(item);
    count++;
  });
  save();closeModal('modal-lote-despesa');renderMonthContent();
  const btn=document.querySelector('#modal-lote-despesa .btn.primary');
  if(btn){const orig=btn.textContent;btn.textContent=`✓ ${count} lançadas`;setTimeout(()=>btn.textContent=orig,2000);}
}

function toggleIsReserva(recIdx, val){
  const m = state.currentMonth;
  const b = state.balancetes[state.year]?.[m];
  if(b && b.receitas && b.receitas[recIdx] !== undefined){
    b.receitas[recIdx].isReserva = val;
    save();
    renderMonthContent();
  }
}

function saveReceita(){
  const m=state.currentMonth;
  if(!state.balancetes[state.year])state.balancetes[state.year]={};
  if(!state.balancetes[state.year][m])state.balancetes[state.year][m]={receitas:[],despesas:[],obs:'',fechado:false};
  const cat = document.getElementById('r-categoria').value;
  state.balancetes[state.year][m].receitas.push({
    categoria: cat,
    unidade: document.getElementById('r-unidade').value,
    valor: parseFloat(document.getElementById('r-valor').value)||0,
    data: document.getElementById('r-data').value,
    desc: document.getElementById('r-desc').value,
    isReserva: cat === 'taxa-extra' ? true : undefined
  });
  save();closeModal('modal-add-receita');renderMonthContent();
}

function openModalDespesa(){
  // Reseta campos
  const cat = document.getElementById('d-categoria');
  if(cat) cat.selectedIndex = 0;
  const val = document.getElementById('d-valor');
  if(val) val.value = '';
  const dat = document.getElementById('d-data');
  if(dat) dat.value = '';
  const desc = document.getElementById('d-desc');
  if(desc) desc.value = '';
  atualizarCamposDespesa();
  showModal('modal-add-despesa');
}

function atualizarCamposDespesa(){
  const cat = document.getElementById('d-categoria').value;
  const aux = document.getElementById('d-campos-aux');
  const m   = state.currentMonth;
  const mes = String(m+1).padStart(2,'0');
  const ano = state.year;
  // Mês de referência padrão = mês anterior (despesas do mês passado pagam esse mês)
  const mRef = m === 0 ? `12/${ano-1}` : `${String(m).padStart(2,'0')}/${ano}`;

  let html = '';

  if(cat === 'sal-mensal'){
    html = `<div class="form-row">
      <div class="form-group"><label class="form-label">Quinzena</label>
        <select id="d-quinzena" onchange="gerarDescDespesa()">
          <option value="1">1ª quinzena</option>
          <option value="2">2ª quinzena</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Período (mm/aaaa)</label>
        <input type="text" id="d-periodo" value="${mes}/${ano}" oninput="gerarDescDespesa()" placeholder="mm/aaaa">
      </div>
    </div>`;
  } else if(cat === 'sal-ferias' || cat === 'sal-13' || cat === 'sal-cob'){
    const label = cat==='sal-ferias'?'Férias':cat==='sal-13'?'13º Salário':'Cobertura de Férias';
    html = `<div class="form-group"><label class="form-label">Período / Referência</label>
      <input type="text" id="d-periodo" value="${mRef}" oninput="gerarDescDespesa()" placeholder="mm/aaaa">
    </div>`;
  } else if(cat === 'vale-al'){
    html = `<div class="form-row">
      <div class="form-group"><label class="form-label">Período (mm/aaaa)</label>
        <input type="text" id="d-periodo" value="${mes}/${ano}" oninput="gerarDescDespesa()" placeholder="mm/aaaa">
      </div>
    </div>`;
  } else if(cat === 'vale-tr'){
    html = `<div class="form-row">
      <div class="form-group"><label class="form-label">Período (mm/aaaa)</label>
        <input type="text" id="d-periodo" value="${mes}/${ano}" oninput="gerarDescDespesa()" placeholder="mm/aaaa">
      </div>
    </div>`;
  } else if(cat === 'inss' || cat === 'fgts'){
    const label = cat === 'inss' ? 'INSS + PIS' : 'FGTS';
    html = `<div class="form-row">
      <div class="form-group"><label class="form-label">Período de referência</label>
        <input type="text" id="d-periodo" value="${mRef}" oninput="gerarDescDespesa()" placeholder="mm/aaaa">
      </div>
    </div>
    <div class="form-group" style="margin-top:4px">
      <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
        <input type="checkbox" id="d-is-reserva-func" onchange="gerarDescDespesa()">
        <span>Referente a <strong>férias ou 13º</strong> — desconta da reserva do funcionário</span>
      </label>
    </div>`;
  } else if(cat === 'celpe'){
    html = `<div class="form-row">
      <div class="form-group"><label class="form-label">Período de referência</label>
        <input type="text" id="d-periodo" value="${mRef}" oninput="gerarDescDespesa()" placeholder="mm/aaaa">
      </div>
      <div class="form-group"><label class="form-label">Consumo (KWh)</label>
        <input type="number" id="d-consumo" placeholder="ex: 117" oninput="gerarDescDespesa()">
      </div>
    </div>`;
  } else if(cat === 'compesa'){
    html = `<div class="form-row">
      <div class="form-group"><label class="form-label">Período de referência</label>
        <input type="text" id="d-periodo" value="${mRef}" oninput="gerarDescDespesa()" placeholder="mm/aaaa">
      </div>
      <div class="form-group"><label class="form-label">Consumo (m³)</label>
        <input type="number" id="d-consumo" placeholder="ex: 78" oninput="gerarDescDespesa()">
      </div>
    </div>`;
  } else if(cat === 'seguro'){
    html = `<div class="form-row">
      <div class="form-group"><label class="form-label">Parcela (ex: 03/10)</label>
        <input type="text" id="d-parcela" placeholder="03/10" oninput="gerarDescDespesa()">
      </div>
    </div>`;
  } else if(cat === 'adm'){
    html = `<div class="form-group"><label class="form-label">Período (mm/aaaa)</label>
      <input type="text" id="d-periodo" value="${mes}/${ano}" oninput="gerarDescDespesa()" placeholder="mm/aaaa">
    </div>`;
  } else if(cat === 'secovi'){
    html = `<div class="form-group"><label class="form-label">Período (mm/aaaa)</label>
      <input type="text" id="d-periodo" value="${mes}/${ano}" oninput="gerarDescDespesa()" placeholder="mm/aaaa">
    </div>`;
  } else if(cat === 'obras' || cat === 'obras-taxa'){
    const fornOpts = (state.fornecedores||[]).map(f =>
      `<option value="${(f.nome||'').replace(/"/g,'&quot;')}">${f.nome||''}</option>`
    ).join('');
    html = `<div class="form-group">
      <label class="form-label">Fornecedor</label>
      ${fornOpts ? `<select id="d-fornecedor-sel" onchange="document.getElementById('d-fornecedor').value=this.value;gerarDescDespesa()" style="margin-bottom:6px;width:100%">
        <option value="">Selecionar do cadastro...</option>${fornOpts}
      </select>` : ''}
      <input type="text" id="d-fornecedor" placeholder="Nome do fornecedor / prestador" oninput="gerarDescDespesa()">
    </div>
    <div class="form-group"><label class="form-label">Serviço / Produto</label>
      <input type="text" id="d-servico" placeholder="Descrição do serviço ou produto" oninput="gerarDescDespesa()">
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">NF / Recibo</label>
        <input type="text" id="d-nf" placeholder="ex: NF 001234" oninput="gerarDescDespesa()">
      </div>
      <div class="form-group"><label class="form-label">Parcela</label>
        <input type="text" id="d-parcela-obras" placeholder="ex: 1/2" oninput="gerarDescDespesa()">
      </div>
    </div>`;
  }

  aux.innerHTML = html ? `<div style="background:var(--accent-light);border:1px solid #c5d9f5;border-radius:8px;padding:12px;margin-bottom:10px">${html}</div>` : '';
  gerarDescDespesa();
}

function gerarDescDespesa(){
  const cat      = document.getElementById('d-categoria')?.value || '';
  const periodo  = document.getElementById('d-periodo')?.value   || '';
  const quinzena = document.getElementById('d-quinzena')?.value  || '';
  const consumo  = document.getElementById('d-consumo')?.value   || '';
  const parcela  = document.getElementById('d-parcela')?.value   || '';
  const descEl   = document.getElementById('d-desc');
  if(!descEl) return;

  let desc = '';
  switch(cat){
    case 'sal-mensal':
      desc = `Salários - ${quinzena==='1'?'1ª':'2ª'} quinzena (${periodo})`;
      break;
    case 'sal-ferias':
      desc = `Salário Férias (${periodo})`;
      break;
    case 'sal-13':
      desc = `13º Salário (${periodo})`;
      break;
    case 'sal-cob':
      desc = `Cobertura de Férias (${periodo})`;
      break;
    case 'vale-al':
      desc = `Vale alimentação (${periodo})`;
      break;
    case 'vale-tr':
      desc = `Vale transporte (${periodo})`;
      break;
    case 'inss':
      desc = `INSS e PIS (${periodo})`;
      break;
    case 'fgts':
      desc = `FGTS (${periodo})`;
      break;
    case 'celpe':
      desc = `CELPE (${periodo})${consumo ? ' - consumo: ' + consumo + ' KWh' : ''}`;
      break;
    case 'compesa':
      desc = `COMPESA (${periodo})${consumo ? ' - consumo: ' + consumo + ' m³' : ''}`;
      break;
    case 'seguro':
      desc = `Seguro condomínio${parcela ? ' (parcela ' + parcela + ')' : ''}`;
      break;
    case 'adm':
      desc = `Taxa administração (${periodo})`;
      break;
    case 'secovi':
      desc = `SECOVI/SIECC/PE (${periodo})`;
      break;
    case 'agua':
      desc = 'Água (galão)';
      break;
    case 'obras':
    case 'obras-taxa': {
      const forn    = document.getElementById('d-fornecedor')?.value.trim() || '';
      const servico = document.getElementById('d-servico')?.value.trim()    || '';
      const nf      = document.getElementById('d-nf')?.value.trim()         || '';
      const parcOb  = document.getElementById('d-parcela-obras')?.value.trim() || '';
      const partes  = [];
      if(forn)    partes.push(forn);
      if(servico) partes.push(servico);
      if(nf)      partes.push(nf);
      if(parcOb)  partes.push(`parcela ${parcOb}`);
      desc = partes.join(' - ');
      break;
    }
  }

  // Só preenche automaticamente se o campo estiver vazio ou com valor gerado antes
  descEl.value = desc;
}

function saveDespesa(){
  const m=state.currentMonth;
  if(!state.balancetes[state.year])state.balancetes[state.year]={};
  if(!state.balancetes[state.year][m])state.balancetes[state.year][m]={receitas:[],despesas:[],obs:'',fechado:false};

  const cat = document.getElementById('d-categoria').value;
  const isReservaFuncEl = document.getElementById('d-is-reserva-func');
  const isReservaFunc   = isReservaFuncEl ? isReservaFuncEl.checked : false;

  state.balancetes[state.year][m].despesas.push({
    categoria: cat,
    valor:     parseFloat(document.getElementById('d-valor').value)||0,
    data:      document.getElementById('d-data').value,
    desc:      document.getElementById('d-desc').value,
    // Para INSS e FGTS: flag indica que é referente a férias/13 → desconta da reserva
    isReservaFunc: (cat==='inss'||cat==='fgts') ? isReservaFunc : undefined
  });
  save();closeModal('modal-add-despesa');renderMonthContent();
}


function exportBalancete(tipo){
  const m   = state.currentMonth;
  const g   = state.gestao;
  const bal = state.balancetes[state.year]?.[m] || {};
  const receitas  = bal.receitas  || [];
  const despesas  = bal.despesas  || [];

  const totalR    = calcTotalReceitas(m);
  const totalD    = calcTotalDespesas(m);
  const saldo     = totalR - totalD;
  const saldoFinal= calcSaldoAnterior(m) + saldo;
  const reservaFunc = calcReservaFuncAcum(m);
  const reservaTaxa = calcReservaTaxaAcum(m);
  const saldoLivre  = saldoFinal - reservaFunc - reservaTaxa;

  const mm  = String(m+1).padStart(2,'0');
  const dia = getDaysInMonth(state.year, m);

  // ── Bloco de receitas para o PDF completo ──────────────────
  let receitasHTML = '';
  if(tipo === 'completo'){
    // Agrupa por unidade: pega lançamentos reais do balancete
    const recPorUnidade = {};
    receitas.forEach(r => {
      if(!recPorUnidade[r.unidade]) recPorUnidade[r.unidade] = [];
      recPorUnidade[r.unidade].push(r);
    });

    // Taxas mensais — uma linha por unidade
    const taxaMensalRows = UNITS.map(u => {
      const cond = state.condominos.find(x => x.apto === u);
      const lancMensal = (recPorUnidade[u] || []).filter(r => r.categoria === 'taxa-mensal');
      if(cond?.status === 'Isento'){
        return `<tr><td style="padding-left:20px">${cond.nome||'Apto '+u}</td><td>Apto ${u}</td><td class="right">Isento</td></tr>`;
      }
      if(lancMensal.length === 0) return '';
      const nomeRow = cond?.nome || 'Apto '+u;
      const totalUnidade = lancMensal.reduce((s,r)=>s+Number(r.valor||0),0);
      // Se há mais de um lançamento (ex: taxa normal + multa separadas), detalha cada um
      if(lancMensal.length > 1){
        return lancMensal.map((r,i) =>
          `<tr><td style="padding-left:20px">${i===0?nomeRow:''}</td><td>${r.desc||'Apto '+u}</td><td class="right">${brl(r.valor)}</td></tr>`
        ).join('');
      }
      // Um único lançamento — mostra sem anotação de descrição
      return `<tr><td style="padding-left:20px">${nomeRow}</td><td>Apto ${u}</td><td class="right">${brl(totalUnidade)}</td></tr>`;
    }).join('');

    // Taxas extras — uma linha por unidade, agrupadas por descrição da taxa
    const taxasExtras = receitas.filter(r => r.categoria === 'taxa-extra');
    let taxasExtrasHTML = '';
    if(taxasExtras.length > 0){
      const totalExtras = taxasExtras.reduce((s,r)=>s+Number(r.valor||0),0);
      // Agrupa por desc (tipo de taxa extra)
      const extrasPorDesc = {};
      taxasExtras.forEach(r => {
        const key = r.desc || 'Taxa extra';
        if(!extrasPorDesc[key]) extrasPorDesc[key] = [];
        extrasPorDesc[key].push(r);
      });
      taxasExtrasHTML = `<tr><td colspan="2" class="section" style="font-weight:normal;font-size:9pt;padding-left:10px">1.2 — Taxas Extras</td><td class="right section" style="font-weight:normal">${brl(totalExtras)}</td></tr>`;
      // Para cada tipo de taxa extra, lista por unidade
      Object.entries(extrasPorDesc).forEach(([desc, lances]) => {
        const subtotal = lances.reduce((s,r)=>s+Number(r.valor||0),0);
        taxasExtrasHTML += `<tr><td colspan="2" style="padding-left:16px;font-size:9.5pt;font-style:italic;color:#444">${desc}</td><td class="right" style="font-size:9.5pt;color:#444">${brl(subtotal)}</td></tr>`;
        lances.forEach(r => {
          const cond = state.condominos.find(x => x.apto === r.unidade);
          const nome = cond?.nome || 'Apto '+r.unidade;
          taxasExtrasHTML += `<tr><td style="padding-left:28px">${nome}</td><td>Apto ${r.unidade}</td><td class="right">${brl(r.valor)}</td></tr>`;
        });
      });
    }

    // Outras receitas
    const outrasRec = receitas.filter(r => r.categoria !== 'taxa-mensal' && r.categoria !== 'taxa-extra');
    let outrasHTML = '';
    if(outrasRec.length > 0){
      const totalOutras = outrasRec.reduce((s,r)=>s+Number(r.valor||0),0);
      outrasHTML = `<tr><td colspan="2" class="section" style="font-weight:normal;font-size:9pt;padding-left:10px">1.3 — Outras Receitas</td><td class="right section" style="font-weight:normal">${brl(totalOutras)}</td></tr>`;
      outrasHTML += outrasRec.map(r =>
        `<tr><td colspan="2" style="padding-left:24px">${r.desc||r.categoria}</td><td class="right">${brl(r.valor)}</td></tr>`
      ).join('');
    }

    const totalMensal = receitas.filter(r=>r.categoria==='taxa-mensal').reduce((s,r)=>s+Number(r.valor||0),0);
    receitasHTML = `
      <tr><td colspan="2" class="section" style="font-weight:normal;font-size:9pt;padding-left:10px">1.1 — Taxas Mensais</td><td class="right section" style="font-weight:normal">${brl(totalMensal)}</td></tr>
      ${taxaMensalRows}
      ${taxasExtrasHTML}
      ${outrasHTML}`;
  }

  const win = window.open('','_blank');
  win.document.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Balancete ${MONTHS[m]} ${state.year}</title>
  <style>
    body{font-family:Arial,sans-serif;font-size:11pt;color:#000;max-width:800px;margin:0 auto;padding:20px}
    h1{font-size:13pt;text-align:center;margin-bottom:2px}
    h2{font-size:11pt;text-align:center;font-weight:normal;margin-bottom:4px}
    h3{font-size:10pt;text-align:center;color:#444;font-weight:normal;margin-bottom:20px}
    table{width:100%;border-collapse:collapse;margin-bottom:12px}
    th{font-size:9pt;text-align:left;border-bottom:1pt solid #000;padding:4px 6px;font-weight:bold}
    td{font-size:10pt;padding:3px 6px;border-bottom:.5pt solid #ccc}
    .section{font-weight:bold;font-size:10pt;background:#f0f0f0;padding:4px 6px}
    .total{font-weight:bold;border-top:1pt solid #000;border-bottom:1pt solid #000}
    .right{text-align:right;font-family:monospace}
    .sig-area{margin-top:48px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px}
    .sig{text-align:center;border-top:1pt solid #000;padding-top:6px;font-size:9pt}
    @media print{button{display:none}}
  </style></head><body>
  <button onclick="window.print()" style="margin-bottom:16px;padding:8px 20px;font-size:13px">Imprimir / Salvar PDF</button>
  <h1>${g.nome}</h1>
  <h2>CNPJ ${g.cnpj} – ${g.endereco}</h2>
  <h2>DEMONSTRATIVO FINANCEIRO — ${MONTHS[m].toUpperCase()} ${state.year}</h2>
  <h3>(01/${mm}/${state.year} a ${dia}/${mm}/${state.year})</h3>
  <table>
    <tr><td class="section" colspan="2">1 — RECEITAS</td><td class="right section">${brl(totalR)}</td></tr>
    ${receitasHTML}
    <tr><td class="section" colspan="2">2 — DESPESAS</td><td class="right section">${brl(totalD)}</td></tr>
    ${getDespesasPorGrupo(m).map(grp=>`
      <tr><td colspan="2" class="section" style="font-weight:normal;font-size:9pt;padding-left:10px">${grp.nome}</td><td class="right section" style="font-weight:normal">${brl(grp.total)}</td></tr>
      ${grp.items.map(it=>`<tr><td colspan="2" style="padding-left:24px">${it.desc}</td><td class="right">${brl(it.valor)}</td></tr>`).join('')}
    `).join('')}
    <tr class="total"><td colspan="2"><strong>SALDO DO MÊS</strong></td><td class="right"><strong>${brl(saldo)}</strong></td></tr>
    <tr><td colspan="2">Saldo inicial (conta corrente)</td><td class="right">${brl(calcSaldoAnterior(m))}</td></tr>
    <tr class="total"><td colspan="2"><strong>SALDO FINAL EM CONTA</strong></td><td class="right"><strong>${brl(saldoFinal)}</strong></td></tr>
    <tr><td colspan="3" class="section">3 — ABERTURA DO SALDO — RESERVAS</td></tr>
    <tr><td colspan="2" style="padding-left:16px">Reserva Funcionário (Férias + 13º)</td><td class="right">${brl(reservaFunc)}</td></tr>
    <tr><td colspan="2" style="padding-left:16px">Reserva Taxa Extra</td><td class="right">${brl(reservaTaxa)}</td></tr>
    <tr class="total"><td colspan="2"><strong>Saldo Livre para Uso</strong></td><td class="right"><strong>${brl(saldoLivre)}</strong></td></tr>
  </table>
  <div class="sig-area">
    <div class="sig">${g.sindico}<br>Síndica</div>
    <div class="sig">${g.cons1||''}<br>Conselho Fiscal</div>
    <div class="sig">${g.cons2||''}<br>Conselho Fiscal</div>
  </div>
  <p style="margin-top:32px;font-size:9pt;color:#555">Recife, ${dia} de ${MONTHS[m].toLowerCase()} de ${state.year}.</p>
  </body></html>`);
}

// ==================== ORÇAMENTO ====================
function renderOrcamento(){
  const cats=[
    {id:'CD1',nome:'Recebimentos Mensais',previsto:4400,tipo:'FIXO',real:4400,aumento:false},
    {id:'CD5',nome:'Salário Mensal',previsto:1419.48,tipo:'FIXO',real:1419.48,aumento:true},
    {id:'CD9',nome:'Vale Alimentação',previsto:425,tipo:'FIXO',real:425,aumento:true},
    {id:'CD10',nome:'Vale Transporte',previsto:245.48,tipo:'MÁXIMO',real:207,aumento:false},
    {id:'CD11',nome:'INSS + PIS',previsto:644.83,tipo:'FIXO',real:534.16,aumento:true},
    {id:'CD14',nome:'CELPE (Energia)',previsto:169.32,tipo:'MÁXIMO',real:156.16,aumento:false},
    {id:'CD15',nome:'COMPESA',previsto:741.24,tipo:'MÁXIMO',real:741.24,aumento:true},
    {id:'CD16',nome:'Seguro Condomínio',previsto:220.99,tipo:'MÉDIA',real:220.99,aumento:false},
    {id:'CD17',nome:'Taxa Administração',previsto:190,tipo:'FIXO',real:190,aumento:false},
    {id:'CD20',nome:'SECOVI/SIECC/PE',previsto:55,tipo:'MÁXIMO',real:50,aumento:false}
  ];
  const tbody=document.getElementById('orcamento-tbody');
  tbody.innerHTML=cats.map(c=>{
    const diff=c.real-c.previsto;
    const cls=diff>0?'red':diff<0?'green':'';
    return`<tr>
      <td>${c.nome}</td>
      <td style="text-align:right"><span class="badge blue">${c.tipo}</span></td>
      <td class="tnum" style="text-align:right">${brl(c.previsto)}</td>
      <td class="tnum" style="text-align:right">${brl(c.real)}</td>
      <td class="tnum ${cls}" style="text-align:right;color:var(--${diff>0?'red':diff<0?'green':'text3'})">${diff!==0?(diff>0?'+':'')+brl(diff):'—'}</td>
      <td style="text-align:center"><span class="badge ${c.aumento?'green':'amber'}">${c.aumento?'Sim':'Não'}</span></td>
    </tr>`;
  }).join('');
}

// ==================== SIMULADOR ====================
// Categorias que NÃO entram no simulador (pontuais/não recorrentes)
const CATS_EXCLUIR_SIMULADOR = ['obras','obras-taxa','outros'];

const CATS_LABELS = {
  'sal-mensal':'Salário','sal-ferias':'Salário Férias','sal-13':'Salário 13º',
  'sal-cob':'Cobertura Férias','vale-al':'Vale Alimentação','vale-tr':'Vale Transporte',
  'inss':'INSS + PIS','fgts':'FGTS','celpe':'CELPE','compesa':'COMPESA',
  'seguro':'Seguro','adm':'Adm. Condomínio','secovi':'SECOVI/SIECC',
  'agua':'Água','limpeza':'Limpeza','outros':'Outros','obras':'Obras','obras-taxa':'Obras (taxa extra)'
};

function importarDespesasSimulador(){
  // Pega os meses fechados do ano atual e calcula média das despesas recorrentes
  const bal = state.balancetes[state.year] || {};
  const mesesFechados = [];

  for(let i = 0; i <= 11; i++){
    if(bal[i]?.fechado) mesesFechados.push(i);
  }

  if(mesesFechados.length === 0){
    const detalhe = document.getElementById('sim-despesas-detalhe');
    if(detalhe) detalhe.innerHTML = '<span style="color:var(--amber)">Nenhum mês fechado — preencha o valor manualmente.</span>';
    calcSimulador();
    return;
  }

  // Agrupa despesas recorrentes por categoria, excluindo obras
  const totalPorCat = {};
  mesesFechados.forEach(m => {
    (bal[m].despesas || []).forEach(d => {
      if(CATS_EXCLUIR_SIMULADOR.includes(d.categoria)) return; // ignora obras
      totalPorCat[d.categoria] = (totalPorCat[d.categoria] || 0) + Number(d.valor || 0);
    });
  });

  const n = mesesFechados.length;
  const mediaPorCat = {};
  let totalMedio = 0;
  Object.entries(totalPorCat).forEach(([cat, total]) => {
    mediaPorCat[cat] = total / n;
    totalMedio += total / n;
  });

  // Preenche o campo
  const el = document.getElementById('sim-despesas');
  if(el) el.value = totalMedio.toFixed(2);

  // Mostra detalhamento
  const detalhe = document.getElementById('sim-despesas-detalhe');
  if(detalhe){
    const linhas = Object.entries(mediaPorCat)
      .sort((a,b) => b[1]-a[1])
      .map(([cat, val]) => `${CATS_LABELS[cat]||cat}: ${brl(val)}`)
      .join(' · ');
    detalhe.innerHTML = `<span style="color:var(--green);font-weight:500">✓ Média de ${n} mês${n>1?'es':''} fechado${n>1?'s':''}</span> · ${linhas}<br><span style="color:var(--amber)">⚠ Obras excluídas do cálculo</span>`;
  }

  calcSimulador();
}

function calcSimulador(){
  // Auto-popula campos com dados reais na primeira vez que abre
  const elUnid  = document.getElementById('sim-unidades');
  const elTaxa  = document.getElementById('sim-taxa-atual');
  const elDesp  = document.getElementById('sim-despesas');
  if(!elUnid || !elTaxa || !elDesp) return;

  // Se ainda estão com valores padrão, popula com dados reais
  if(elUnid.value === '11' || elUnid.dataset.auto !== '1'){
    const pagantes = (state.condominos||[]).filter(c => c.status !== 'Isento').length || 11;
    elUnid.value = pagantes;
    elUnid.dataset.auto = '1';
  }
  if(elTaxa.value === '400' || elTaxa.dataset.auto !== '1'){
    const taxas = (state.condominos||[]).filter(c => c.status !== 'Isento' && c.taxa > 0).map(c => c.taxa);
    const taxaMedia = taxas.length ? taxas.reduce((a,b)=>a+b,0)/taxas.length : 450;
    elTaxa.value = taxaMedia.toFixed(2);
    elTaxa.dataset.auto = '1';
  }
  if(elDesp.value === '5238' || elDesp.dataset.auto !== '1'){
    elDesp.dataset.auto = '1'; // marca antes para evitar loop
    importarDespesasSimulador();
    return; // importar já chama calcSimulador no final
  }

  const unidades = parseInt(elUnid.value) || 11;
  const taxaAtual = parseFloat(elTaxa.value) || 450;
  const despesas  = parseFloat(elDesp.value) || 5238;
  const margem    = parseFloat(document.getElementById('sim-margem')?.value||5)/100;

  const taxaMinima     = despesas / unidades;
  const taxaComMargem  = taxaMinima * (1 + margem);
  const recAtual       = unidades * taxaAtual;
  const deficit        = recAtual - despesas;

  const cenarios = [
    {nome:'Mínimo (cobrir despesas)',       valor:taxaMinima,    pct:((taxaMinima/taxaAtual-1)*100)},
    {nome:`Recomendado (+ margem ${Math.round(margem*100)}%)`, valor:taxaComMargem, pct:((taxaComMargem/taxaAtual-1)*100)},
    {nome:'Conservador (+5%)',              valor:taxaAtual*1.05,pct:5},
    {nome:'Moderado (+10%)',                valor:taxaAtual*1.10,pct:10}
  ];

  const cenDiv = document.getElementById('sim-cenarios');
  if(!cenDiv) return;
  cenDiv.innerHTML = cenarios.map(c=>`
    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;background:var(--surface2);border-radius:8px;margin-bottom:8px">
      <div>
        <div style="font-size:13px;font-weight:500">${c.nome}</div>
        <div style="font-size:11px;color:var(--text3)">${c.pct>=0?'+':''}${c.pct.toFixed(1)}% em relação à taxa atual</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:15px;font-weight:600;font-family:var(--mono)">${brl(c.valor)}</div>
        <div style="font-size:11px;color:var(--text3)">${brl(unidades*c.valor)}/mês</div>
      </div>
    </div>`).join('');

  const resDiv = document.getElementById('sim-resultado');
  if(!resDiv) return;
  resDiv.innerHTML = `
    <div style="margin-bottom:16px">
      <div style="font-size:12px;color:var(--text3);margin-bottom:4px">Situação atual</div>
      <div style="padding:12px;background:var(--surface2);border-radius:8px">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-size:13px">Receita atual/mês</span><span style="font-family:var(--mono)">${brl(recAtual)}</span></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-size:13px">Despesa prevista/mês</span><span style="font-family:var(--mono);color:var(--red)">${brl(despesas)}</span></div>
        <div style="display:flex;justify-content:space-between;font-weight:600;border-top:1px solid var(--border);padding-top:6px"><span style="font-size:13px">Superávit / Déficit</span><span style="font-family:var(--mono);color:${deficit>=0?'var(--green)':'var(--red)'}">${brl(deficit)}</span></div>
      </div>
    </div>
    <div>
      <div style="font-size:12px;color:var(--text3);margin-bottom:4px">Taxa mínima necessária</div>
      <div style="font-size:28px;font-weight:600;font-family:var(--mono);color:var(--accent)">${brl(taxaMinima)}</div>
      <div style="font-size:12px;color:var(--text3)">Para cobrir exatamente as despesas</div>
    </div>`;
}

function exportSimulador(){
  const unidades=parseInt(document.getElementById('sim-unidades').value||11);
  const despesas=parseFloat(document.getElementById('sim-despesas').value||5238);
  const taxa=parseFloat(document.getElementById('sim-taxa-atual').value||400);
  const win=window.open('','_blank');
  win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Simulação de Taxa</title><style>body{font-family:Arial;max-width:700px;margin:0 auto;padding:20px;font-size:11pt}h1{font-size:13pt;text-align:center}table{width:100%;border-collapse:collapse}td,th{padding:6px 10px;border:1pt solid #ccc}@media print{button{display:none}}</style></head><body>
  <button onclick="window.print()">Imprimir / PDF</button>
  <h1>${state.gestao.nome}</h1><h2 style="text-align:center;font-size:11pt">SIMULAÇÃO DE TAXA DE CONDOMÍNIO — ${state.year}</h2>
  <table><tr><th>Cenário</th><th>Taxa/Unid.</th><th>Receita Total</th><th>Aumento</th></tr>
  <tr><td>Taxa atual</td><td>${brl(taxa)}</td><td>${brl(taxa*unidades)}</td><td>—</td></tr>
  <tr><td>Mínimo (cobrir despesas)</td><td>${brl(despesas/unidades)}</td><td>${brl(despesas)}</td><td>${((despesas/unidades/taxa-1)*100).toFixed(1)}%</td></tr>
  <tr><td>Recomendado (+5%)</td><td>${brl(despesas/unidades*1.05)}</td><td>${brl(despesas/unidades*1.05*unidades)}</td><td>${((despesas/unidades*1.05/taxa-1)*100).toFixed(1)}%</td></tr>
  </table></body></html>`);
}

// ==================== RESERVA ====================
function renderReserva(){
  const reservaMes = calcReservaMensal();

  // Reserva funcionário — cumulativa mês a mês, sem desconto em Janeiro
  const tbody = document.getElementById('reserva-func-tbody');
  let acum = 0;
  tbody.innerHTML = MONTHS.map((mes, i) => {
    acum += reservaMes;
    let saida = 0, evento = '';
    if(i > 0){
      const b = state.balancetes[state.year]?.[i];
      if(b && b.despesas){
        b.despesas.forEach(d=>{
          if(d.categoria==='sal-ferias'||d.categoria==='sal-13'){
            saida += Number(d.valor||0); acum -= Number(d.valor||0);
          }
        });
        if(saida > 0) evento = 'Pagamento Férias/13º';
      }
    }
    const badge = state.balancetes[state.year]?.[i]?.fechado ? '<span class="badge green" style="font-size:10px">Fechado</span>' : '';
    const cor = acum < 0 ? 'var(--red)' : 'var(--text)';
    return `<tr>
      <td>${mes} ${badge}</td>
      <td class="tnum" style="color:var(--green)">${brl(reservaMes)}</td>
      <td class="tnum" style="color:${saida>0?'var(--red)':'var(--text3)'}">${saida>0?brl(saida):'—'}</td>
      <td class="tnum" style="color:${cor};font-weight:${acum<0?'600':'400'}">${brl(acum)}</td>
      <td style="font-size:12px;color:var(--text3)">${evento}</td>
    </tr>`;
  }).join('');

  // Reserva taxa extra — acumula receitas isReserva:true, deduz obras-taxa
  const tbody2 = document.getElementById('reserva-taxa-tbody');
  tbody2.innerHTML = state.taxasExtras.map(t => `
    <tr>
      <td>${t.desc}</td>
      <td class="tnum" style="text-align:right">${brl(t.valorUnit * t.parcelas)}</td>
      <td style="text-align:right">${t.parcelas}</td>
      <td class="tnum" style="text-align:right;color:var(--green)">${brl(t.arrecadado)}</td>
      <td class="tnum" style="text-align:right;color:var(--red)">${brl(t.usado)}</td>
      <td class="tnum" style="text-align:right;font-weight:600">${brl(t.arrecadado - t.usado)}</td>
    </tr>`).join('');
}

function saveTaxaExtra(){
  state.taxasExtras.push({
    desc:document.getElementById('te-desc').value,
    valorUnit:parseFloat(document.getElementById('te-valor').value)||0,
    parcelas:parseInt(document.getElementById('te-parcelas').value)||1,
    inicio:document.getElementById('te-inicio').value,
    arrecadado:0,usado:0
  });
  save();closeModal('modal-add-taxa-extra');renderReserva();
}

// ==================== ENCARGOS ====================
function calcEncargos(){
  const sal    = parseFloat(document.getElementById('enc-salario')?.value || 1639.05);
  const va     = parseFloat(document.getElementById('enc-va')?.value     || 455);
  const cob    = parseFloat(document.getElementById('enc-cob')?.value    || 50);
  const inssPct= parseFloat(document.getElementById('enc-inss-pct')?.value || 33.015) / 100;
  const fgtsPct= parseFloat(document.getElementById('enc-fgts-pct')?.value || 8)      / 100;

  // ── Custo mensal ──
  const inssEmp    = sal * 0.08;
  const salLiq     = sal - inssEmp;
  const inssPatr   = sal * inssPct;
  const fgtsPatr   = sal * fgtsPct;
  const pis        = sal * 0.01;
  const custoMensal = salLiq + va + cob + inssPatr + fgtsPatr + pis;

  // ── Reserva: encargos sobre SALÁRIO BRUTO, sem VA/VT/cobertura ──
  // Nota: para férias e 13º o Excel usa INSS 33% (arredondado), não 33,015%
  const inssPctR = 0.33;
  // FÉRIAS:
  //   Rec. líquido = salLiq + 1/3bruto - INSS_emp_1/3
  //   Enc. condo   = (FGTS+INSS+PIS adiant. sobre bruto) + (FGTS+INSS+PIS sobre 1/3 bruto)
  const terco          = sal / 3;
  const inssEmpTerco   = terco * 0.08;
  const recLiqFerias   = salLiq + terco - inssEmpTerco;
  const encFerias      = sal*fgtsPct + sal*inssPctR + sal*0.01
                       + terco*fgtsPct + terco*inssPctR + terco*0.01;
  const custoFerias    = recLiqFerias + encFerias;         // = 2.928,44

  // 13º:  Rec. líquido = salLiq, Enc = FGTS+INSS+PIS sobre bruto
  const enc13   = sal*fgtsPct + sal*inssPctR + sal*0.01;
  const custo13 = salLiq + enc13;                          // = 2.196,33

  // Reserva mensal = (Férias + 13º) ÷ 12  → R$ 427,06
  const reservaMes = (custoFerias + custo13) / 12;

  const res = document.getElementById('enc-resultado');
  if(!res) return;
  res.innerHTML = `<div class="card-title" style="margin-bottom:16px">Resumo de Encargos ${state.year}</div>
  <div style="display:flex;flex-direction:column;gap:0">
    <div style="font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;padding:6px 0 4px">Custo Mensal</div>
    ${[
      ['Salário bruto', brl(sal), ''],
      ['− INSS empregado (8%)', '−'+brl(inssEmp), ''],
      ['= Salário líquido', brl(salLiq), '600'],
      ['Vale Alimentação', brl(va), ''],
      ['Cobertura Social', brl(cob), ''],
      ['INSS patronal ('+Math.round(inssPct*1000)/10+'%)', brl(inssPatr), ''],
      ['FGTS ('+Math.round(fgtsPct*100)+'%)', brl(fgtsPatr), ''],
      ['PIS (1%)', brl(pis), ''],
    ].map(([k,v,w])=>`<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border);font-size:13px;font-weight:${w||'400'}"><span style="color:var(--text2)">${k}</span><span style="font-family:var(--mono)">${v}</span></div>`).join('')}
    <div style="display:flex;justify-content:space-between;padding:8px 0;font-weight:600;font-size:14px;border-top:2px solid var(--border2);margin-bottom:14px">
      <span>Custo Total/Mês</span><span style="font-family:var(--mono);color:var(--accent)">${brl(custoMensal)}</span>
    </div>
    <div style="font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:.06em;padding:6px 0 4px">Provisão para Reserva (só sobre salário bruto)</div>
    ${[
      ['Férias (rec.líq. + enc. adiant. + enc. 1/3 bruto)', brl(custoFerias), ''],
      ['13º Salário (sal.líq. + FGTS+INSS+PIS sobre bruto)', brl(custo13), ''],
    ].map(([k,v])=>`<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border);font-size:13px"><span style="color:var(--text2)">${k}</span><span style="font-family:var(--mono)">${v}</span></div>`).join('')}
    <div style="font-size:12px;color:var(--text3);padding:4px 0 6px">÷ 12 meses de depósito (convenção)</div>
    <div style="display:flex;justify-content:space-between;padding:10px 12px;font-weight:600;font-size:14px;background:var(--amber-light);border-radius:8px;margin-top:4px">
      <span style="color:var(--amber)">Reserva Mensal (Férias+13º)÷12</span>
      <span style="font-family:var(--mono);color:var(--amber)">${brl(reservaMes)}</span>
    </div>
    <div style="font-size:11px;color:var(--text3);margin-top:6px">VA (${brl(va)}), VT e SECOVI não entram na reserva — são pagos mensalmente.</div>
  </div>`;

  state.encargos = {salario:sal, va, cobSocial:cob, inssPct:inssPct*100, fgtsPct:fgtsPct*100};
  renderEncReserva(reservaMes, custoFerias, custo13);
}

function renderEncReserva(reservaMes, custoFerias, custo13){
  const tbody = document.getElementById('enc-reserva-tbody');
  if(!tbody) return;
  let acum = 0;
  tbody.innerHTML = MONTHS.map((mes, i) => {
    acum += reservaMes;
    let saida = 0, evento = '';
    if(i > 0){
      const b = state.balancetes[state.year]?.[i];
      if(b && b.despesas){
        b.despesas.forEach(d=>{
          if(d.categoria==='sal-ferias'||d.categoria==='sal-13'){
            saida += Number(d.valor||0); acum -= Number(d.valor||0);
          }
        });
        if(saida > 0) evento = 'Pagamento Férias/13º';
      }
    }
    const cor = acum < 0 ? 'var(--red)' : 'var(--text)';
    return `<tr>
      <td>${mes}</td>
      <td class="tnum">${brl(reservaMes)}</td>
      <td class="tnum" style="color:var(--green)">${brl(reservaMes)}</td>
      <td class="tnum" style="color:${saida>0?'var(--red)':'var(--text3)'}">${saida>0?brl(saida):'—'}</td>
      <td class="tnum" style="color:${cor};font-weight:${acum<0?'600':'400'}">${brl(acum)}</td>
      <td style="font-size:12px;color:var(--text3)">${evento}</td>
    </tr>`;
  }).join('');
}

function calcPrevEncargos(){
  const pct=parseFloat(document.getElementById('enc-aumento')?.value||9.9999)/100;
  const sal=state.encargos.salario*(1+pct);
  const va=state.encargos.va*(1+pct);
  const div=document.getElementById('enc-prev-resultado');
  if(!div)return;
  div.innerHTML=`<div style="margin-top:16px;padding:16px;background:var(--surface2);border-radius:10px">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div><div style="font-size:12px;color:var(--text3)">Novo salário</div><div style="font-size:18px;font-weight:600;font-family:var(--mono)">${brl(sal)}</div></div>
      <div><div style="font-size:12px;color:var(--text3)">Novo vale alim.</div><div style="font-size:18px;font-weight:600;font-family:var(--mono)">${brl(va)}</div></div>
    </div>
    <div style="margin-top:12px;font-size:12px;color:var(--text3)">Custo total estimado/mês 2027: <strong style="color:var(--text)">${brl(sal*(1+0.33015+0.08+0.01)+va)}</strong></div>
  </div>`;
}

// ==================== VT ====================
function renderVT(){
  const valor=parseFloat(document.getElementById('vt-valor')?.value||4.5);
  const qtd=parseInt(document.getElementById('vt-qtd')?.value||2);
  const tbody=document.getElementById('vt-tbody');
  if(!tbody)return;
  tbody.innerHTML=MONTHS.map((mes,i)=>{
    const total=getDaysInMonth(state.year,i);
    const wknd=getWeekend(state.year,i);
    const fer=getFeriadosMes(state.year,i);
    const uteis=total-wknd-fer;
    const vtVal=uteis*qtd*valor;
    return`<tr>
      <td>${mes}</td>
      <td class="tnum" style="text-align:right">${total-wknd}</td>
      <td class="tnum" style="text-align:right;color:var(--red)">${fer}</td>
      <td class="tnum" style="text-align:right;font-weight:600">${uteis}</td>
      <td class="tnum" style="text-align:right;color:var(--accent2)">${brl(vtVal)}</td>
      <td><span class="badge blue">Previsto</span></td>
    </tr>`;
  }).join('');
}

function calcVT(){renderVT();}

// ==================== IMPORTAÇÃO DE EXTRATO BANCÁRIO ====================
const CATEGORIAS_RECEITA_EXTRATO=[
  {v:'taxa-mensal',l:'Taxa Mensal'},
  {v:'taxa-extra',l:'Taxa Extra'},
  {v:'atraso',l:'Recebimento em Atraso'},
  {v:'outras',l:'Outras Receitas'}
];
const CATEGORIAS_DESPESA_EXTRATO=[
  {v:'sal-mensal',l:'Salário Funcionário (quinzena/férias/13º)'},
  {v:'vale-al',l:'Vale Alimentação'},
  {v:'vale-tr',l:'Vale Transporte'},
  {v:'inss',l:'INSS/PIS'},
  {v:'fgts',l:'FGTS'},
  {v:'celpe',l:'CELPE (Energia)'},
  {v:'compesa',l:'COMPESA (Água/Esgoto)'},
  {v:'seguro',l:'Seguro Condomínio'},
  {v:'adm',l:'Taxa Administração'},
  {v:'secovi',l:'SECOVI/Sindical'},
  {v:'agua',l:'Água (galão)'},
  {v:'obras',l:'Obras e Manutenção'},
  {v:'outros',l:'Outras Despesas'}
];

let extratoRows=[];

function abrirModalImportarExtrato(){
  showModal('modal-importar-extrato'); // já dispara resetModalImportarExtrato() (ver ui.js)
}

function normalizarTextoExtrato(s){
  return (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
}

const STOPWORDS_NOME_EXTRATO=new Set(['de','da','do','das','dos','e','ltda','me','sa','s.a','eireli','administradora','associacao','condominio']);
function algumaPalavraBate(nomeCadastro,txtNormalizado){
  const palavras=normalizarTextoExtrato(nomeCadastro).split(/[^a-z0-9]+/).filter(p=>p.length>=4 && !STOPWORDS_NOME_EXTRATO.has(p));
  if(!palavras.length) return false;
  // só a 1ª palavra significativa (geralmente o primeiro nome) — evita falso positivo
  // com sobrenomes comuns (ex.: "Silva") batendo em pessoas diferentes
  return txtNormalizado.includes(palavras[0]);
}

function ehCategoriaSalario(cat){ return cat==='sal-mensal'||cat==='sal-ferias'||cat==='sal-13'; }

function parseDataBRparaISO(dataBR){
  // "27/07/2026" -> "2026-07-27"
  const m=(dataBR||'').trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if(!m) return '';
  return `${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`;
}

// { ano, mes(0-based) } deslocado por delta meses
function mesAnoAdd(ano,mesIdx,delta){
  let m=mesIdx+delta, a=ano;
  while(m<0){m+=12;a-=1;}
  while(m>11){m-=12;a+=1;}
  return {ano:a,mes:m};
}
function fmtPeriodo(ano,mesIdx){ return `${String(mesIdx+1).padStart(2,'0')}/${ano}`; }

function resetModalImportarExtrato(){
  extratoRows=[];
  document.getElementById('extrato-step-upload').style.display='';
  document.getElementById('extrato-step-validacao').style.display='none';
  document.getElementById('extrato-footer-validacao').style.display='none';
  document.getElementById('extrato-loading').style.display='none';
  document.getElementById('extrato-erro').style.display='none';
  const fi=document.getElementById('extrato-file-input');
  if(fi) fi.value='';
  const alvoEl=document.getElementById('extrato-mes-alvo');
  if(alvoEl) alvoEl.textContent=`${MONTHS[state.currentMonth]}/${state.year}`;
}

function mostrarErroExtrato(msg){
  const erroEl=document.getElementById('extrato-erro');
  erroEl.textContent=msg;
  erroEl.style.display='block';
  document.getElementById('extrato-loading').style.display='none';
}

function processarExtratoArquivo(file){
  if(!file) return;
  document.getElementById('extrato-erro').style.display='none';
  document.getElementById('extrato-loading').style.display='block';

  const nome=file.name.toLowerCase();
  if(!nome.endsWith('.csv')){
    mostrarErroExtrato('Por enquanto só é possível importar o extrato em CSV. No app do banco/Cora, exporte o extrato do período como CSV (em vez de PDF) e envie esse arquivo aqui.');
    return;
  }

  const reader=new FileReader();
  reader.onload=e=>{
    try{
      const texto=e.target.result.replace(/^\uFEFF/,''); // remove BOM se houver
      const transacoes=parseCSVExtrato(texto);
      transacoes.sort((a,b)=>parseDataBRparaISO(a.data).localeCompare(parseDataBRparaISO(b.data)));
      if(!transacoes.length){
        mostrarErroExtrato('Não encontrei nenhuma transação nesse arquivo. Confira se é o CSV correto exportado do banco.');
        return;
      }
      const ctx={contadorSalario:{}, contadorTaxaExtra:{}, parcelaSeguro:sugerirParcelaSeguro()};
      extratoRows=transacoes.map(t=>sugerirLancamento(t,ctx));
      extratoRows=ordenarExtratoRows(extratoRows);
      renderExtratoTable();
      document.getElementById('extrato-step-upload').style.display='none';
      document.getElementById('extrato-step-validacao').style.display='';
      document.getElementById('extrato-footer-validacao').style.display='flex';
      document.getElementById('extrato-count').textContent=extratoRows.length;

      const barraParcela=document.getElementById('extrato-parcela-massa-bar');
      const primeiraTaxaExtra=extratoRows.find(r=>r.categoria==='taxa-extra');
      if(primeiraTaxaExtra){
        barraParcela.style.display='flex';
        document.getElementById('extrato-parcela-massa-atual').value=primeiraTaxaExtra.extra.parcelaAtual||1;
        document.getElementById('extrato-parcela-massa-total').value=primeiraTaxaExtra.extra.parcelaTotal||1;
      }else{
        barraParcela.style.display='none';
      }
    }catch(err){
      mostrarErroExtrato('Não consegui ler esse arquivo: '+err.message);
    }
  };
  reader.onerror=()=>mostrarErroExtrato('Erro ao ler o arquivo.');
  reader.readAsText(file,'UTF-8');
}

function parseCSVExtrato(texto){
  const linhas=texto.split(/\r?\n/).filter(l=>l.trim().length);
  if(linhas.length<2) return [];
  const out=[];
  for(let i=1;i<linhas.length;i++){
    const campos=linhas[i].split(',');
    if(campos.length<5) continue;
    const [data,transacao,tipo,identificacao,valorStr]=[
      campos[0], campos[1], campos[2], campos[3], campos.slice(4).join(',')
    ];
    const valor=parseFloat(valorStr.replace(',','.'));
    if(!data || isNaN(valor)) continue;
    out.push({
      data:data.trim(),
      transacao:(transacao||'').trim(),
      tipo:(tipo||'').trim().toUpperCase(),
      identificacao:(identificacao||'').trim(),
      valor
    });
  }
  return out;
}

// --- Auxiliares de sugestão (parcelas/contadores) ---
function sugerirParcelaSeguro(){
  let melhorMes=-1, atual=0, total=10;
  const anos=state.balancetes[state.year]||{};
  Object.keys(anos).forEach(mIdx=>{
    const idx=Number(mIdx);
    if(idx>=state.currentMonth) return;
    const b=anos[mIdx];
    (b.despesas||[]).forEach(d=>{
      if(d.categoria==='seguro'){
        const mm=(d.desc||'').match(/parcela\s*(\d+)\/(\d+)/i);
        if(mm && idx>melhorMes){ melhorMes=idx; atual=parseInt(mm[1]); total=parseInt(mm[2]); }
      }
    });
  });
  return {parcelaAtual:melhorMes>=0?atual+1:1, parcelaTotal:total};
}

function contarTaxaExtraHistorico(unidade,descTaxa){
  let count=0;
  const anos=state.balancetes[state.year]||{};
  Object.keys(anos).forEach(mIdx=>{
    if(Number(mIdx)>=state.currentMonth) return;
    const b=anos[mIdx];
    (b.receitas||[]).forEach(r=>{
      if(r.categoria==='taxa-extra' && r.unidade===unidade && (r.desc||'').startsWith(descTaxa)) count++;
    });
  });
  return count;
}

// Ordem igual à do balancete: 1.1 Taxa mensal, 1.2 Taxa extra, 1.3 Atraso, 1.4 Outras,
// depois despesas: 2.1 Funcionário, 2.2 Recorrentes, 2.4 Sindicais, 2.5 Diversas, 2.6 Obras
const ORDEM_CATEGORIA_EXTRATO={
  'taxa-mensal':0, 'taxa-extra':1, 'atraso':2, 'outras':3,
  'sal-mensal':4,'sal-ferias':4,'sal-13':4,'sal-cob':4,'vale-al':4,'vale-tr':4,'inss':4,'fgts':4,
  'celpe':5,'compesa':5,'seguro':5,'adm':5,
  'secovi':6,
  'agua':7,'limpeza':7,'outros':7,
  'obras':8,'obras-taxa':8
};
function ordenarExtratoRows(rows){
  return rows.map((r,idx)=>({r,idx})).sort((a,b)=>{
    const oa=ORDEM_CATEGORIA_EXTRATO[a.r.categoria]??9;
    const ob=ORDEM_CATEGORIA_EXTRATO[b.r.categoria]??9;
    return oa!==ob ? oa-ob : a.idx-b.idx; // estável dentro do mesmo grupo
  }).map(x=>x.r);
}

function aplicarParcelaEmMassa(){
  const atual=parseInt(document.getElementById('extrato-parcela-massa-atual').value)||1;
  const total=parseInt(document.getElementById('extrato-parcela-massa-total').value)||1;
  extratoRows.forEach(r=>{
    if(r.categoria==='taxa-extra'){
      r.extra.parcelaAtual=atual;
      r.extra.parcelaTotal=total;
      r.desc=montarDescricaoReceita(r);
    }
  });
  renderExtratoTable();
}

// --- Sugestão inicial por linha ---
function sugerirLancamento(t,ctx){
  const isReceita=t.tipo.includes('CR')||t.valor>0; // CRÉDITO
  const dataISO=parseDataBRparaISO(t.data);
  const base={
    incluir:true,
    dataISO,
    tipo:isReceita?'receita':'despesa',
    valor:Math.abs(t.valor),
    origemTexto:`${t.transacao} — ${t.identificacao}`
  };
  const extra=isReceita?sugerirReceita(t,ctx):sugerirDespesa(t,ctx);
  const row=Object.assign(base,extra);
  row.desc=row.tipo==='receita'?montarDescricaoReceita(row):montarDescricaoDespesa(row);
  return row;
}

function sugerirReceita(t,ctx){
  const m=t.identificacao.match(/Apto\s*(\d+)/i);
  const unidade=m?m[1]:'';
  const condomino=state.condominos.find(c=>c.apto===unidade);
  const periodoAtual=fmtPeriodo(state.year,state.currentMonth);

  if(!condomino){
    return {categoria:'outras', unidade:'', extra:{manualDesc:t.identificacao||t.transacao}};
  }

  // Candidatos: taxa mensal da unidade + cada taxa extra ativa — aceita até 50% a mais (multa/juros)
  const candidatos=[];
  if(condomino.taxa>0) candidatos.push({tipo:'taxa-mensal', base:Number(condomino.taxa), ref:null});
  (state.taxasExtras||[]).forEach(te=>candidatos.push({tipo:'taxa-extra', base:Number(te.valorUnit||0), ref:te}));

  let melhor=null, melhorDiff=Infinity;
  candidatos.forEach(c=>{
    if(c.base<=0) return;
    if(t.valor < c.base-0.02) return;
    if(t.valor > c.base*1.5) return;
    const diff=t.valor-c.base;
    if(diff<melhorDiff){ melhorDiff=diff; melhor=c; }
  });

  if(melhor){
    const comMulta=melhorDiff>0.02;
    if(melhor.tipo==='taxa-mensal'){
      return {categoria:'taxa-mensal', unidade, extra:{periodo:periodoAtual, multa:comMulta}};
    }
    const chave=`${unidade}::${melhor.ref.desc}`;
    if(ctx.contadorTaxaExtra[chave]===undefined) ctx.contadorTaxaExtra[chave]=contarTaxaExtraHistorico(unidade,melhor.ref.desc);
    ctx.contadorTaxaExtra[chave]++;
    const parcelaAtual=Math.min(ctx.contadorTaxaExtra[chave], melhor.ref.parcelas||ctx.contadorTaxaExtra[chave]);
    return {categoria:'taxa-extra', unidade, extra:{descTaxa:melhor.ref.desc, parcelaAtual, parcelaTotal:melhor.ref.parcelas, multa:comMulta, reserva:true}};
  }

  if(condomino.status==='Inadimplente'){
    return {categoria:'atraso', unidade, extra:{manualDesc:`Recebimento em atraso — Apto ${unidade}`}};
  }
  return {categoria:'outras', unidade, extra:{manualDesc:`Apto ${unidade} — ${t.transacao}`}};
}

function sugerirDespesa(t,ctx){
  const txt=normalizarTextoExtrato(t.transacao+' '+t.identificacao);
  const periodoAtual=fmtPeriodo(state.year,state.currentMonth);
  const ant=mesAnoAdd(state.year,state.currentMonth,-1);
  const periodoAnterior=fmtPeriodo(ant.ano,ant.mes);
  const prox=mesAnoAdd(state.year,state.currentMonth,1);
  const periodoSeguinte=fmtPeriodo(prox.ano,prox.mes);

  if(/pluxee/.test(txt)) return {categoria:'vale-al', unidade:'', extra:{tipoVale:'normal', periodo:periodoSeguinte}};
  if(/vale transporte|sind das emp de transp/.test(txt)) return {categoria:'vale-tr', unidade:'', extra:{tipoVale:'normal', periodo:periodoSeguinte}};
  if(/caixa economica federal/.test(txt)) return {categoria:'fgts', unidade:'', extra:{periodo:periodoAnterior, referente:'nenhum'}};
  if(/darf/.test(txt)) return {categoria:'inss', unidade:'', extra:{periodo:periodoAnterior, referente:'nenhum'}};
  if(/sind emp vend|secovi/.test(txt)) return {categoria:'secovi', unidade:'', extra:{periodo:periodoAtual}};
  if(/tokio marine|segurad/.test(txt)){ const p=ctx.parcelaSeguro; return {categoria:'seguro', unidade:'', extra:{parcelaAtual:p.parcelaAtual, parcelaTotal:p.parcelaTotal}}; }
  if(/compesa/.test(txt)) return {categoria:'compesa', unidade:'', extra:{periodo:periodoAnterior, consumo:''}};
  if(/celpe|companhia ene/.test(txt)) return {categoria:'celpe', unidade:'', extra:{periodo:periodoAnterior, consumo:''}};
  if(/leo agua|deposito de bebidas/.test(txt)) return {categoria:'agua', unidade:'', extra:{}};
  if(/andrezza/.test(txt)) return {categoria:'adm', unidade:'', extra:{periodo:periodoAtual}};
  if(/tarifa|saque/.test(txt)) return {categoria:'outros', unidade:'', extra:{manualDesc:'Tarifa/saque bancário'}};
  if(/compra no debito/.test(txt)) return {categoria:'outros', unidade:'', extra:{manualDesc:'Compra no débito'}};

  const func=(state.funcionarios||[]).find(f=>f.nome && algumaPalavraBate(f.nome,txt));
  if(func){
    ctx.contadorSalario[func.nome]=(ctx.contadorSalario[func.nome]||0)+1;
    const n=ctx.contadorSalario[func.nome];
    const tipoSal=n===1?'q1':n===2?'q2':'complemento';
    return {categoria:'sal-mensal', unidade:'', extra:{tipoSal, periodo:periodoAtual, referente:'nenhum'}};
  }

  const forn=(state.fornecedores||[]).find(f=>f.nome && algumaPalavraBate(f.nome,txt));
  if(forn){
    const servTxt=normalizarTextoExtrato(forn.servico||'');
    if(/administra|funcionari|contabil|folha/.test(servTxt)) return {categoria:'adm', unidade:'', extra:{periodo:periodoAtual}};
    if(/obra|manuten|reparo|reforma/.test(servTxt)) return {categoria:'obras', unidade:'', extra:{manualDesc:`${forn.nome} — ${forn.servico||''}`}};
    return {categoria:'outros', unidade:'', extra:{manualDesc:`${forn.nome} — ${forn.servico||''}`}};
  }

  return {categoria:'outros', unidade:'', extra:{manualDesc:`${t.transacao} — ${t.identificacao}`}};
}

// --- Monta descrição a partir de categoria + campos extras ---
function montarDescricaoDespesa(row){
  const ex=row.extra||{};
  if(ehCategoriaSalario(row.categoria)){
    const tipoLabel=ex.tipoSal==='q1'?'1ª quinzena':ex.tipoSal==='q2'?'2ª quinzena':'Complemento por aumento';
    const nome=ex.referente==='ferias'?'Férias':ex.referente==='13'?'13º Salário':'Salários';
    return `${nome} - ${tipoLabel} (${ex.periodo||''})`;
  }
  const sufixo=ex.referente==='ferias'?' — Férias':ex.referente==='13'?' — 13º Salário':'';
  switch(row.categoria){
    case 'inss': return `INSS e PIS (${ex.periodo||''})${sufixo}`;
    case 'fgts': return `FGTS (${ex.periodo||''})${sufixo}`;
    case 'vale-al': return `Vale alimentação${ex.tipoVale==='complemento'?' - complemento por aumento':''} (${ex.periodo||''})`;
    case 'vale-tr': return `Vale transporte${ex.tipoVale==='complemento'?' - complemento por aumento':''} (${ex.periodo||''})`;
    case 'seguro': return `Seguro condomínio (parcela ${ex.parcelaAtual||'?'}/${ex.parcelaTotal||10})`;
    case 'adm': return `Taxa administração (${ex.periodo||''})`;
    case 'celpe': return `CELPE (${ex.periodo||''})${ex.consumo?` - consumo: ${ex.consumo} KWh`:''}`;
    case 'compesa': return `COMPESA (${ex.periodo||''})${ex.consumo?` - consumo: ${ex.consumo} m³`:''}`;
    case 'agua': return 'Água (galão)';
    case 'secovi': return `SECOVI/SIECC/PE (${ex.periodo||''})`;
    default: return ex.manualDesc!==undefined?ex.manualDesc:(row.desc||'');
  }
}

function montarDescricaoReceita(row){
  const ex=row.extra||{};
  if(row.categoria==='taxa-mensal') return `Taxa mensal ${ex.periodo||''}`+(ex.multa?' (paga com multa)':'');
  if(row.categoria==='taxa-extra') return `${ex.descTaxa||''} - Parcela ${ex.parcelaAtual||'?'}/${ex.parcelaTotal||'?'}`+(ex.multa?' (paga com multa)':'');
  return ex.manualDesc!==undefined?ex.manualDesc:(row.desc||'');
}

// --- Extra padrão ao trocar a categoria manualmente ---
function extraPadrao(categoria){
  const periodoAtual=fmtPeriodo(state.year,state.currentMonth);
  const ant=mesAnoAdd(state.year,state.currentMonth,-1);
  const periodoAnterior=fmtPeriodo(ant.ano,ant.mes);
  const prox=mesAnoAdd(state.year,state.currentMonth,1);
  const periodoSeguinte=fmtPeriodo(prox.ano,prox.mes);

  if(ehCategoriaSalario(categoria)) return {tipoSal:'q1', periodo:periodoAtual, referente:'nenhum'};
  if(categoria==='inss'||categoria==='fgts') return {periodo:periodoAnterior, referente:'nenhum'};
  if(categoria==='vale-al'||categoria==='vale-tr') return {tipoVale:'normal', periodo:periodoSeguinte};
  if(categoria==='seguro'){ const p=sugerirParcelaSeguro(); return {parcelaAtual:p.parcelaAtual, parcelaTotal:p.parcelaTotal}; }
  if(categoria==='adm'||categoria==='secovi') return {periodo:periodoAtual};
  if(categoria==='celpe'||categoria==='compesa') return {periodo:periodoAnterior, consumo:''};
  if(categoria==='taxa-mensal') return {periodo:periodoAtual, multa:false};
  if(categoria==='taxa-extra'){
    const te=(state.taxasExtras||[])[0];
    return {descTaxa:te?te.desc:'Taxa Extra', parcelaAtual:1, parcelaTotal:te?te.parcelas:1, multa:false, reserva:true};
  }
  return {manualDesc:''};
}

// --- Render da tabela ---
function optsCategoria(tipo,selecionada){
  const lista=tipo==='receita'?CATEGORIAS_RECEITA_EXTRATO:CATEGORIAS_DESPESA_EXTRATO;
  const sel=ehCategoriaSalario(selecionada)?'sal-mensal':selecionada;
  return lista.map(c=>`<option value="${c.v}"${c.v===sel?' selected':''}>${c.l}</option>`).join('');
}

function optsUnidade(selecionada){
  return '<option value="">—</option>'+state.condominos.map(c=>`<option value="${c.apto}"${c.apto===selecionada?' selected':''}>${c.apto}</option>`).join('');
}

function campoDetalhes(row,i){
  const ex=row.extra||{};
  const S='font-size:11px;padding:2px 4px;width:auto';
  if(ehCategoriaSalario(row.categoria)){
    return `<div style="display:flex;gap:3px;flex-wrap:wrap">
      <select style="${S}" onchange="atualizarExtraRow(${i},'tipoSal',this.value)">
        <option value="q1"${ex.tipoSal==='q1'?' selected':''}>1ª quinz.</option>
        <option value="q2"${ex.tipoSal==='q2'?' selected':''}>2ª quinz.</option>
        <option value="complemento"${ex.tipoSal==='complemento'?' selected':''}>Complemento</option>
      </select>
      <input type="text" value="${ex.periodo||''}" placeholder="mm/aaaa" style="${S};width:56px" onchange="atualizarExtraRow(${i},'periodo',this.value)">
      <select style="${S}" onchange="atualizarExtraRow(${i},'referente',this.value)">
        <option value="nenhum"${ex.referente==='nenhum'?' selected':''}>—</option>
        <option value="ferias"${ex.referente==='ferias'?' selected':''}>Férias</option>
        <option value="13"${ex.referente==='13'?' selected':''}>13º</option>
      </select>
    </div>`;
  }
  if(row.categoria==='inss'||row.categoria==='fgts'){
    return `<div style="display:flex;gap:3px;flex-wrap:wrap">
      <input type="text" value="${ex.periodo||''}" placeholder="mm/aaaa" style="${S};width:56px" onchange="atualizarExtraRow(${i},'periodo',this.value)">
      <select style="${S}" onchange="atualizarExtraRow(${i},'referente',this.value)">
        <option value="nenhum"${ex.referente==='nenhum'?' selected':''}>—</option>
        <option value="ferias"${ex.referente==='ferias'?' selected':''}>Férias</option>
        <option value="13"${ex.referente==='13'?' selected':''}>13º</option>
      </select>
    </div>`;
  }
  if(row.categoria==='vale-al'||row.categoria==='vale-tr'){
    return `<div style="display:flex;gap:3px">
      <select style="${S}" onchange="atualizarExtraRow(${i},'tipoVale',this.value)">
        <option value="normal"${ex.tipoVale==='normal'?' selected':''}>Normal</option>
        <option value="complemento"${ex.tipoVale==='complemento'?' selected':''}>Complemento</option>
      </select>
      <input type="text" value="${ex.periodo||''}" placeholder="mm/aaaa" style="${S};width:56px" onchange="atualizarExtraRow(${i},'periodo',this.value)">
    </div>`;
  }
  if(row.categoria==='seguro'){
    return `<div style="display:flex;gap:3px;align-items:center">
      <input type="number" min="1" value="${ex.parcelaAtual||1}" style="${S};width:40px" onchange="atualizarExtraRow(${i},'parcelaAtual',parseInt(this.value)||1)">/
      <input type="number" min="1" value="${ex.parcelaTotal||10}" style="${S};width:40px" onchange="atualizarExtraRow(${i},'parcelaTotal',parseInt(this.value)||10)">
    </div>`;
  }
  if(row.categoria==='adm'||row.categoria==='secovi'){
    return `<input type="text" value="${ex.periodo||''}" placeholder="mm/aaaa" style="${S};width:56px" onchange="atualizarExtraRow(${i},'periodo',this.value)">`;
  }
  if(row.categoria==='celpe'||row.categoria==='compesa'){
    return `<div style="display:flex;gap:3px">
      <input type="text" value="${ex.periodo||''}" placeholder="mm/aaaa" style="${S};width:56px" onchange="atualizarExtraRow(${i},'periodo',this.value)">
      <input type="text" value="${ex.consumo||''}" placeholder="${row.categoria==='celpe'?'KWh':'m³'}" style="${S};width:50px" onchange="atualizarExtraRow(${i},'consumo',this.value)">
    </div>`;
  }
  if(row.categoria==='taxa-mensal'){
    return `<label style="font-size:11px;display:flex;gap:3px;align-items:center"><input type="checkbox" ${ex.multa?'checked':''} onchange="atualizarExtraRow(${i},'multa',this.checked)">multa</label>`;
  }
  if(row.categoria==='taxa-extra'){
    return `<div style="display:flex;gap:3px;flex-wrap:wrap;align-items:center">
      <input type="number" min="1" value="${ex.parcelaAtual||1}" style="${S};width:32px" onchange="atualizarExtraRow(${i},'parcelaAtual',parseInt(this.value)||1)">/
      <input type="number" min="1" value="${ex.parcelaTotal||1}" style="${S};width:32px" onchange="atualizarExtraRow(${i},'parcelaTotal',parseInt(this.value)||1)">
      <label style="font-size:11px;display:flex;gap:2px;align-items:center"><input type="checkbox" ${ex.reserva!==false?'checked':''} onchange="atualizarExtraRow(${i},'reserva',this.checked)">reserva</label>
      <label style="font-size:11px;display:flex;gap:2px;align-items:center"><input type="checkbox" ${ex.multa?'checked':''} onchange="atualizarExtraRow(${i},'multa',this.checked)">multa</label>
    </div>`;
  }
  return '<span style="color:var(--text3)">—</span>';
}

function renderExtratoTable(){
  const tbody=document.getElementById('extrato-tbody');
  tbody.innerHTML=extratoRows.map((r,i)=>`
    <tr style="${r.incluir?'':'opacity:.45'}">
      <td style="text-align:center;padding:4px 6px;border-bottom:1px solid var(--border)">
        <input type="checkbox" ${r.incluir?'checked':''} onchange="atualizarExtratoRow(${i},'incluir',this.checked)">
      </td>
      <td style="padding:4px 6px;border-bottom:1px solid var(--border)">
        <input type="date" value="${r.dataISO}" style="font-size:11px;padding:2px" onchange="atualizarExtratoRow(${i},'dataISO',this.value)">
      </td>
      <td style="padding:4px 6px;border-bottom:1px solid var(--border)">
        <select style="font-size:11px;padding:2px" onchange="mudarTipoExtratoRow(${i},this.value)">
          <option value="receita"${r.tipo==='receita'?' selected':''}>Receita</option>
          <option value="despesa"${r.tipo==='despesa'?' selected':''}>Despesa</option>
        </select>
      </td>
      <td style="padding:4px 6px;border-bottom:1px solid var(--border)">
        <select style="font-size:11px;padding:2px" onchange="mudarCategoriaExtratoRow(${i},this.value)">
          ${optsCategoria(r.tipo,r.categoria)}
        </select>
      </td>
      <td style="padding:4px 6px;border-bottom:1px solid var(--border)">
        ${r.tipo==='receita'?`<select style="font-size:11px;padding:2px" onchange="atualizarExtratoRow(${i},'unidade',this.value)">${optsUnidade(r.unidade)}</select>`:'<span style="color:var(--text3)">—</span>'}
      </td>
      <td style="padding:4px 6px;border-bottom:1px solid var(--border)">${campoDetalhes(r,i)}</td>
      <td style="padding:4px 6px;border-bottom:1px solid var(--border)">
        <input type="text" value="${(r.desc||'').replace(/"/g,'&quot;')}" style="font-size:12px;padding:3px;width:100%;min-width:150px" onchange="atualizarExtratoRow(${i},'desc',this.value)">
      </td>
      <td style="padding:4px 6px;border-bottom:1px solid var(--border);text-align:right;font-family:var(--mono)">
        <input type="number" step="0.01" value="${r.valor}" style="font-size:12px;padding:3px;width:75px;text-align:right" onchange="atualizarExtratoRow(${i},'valor',parseFloat(this.value)||0)">
      </td>
    </tr>`).join('');
}

function atualizarExtratoRow(i,campo,valor){
  extratoRows[i][campo]=valor;
  if(campo==='incluir') renderExtratoTable();
}

function atualizarExtraRow(i,campo,valor){
  const row=extratoRows[i];
  row.extra[campo]=valor;
  if(campo==='referente' && ehCategoriaSalario(row.categoria)){
    row.categoria=valor==='ferias'?'sal-ferias':valor==='13'?'sal-13':'sal-mensal';
  }
  row.desc=row.tipo==='receita'?montarDescricaoReceita(row):montarDescricaoDespesa(row);
  renderExtratoTable();
}

function mudarCategoriaExtratoRow(i,novaCategoria){
  const row=extratoRows[i];
  row.categoria=novaCategoria;
  row.extra=extraPadrao(novaCategoria);
  if(row.tipo==='despesa') row.unidade='';
  row.desc=row.tipo==='receita'?montarDescricaoReceita(row):montarDescricaoDespesa(row);
  renderExtratoTable();
}

function mudarTipoExtratoRow(i,novoTipo){
  const row=extratoRows[i];
  row.tipo=novoTipo;
  row.categoria=novoTipo==='receita'?'outras':'outros';
  row.extra={manualDesc:row.desc||''};
  if(novoTipo==='despesa') row.unidade='';
  renderExtratoTable();
}

function confirmarImportacaoExtrato(){
  const m=state.currentMonth;
  if(!state.balancetes[state.year]) state.balancetes[state.year]={};
  if(!state.balancetes[state.year][m]) state.balancetes[state.year][m]={receitas:[],despesas:[],obs:'',fechado:false};
  const bal=state.balancetes[state.year][m];
  if(!bal.receitas) bal.receitas=[];
  if(!bal.despesas) bal.despesas=[];

  let incluidas=0;
  extratoRows.forEach(r=>{
    if(!r.incluir) return;
    if(r.tipo==='receita'){
      const obj={categoria:r.categoria, unidade:r.unidade||'', valor:r.valor, data:r.dataISO, desc:r.desc||''};
      if(r.categoria==='taxa-extra') obj.isReserva=(r.extra.reserva!==false);
      bal.receitas.push(obj);
    }else{
      const obj={categoria:r.categoria, valor:r.valor, data:r.dataISO, desc:r.desc||''};
      if((r.categoria==='inss'||r.categoria==='fgts') && r.extra.referente && r.extra.referente!=='nenhum'){
        obj.isReservaFunc=true;
      }
      bal.despesas.push(obj);
    }
    incluidas++;
  });

  save();
  closeModal('modal-importar-extrato');
  renderBalancete();
  alert(`${incluidas} lançamento(s) importado(s) com sucesso!`);
}
