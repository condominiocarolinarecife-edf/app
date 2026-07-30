// ==================== CONFIG ====================
let _viradaAnoCtx = null;

function abrirModalViradaReservas(){
  const novoAno = parseInt(document.getElementById('novo-exercicio').value);
  const anoAtual = state.year;

  if(!novoAno || novoAno<=anoAtual){alert('Informe um ano de exercício válido, maior que o atual.');return;}

  // Último mês fechado do ano que está encerrando
  let ultimoMesFechado = -1;
  for(let i = 11; i >= 0; i--){
    if(state.balancetes[anoAtual]?.[i]?.fechado){ ultimoMesFechado = i; break; }
  }
  const m = ultimoMesFechado >= 0 ? ultimoMesFechado : 11;

  const reservaFuncFinal = calcReservaFuncAcum(m);
  const reservaTaxaFinal = calcReservaTaxaAcum(m);

  _viradaAnoCtx = {novoAno, anoAtual, m, reservaFuncFinal, reservaTaxaFinal};

  document.getElementById('vr-valor-func').textContent = brl(reservaFuncFinal);
  document.getElementById('vr-valor-taxa').textContent = brl(reservaTaxaFinal);
  document.querySelector('input[name="vr-func"][value="manter"]').checked = true;
  document.querySelector('input[name="vr-taxa"][value="manter"]').checked = true;

  showModal('modal-virada-reservas');
}

function confirmarViradaAno(){
  if(!_viradaAnoCtx)return;
  const {novoAno, anoAtual, m, reservaFuncFinal, reservaTaxaFinal} = _viradaAnoCtx;

  if(!confirm(`Confirma a criação do exercício ${novoAno}?\n\nO histórico de ${anoAtual} será preservado. O saldo final de ${anoAtual} será transferido como saldo inicial de Janeiro/${novoAno}.`)) return;

  const manterFunc = document.querySelector('input[name="vr-func"]:checked').value==='manter';
  const manterTaxa = document.querySelector('input[name="vr-taxa"]:checked').value==='manter';

  // ── 1. Saldo final do ano que está encerrando (dinheiro total, independe da escolha acima) ──
  const saldoFinalAno = calcSaldoAnterior(m) +
    calcTotalReceitas(m) - calcTotalDespesas(m);

  // ── 2. Cria estrutura de balancetes do novo ano ────────────
  if(!state.balancetes[novoAno]) state.balancetes[novoAno] = {};

  state.balancetes[novoAno][0] = {
    fechado: false,
    obs: '',
    saldoInicial: saldoFinalAno, // saldo inicial explícito para Janeiro (é o mesmo dinheiro, independente da escolha de reserva)
    reservaFuncInicial: manterFunc ? reservaFuncFinal : 0,
    reservaTaxaInicial: manterTaxa ? reservaTaxaFinal : 0,
    receitas: [],
    despesas: []
  };

  // Demais meses em branco
  for(let i = 1; i <= 11; i++){
    if(!state.balancetes[novoAno][i]){
      state.balancetes[novoAno][i] = { fechado: false, obs: '', receitas: [], despesas: [] };
    }
  }

  // ── 3. Atualiza feriados para o novo ano ───────────────────
  state.feriados = state.feriados.map(f => ({
    ...f, data: f.data.replace(/^\d{4}/, novoAno)
  }));

  // ── 4. Muda para o novo exercício ─────────────────────────
  state.year = novoAno;
  state.currentMonth = 0;
  document.getElementById('current-year').textContent = novoAno;
  document.getElementById('sidebar-year').textContent = novoAno;

  save();
  closeModal('modal-virada-reservas');
  closeModal('modal-config');
  renderDashboard();
  updateCondNome();

  alert(
    `✅ Exercício ${novoAno} criado!\n\n` +
    `Saldo inicial de Janeiro/${novoAno}: ${brl(saldoFinalAno)}\n` +
    `Reserva Funcionário: ${manterFunc ? `mantida em ${brl(reservaFuncFinal)}, continua acumulando` : 'zerada — valor incorporado ao saldo livre'}\n` +
    `Reserva Taxa Extra: ${manterTaxa ? `mantida em ${brl(reservaTaxaFinal)}, continua acumulando` : 'zerada — valor incorporado ao saldo livre'}`
  );

  _viradaAnoCtx = null;
}

function exportarDados(){
  const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=`gestao-cond-${state.year}.json`;
  a.click();
}

function importarDados(){
  const input=document.createElement('input');
  input.type='file';input.accept='.json';
  input.onchange=e=>{
    const file=e.target.files[0];
    if(!file)return;
    const reader=new FileReader();
    reader.onload=ev=>{
      try{
        const imported=JSON.parse(ev.target.result);
        Object.assign(state,imported);
        save();
        location.reload();
      }catch(e){alert('Arquivo inválido.');}
    };
    reader.readAsText(file);
  };
  input.click();
}

// ==================== NOME DINÂMICO ====================
function updateCondNome(){
  const nome=state.gestao.nome||'Condomínio';
  const short=nome.replace(/^Condomínio\s+(Edifício\s+)?/i,'').replace(/^Condomínio\s+/i,'');
  document.getElementById('sidebar-logo').innerHTML=short+'<span>Gestão de Condomínio</span>';
  document.getElementById('sidebar-cond').textContent=short;
  document.title=(nome||'Gestão de Condomínio')+' — Gestão';
  // sync gestao form fields if panel is open
  const f=document.getElementById('gest-nome');
  if(f)f.value=nome;
}

