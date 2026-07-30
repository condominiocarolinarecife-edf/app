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
function closeModal(id){document.getElementById(id).classList.remove('open')}
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
    const d=new Date(f.data);return d.getDay()!==0;
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
  const chart=document.getElementById('dash-chart');
  const data=[4861,4961,0,0,0,0,0,0,0,0,0,0];
  const desp=[4185,4265,0,0,0,0,0,0,0,0,0,0];
  const maxV=Math.max(...data,...desp,100);
  chart.innerHTML=data.map((v,i)=>`<div style="flex:1;display:flex;gap:2px;align-items:flex-end"><div class="mini-bar receita" style="height:${Math.max(4,(v/maxV)*56)}px;flex:1"></div><div class="mini-bar despesa" style="height:${Math.max(4,(desp[i]/maxV)*56)}px;flex:1"></div></div>`).join('');
  renderAlertasDashboard();
}

