/* Navegação de estudo e biblioteca, sem dependências. */
(() => {
 const menu = $('#menuBtn'), nav = $('#mainNav');
 const closeMenu = () => { nav.classList.remove('is-open'); menu.setAttribute('aria-expanded','false'); };
 menu.addEventListener('click', () => menu.setAttribute('aria-expanded',String(nav.classList.toggle('is-open'))));
 nav.addEventListener('click', e => { if(e.target.closest('a')) closeMenu(); });
 document.addEventListener('keydown', e => { if(e.key==='Escape' && nav.classList.contains('is-open')){ closeMenu(); menu.focus(); } });
 const ids = TRILHAS.flatMap((track,i)=>track.t.map((topic,j)=>({id:i+'-'+j,topic,track:track.n})));
 const next = () => ids.find(x=>x.id===S.lastLesson && !S.done[x.id]) || ids.find(x=>!S.done[x.id]);
 window.refreshStudy = () => {
   const lesson=next();
   $('#nextLesson').textContent=lesson ? lesson.track+' · '+lesson.topic.t : 'Todas as aulas concluídas. Volte aos exercícios para revisar.';
   $('#continueBtn').textContent=lesson ? (S.lastLesson || Object.keys(S.done).length ? 'continuar estudando →' : 'começar a estudar →') : 'revisar as aulas →';
 };
 $('#continueBtn').addEventListener('click',()=>{
   const lesson=next() || ids[0];
   $('#topicSearch').value=''; $('#topicSearch').dispatchEvent(new Event('input'));
   const row=document.getElementById('lesson-'+lesson.id), card=row.closest('.mod');
   card.setAttribute('open-state','1'); card.querySelector('button').setAttribute('aria-expanded','true');
   row.classList.add('open'); row.querySelector('.ttitle').setAttribute('aria-expanded','true');
   S.lastLesson=lesson.id;persist(S);refreshStudy();
   row.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
   row.querySelector('.ttitle').focus({preventScroll:true});
 });
 $('#trilhasBox').addEventListener('click',()=>refreshStudy());
 refreshStudy();
 const uniqueResources=new Set([...RECURSOS.flatMap(([,items])=>items.map(([,url])=>url)),...LIBRARY.map(r=>r.url)]).size;
 [TRILHAS.length,TOTAL,TRILHAS.reduce((sum,t)=>sum+t.h,0),uniqueResources].forEach((n,i)=>{
   const counter=$$('.stats .count')[i];counter.dataset.to=n;counter.textContent=n;
 });
 S.savedResources = S.savedResources && typeof S.savedResources==='object' && !Array.isArray(S.savedResources) ? S.savedResources : {};
 function renderLibrary(){
   const q=normalizeSearch($('#resourceSearch').value.trim()),type=$('#resourceType').value,lang=$('#resourceLang').value;
   const hits=LIBRARY.filter(r=>(!type||r.type===type)&&(!lang||r.lang===lang)&&(!$('#savedOnly').checked||S.savedResources[r.id])&&normalizeSearch([r.title,r.author,r.desc,...r.tracks.map(i=>TRILHAS[i].n)].join(' ')).includes(q));
   const box=$('#libraryBox');box.replaceChildren();
   $('#libraryStatus').textContent=hits.length+' de '+LIBRARY.length+' materiais na seleção · '+Object.keys(S.savedResources).filter(id=>LIBRARY.some(r=>r.id===id)).length+' salvo(s)';
   if(!hits.length){box.append(el('p','empty','Nenhum material encontrado. Ajuste a busca ou os filtros.'));return;}
   hits.forEach(r=>{
     const card=el('article','resource-card');
     card.innerHTML='<div class="resource-meta"><span>'+r.type+'</span><span>'+r.lang+' · '+r.level+'</span></div><h3>'+r.title+'</h3><p class="author">'+r.author+'</p><p>'+r.desc+'</p><p class="start"><b>Primeiro passo</b><br>'+r.start+'</p><p class="access">'+r.access+'</p><div class="resource-actions"><a target="_blank" rel="noopener noreferrer" href="'+r.url+'">Abrir material ↗</a><button type="button" class="iconbtn" aria-label="Salvar '+r.title+'" aria-pressed="'+!!S.savedResources[r.id]+'">'+(S.savedResources[r.id]?'salvo ✓':'salvar +')+'</button></div>';
     const button=card.querySelector('button');
     button.addEventListener('click',()=>{
       if(S.savedResources[r.id]) delete S.savedResources[r.id]; else S.savedResources[r.id]=true;
       persist(S);
       if($('#savedOnly').checked){ renderLibrary(); $('#savedOnly').focus(); }
       else { button.setAttribute('aria-pressed',String(!!S.savedResources[r.id]));button.textContent=S.savedResources[r.id]?'salvo ✓':'salvar +';$('#libraryStatus').textContent=hits.length+' de '+LIBRARY.length+' materiais na seleção · '+Object.keys(S.savedResources).length+' salvo(s)'; }
     });box.append(card);
   });
 }
 ['resourceSearch','resourceType','resourceLang','savedOnly'].forEach(id=>document.getElementById(id).addEventListener('input',renderLibrary));
 renderLibrary();
})();
