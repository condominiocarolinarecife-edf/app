// ==================== ONBOARDING ====================
function finishOnboarding(){
  const nome=document.getElementById('ob-nome').value.trim();
  if(!nome){document.getElementById('ob-nome').focus();return;}
  const sindico=document.getElementById('ob-sindico').value.trim();
  const ano=parseInt(document.getElementById('ob-ano').value)||2026;
  const unidades=parseInt(document.getElementById('ob-unidades').value)||12;
  const taxa=parseFloat(document.getElementById('ob-taxa').value)||400;

  state.gestao.nome=nome;
  state.gestao.cnpj=document.getElementById('ob-cnpj').value.trim();
  state.gestao.endereco=document.getElementById('ob-end').value.trim();
  state.gestao.sindico=sindico;
  state.year=ano;
  state.setupDone=true;

  // Auto-generate unit list
  state.condominos=[];
  const floors=Math.ceil(unidades/4);
  let count=0;
  for(let fl=1;fl<=floors&&count<unidades;fl++){
    for(let u=1;u<=4&&count<unidades;u++){
      const apto=String(fl*100+u);
      state.condominos.push({apto,nome:`Apto ${apto}`,cpf:'',email:'',tel:'',taxa,status:'Ativo',obs:''});
      count++;
    }
  }

  document.getElementById('current-year').textContent=ano;
  document.getElementById('sidebar-year').textContent=ano;
  save();
  document.getElementById('modal-onboarding').classList.remove('open');
  updateCondNome();
  renderDashboard();
}

// ==================== INIT ====================
iniciarApp();

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open:not(#modal-onboarding)').forEach(m => m.classList.remove('open'));
  }
});
