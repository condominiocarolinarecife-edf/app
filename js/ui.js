// ==================== NAVIGATION ====================
function showPanel(id, el){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('panel-'+id).classList.add('active');
  if(el) el.classList.add('active');
  const titles={dashboard:'Dashboard',balancete:'Balancetes Mensais',orcamento:'Orçamento e Previsão',simulador:'Simulador de Taxa',reserva:'Reserva Financeira',encargos:'Encargos do Funcionário',vt:'Vale Transporte',calendario:'Calendário de Feriados',condominios:'Condôminos',funcionarios:'Funcionários',fornecedores:'Fornecedores',gestao:'Gestão do Condomínio',documentos:'Comunicados e Documentos'};
  document.getElementById('topbar-title').textContent=titles[id]||id;
  const renders={dashboard:renderDashboard,balancete:renderBalancete,orcamento:renderOrcamento,simulador:calcSimulador,reserva:renderReserva,encargos:calcEncargos,vt:renderVT,calendario:renderCalendario,condominios:renderCondominios,funcionarios:renderFuncionarios,fornecedores:renderFornecedores,gestao:renderGestao,documentos:renderDocumentos};
  if(renders[id])renders[id]();
}

function changeYear(d){
  state.year+=d;
  document.getElementById('current-year').textContent=state.year;
  document.getElementById('sidebar-year').textContent=state.year;
  // Reset simulator so it re-imports data for the new year
  ['sim-unidades','sim-taxa-atual','sim-despesas'].forEach(id=>{
    const el=document.getElementById(id);
    if(el) el.dataset.auto='';
  });
}

// ==================== MODAL ====================
function showModal(id){
  document.getElementById(id).classList.add('open');
  if(id==='modal-config'){const el=document.getElementById('conf-nome');if(el)el.value=state.gestao.nome||'';}
  if(id==='modal-add-funcionario'&&document.getElementById('func-edit-idx').value==='-1')resetFuncModal();
  if(id==='modal-lote-receita') buildLoteTable();
}
function closeModal(id){
  document.getElementById(id).classList.remove('open');
  if(id==='modal-importar-extrato') resetModalImportarExtrato();
}
document.querySelectorAll('.modal-overlay').forEach(m=>{
  m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open')});
});

// ==================== TABS ====================
function showTab(btn,contentId){
  const parent=btn.closest('.tabs').parentElement;
  parent.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  parent.querySelectorAll('.tab-content').forEach(t=>t.style.display='none');
  btn.classList.add('active');
  parent.querySelector('#'+contentId).style.display='block';
}

// ==================== HELPERS ====================
function brl(v){return'R$ '+Number(v||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}
function getDaysInMonth(y,m){return new Date(y,m+1,0).getDate()}
function getWeekend(y,m){let c=0;for(let d=1;d<=getDaysInMonth(y,m);d++){const day=new Date(y,m,d).getDay();if(day===0)c++;}return c}
function getFeriadosMes(y,m){
  const monthStr=(m+1).toString().padStart(2,'0');
  return state.feriados.filter(f=>{
    const parts=f.data.split('-');
    return parseInt(parts[0])===y&&parseInt(parts[1])===(m+1);
  }).filter(f=>{
    // new Date('YYYY-MM-DD') é interpretado como meia-noite UTC — em fusos atrás
    // de UTC (ex.: Brasil, UTC-3) isso "volta" pro dia anterior e o getDay() sai
    // errado. Construindo com (ano,mês,dia) o JS usa o fuso local corretamente.
    const p=f.data.split('-').map(Number);
    const d=new Date(p[0],p[1]-1,p[2]);
    return d.getDay()!==0;
  }).length;
}
function getWorkDays(y,m){return getDaysInMonth(y,m)-getWeekend(y,m)-getFeriadosMes(y,m)}

// ==================== DASHBOARD ====================
function renderDashboard(){
  const units=document.getElementById('dash-units');
  units.innerHTML='';
  state.condominos.forEach(c=>{
    const cls=c.status==='Isento'?'unit-cell exempt':c.status==='Inadimplente'?'unit-cell late':'unit-cell paid';
    units.innerHTML+=`<div class="${cls}"><div class="apt">${c.apto}</div><div class="val">${c.status==='Isento'?'Isento':c.status==='Inadimplente'?'Atraso':brl(c.taxa)}</div></div>`;
  });

  // Texto "Exercício XXXX — atualizado em <mês do balancete atual>"
  const periodoEl=document.getElementById('dash-period');
  if(periodoEl) periodoEl.textContent=`Exercício ${state.year} — atualizado em ${MONTHS[state.currentMonth].toLowerCase()}`;

  // Cards de receita/despesa/saldo do mês atual (currentMonth), não mais fixos
  const totalR=calcTotalReceitas(state.currentMonth);
  const totalD=calcTotalDespesas(state.currentMonth);
  const saldoMes=totalR-totalD;
  const saldoAcum=calcSaldoAnterior(state.currentMonth)+saldoMes;
  const reservaAcum=calcReservaFuncAcum(state.currentMonth)+calcReservaTaxaAcum(state.currentMonth);
  const mesLabel=`${MONTHS[state.currentMonth]} ${state.year}`;

  const setTxt=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=val;};
  setTxt('d-receita',brl(totalR));
  setTxt('d-receita-sub',mesLabel);
  setTxt('d-despesa',brl(totalD));
  setTxt('d-despesa-sub',mesLabel);
  setTxt('d-saldo',brl(saldoMes));
  setTxt('d-saldo-sub',saldoMes>=0?'Positivo':'Negativo');
  setTxt('d-acumulado',brl(saldoAcum));
  setTxt('d-reserva-sub',`Reserva: ${brl(reservaAcum)}`);
  setTxt('d-livre',brl(saldoAcum-reservaAcum));

  const chart=document.getElementById('dash-chart');
  const data=MONTHS.map((_,i)=>calcTotalReceitas(i));
  const desp=MONTHS.map((_,i)=>calcTotalDespesas(i));
  const maxV=Math.max(...data,...desp,100);
  chart.innerHTML=data.map((v,i)=>`<div style="flex:1;display:flex;gap:2px;align-items:flex-end"><div class="mini-bar receita" style="height:${Math.max(4,(v/maxV)*56)}px;flex:1"></div><div class="mini-bar despesa" style="height:${Math.max(4,(desp[i]/maxV)*56)}px;flex:1"></div></div>`).join('');
  renderAlertasDashboard();
}

