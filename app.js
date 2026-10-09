(() => {
const data = window.MRE_DATA.subjects;
const icons = ["📚","➗","🧪","🌎","🔤"];
const guides = [
{title:"Lengua y Literatura",icon:icons[0],topics:["Narraciones: conflicto, personajes, motivaciones y tipo de narrador.","Textos dramáticos: diálogos y acotaciones.","Interpretación literaria con evidencias del texto.","Textos argumentativos: tesis, argumentos, evidencias, contraargumentos y conclusión.","Textos de medios: propósito, recursos persuasivos y comparación de fuentes."]},
{title:"Matemática",icon:icons[1],topics:["Números racionales y operaciones respetando jerarquía.","Potencias de base racional y exponente entero.","Expresiones algebraicas y productos notables.","Ecuaciones, sistemas y funciones.","Geometría: ángulos, escala, semejanza y homotecia.","Probabilidad y estadística: media, mediana y lectura de datos."]},
{title:"Ciencias Naturales",icon:icons[2],topics:["Biología: evolución, ecosistemas, cadenas alimentarias y sustentabilidad.","Impacto ambiental y bioacumulación.","Física: sonido, efecto Doppler, reflexión y refracción de la luz.","Astronomía: observatorios, objetos celestes y eclipses.","Química: reactantes, productos, evidencias de reacción, oxidación y combustión.","Ecuaciones químicas: síntesis, descomposición y balanceo."]},
{title:"Historia, Geografía y Ciencias Sociales",icon:icons[3],topics:["Liberalismo, republicanismo, soberanía y Estado nación en el siglo XIX.","Consolidación de la república chilena y transformaciones territoriales.","Economía exportadora, hacienda y cambios sociales.","Primera Guerra Mundial y transformaciones sociales.","Cuestión social y distintas respuestas políticas.","Pueblos originarios, mercado, inflación, monopolio, industrialización y desarrollo sostenible."]},
{title:"Inglés",icon:icons[4],topics:["Comprensión de textos variados y búsqueda de información explícita.","Vocabulario según contexto y tema.","Conectores para añadir, contrastar, explicar causa y consecuencia.","Estructuras gramaticales en contexto y tiempos verbales.","Expresar opiniones y producir textos breves con coherencia."]}
];
let selectedSubject=0, session=[], idx=0, chosen=null, checked=false, mode="practice";
const $=id=>document.getElementById(id);
const loadStats=()=>{try{return JSON.parse(localStorage.getItem("mre_stats")||"{}")}catch(e){return {}}};
const saveStats=s=>localStorage.setItem("mre_stats",JSON.stringify(s));
const stats=loadStats();
function getSubStats(i){return stats[data[i].name]||{answered:0,correct:0,history:[]}}
function startSession(i,kind="practice"){
 selectedSubject=i;mode=kind;idx=0;chosen=null;checked=false;
 let bank=data[i].questions.map((q,n)=>({...q,original:n}));
 if(kind==="exam") bank.sort(()=>Math.random()-.5);
 session=kind==="exam"?bank.slice(0,25):bank;
 renderSubjects();renderQuestion();
}
function renderSubjects(){
 $("subjectGrid").innerHTML=data.map((s,i)=>`<button class="subject-card ${i===selectedSubject?"selected":""}" data-subject="${i}"><span class="subject-icon">${icons[i]}</span><strong>${s.name}</strong><small>${getSubStats(i).answered} respuestas registradas</small></button>`).join("");
 document.querySelectorAll("[data-subject]").forEach(b=>b.onclick=()=>startSession(+b.dataset.subject,"practice"));
}
function renderQuestion(){
 const s=data[selectedSubject];const q=session[idx];
 $("quizSubject").textContent=s.name;
 $("quizTitle").textContent=mode==="exam"?"Ensayo de práctica · 25 preguntas":"Práctica guiada";
 $("questionCount").textContent=`Pregunta ${idx+1} de ${session.length}`;
 $("progressBar").style.width=`${idx/session.length*100}%`;
 $("questionText").textContent=q.q;
 $("options").innerHTML=q.options.map((o,j)=>`<button class="option ${chosen===j?"chosen":""}" data-option="${j}" ${checked?"disabled":""}><span class="letter">${"ABCD"[j]}</span><span>${o}</span></button>`).join("");
 document.querySelectorAll("[data-option]").forEach(b=>b.onclick=()=>{if(checked)return;chosen=+b.dataset.option;renderQuestion()});
 $("feedback").classList.add("hidden");$("feedback").classList.remove("good","bad");
 if(checked){
  const fb=$("feedback");fb.classList.remove("hidden");const ok=chosen===q.answer;fb.classList.add(ok?"good":"bad");
  fb.innerHTML=`<strong>${ok?"¡Correcto!":"Revisa esta respuesta."}</strong><p>${ok?"Buena comprensión.":"La alternativa correcta es "+ "ABCD"[q.answer]+": "+q.options[q.answer]+ "."}</p><p>${q.why}</p>`;
 }
 $("checkBtn").classList.toggle("hidden",checked);$("checkBtn").disabled=chosen===null;
 $("nextBtn").classList.toggle("hidden",!checked);$("nextBtn").textContent=idx===session.length-1?(mode==="exam"?"Ver resultado":"Terminar práctica"):"Siguiente pregunta →";
 $("restartBtn").textContent=mode==="exam"?"Nuevo ensayo":"Reiniciar práctica";$("examBtn").classList.toggle("hidden",mode==="exam");
}
function recordAnswer(q,ok){
 const s=data[selectedSubject].name;const cur=getSubStats(selectedSubject);
 cur.answered++;if(ok)cur.correct++;cur.history.push({correct:ok,at:new Date().toISOString(),mode});
 if(cur.history.length>500)cur.history=cur.history.slice(-500);
 stats[s]=cur;saveStats(stats);
}
function finishSession(){
 const cur=getSubStats(selectedSubject);const percent=cur.answered?Math.round(cur.correct/cur.answered*100):0;
 $("progressBar").style.width="100%";
 $("questionCount").textContent="Sesión terminada";
 $("questionText").textContent=mode==="exam"?"Ensayo completado.":"Práctica completada.";
 $("options").innerHTML=`<div class="panel"><h3>Tu resultado de esta asignatura</h3><div class="stats-grid"><div class="stat"><strong>${session.filter((q)=>q.wasCorrect).length}/${session.length}</strong><span>Respuestas correctas en esta sesión</span></div><div class="stat"><strong>${Math.round(session.filter(q=>q.wasCorrect).length/session.length*100)}%</strong><span>Resultado de la sesión</span></div><div class="stat"><strong>${percent}%</strong><span>Aciertos acumulados en respuestas registradas</span></div></div><p>Lee las explicaciones de las preguntas que te costaron y vuelve a practicar.</p></div>`;
 $("feedback").classList.add("hidden");$("checkBtn").classList.add("hidden");$("nextBtn").classList.add("hidden");$("restartBtn").textContent="Volver a practicar";renderSubjects();renderProgress();renderTeacher();
}
function checkAnswer(){
 if(chosen===null||checked)return;
 checked=true;const q=session[idx];q.wasCorrect=chosen===q.answer;recordAnswer(q,q.wasCorrect);renderQuestion();renderSubjects();
}
function nextQuestion(){
 if(idx===session.length-1){finishSession();return}
 idx++;chosen=null;checked=false;renderQuestion();
}
function renderGuides(){
 $("guideGrid").innerHTML=guides.map(g=>`<article class="panel guide-card"><h3>${g.icon} ${g.title}</h3><ul>${g.topics.map(t=>`<li>${t}</li>`).join("")}</ul></article>`).join("");
}
function renderProgress(){
 const all=data.map((_,i)=>getSubStats(i));const answered=all.reduce((a,s)=>a+s.answered,0),correct=all.reduce((a,s)=>a+s.correct,0);
 $("progressSummary").innerHTML=`<div class="stat"><strong>${answered}</strong><span>Respuestas registradas</span></div><div class="stat"><strong>${correct}</strong><span>Respuestas correctas</span></div><div class="stat"><strong>${answered?Math.round(correct/answered*100):0}%</strong><span>Porcentaje global de aciertos</span></div>`;
 $("progressBySubject").innerHTML="<h3>Resultados por asignatura</h3>"+data.map((s,i)=>{const st=getSubStats(i),p=st.answered?Math.round(st.correct/st.answered*100):0;return `<div class="subject-progress"><div class="subject-progress-head"><span>${s.name}</span><span>${st.correct}/${st.answered} · ${p}%</span></div><div class="mini-track"><div style="width:${p}%"></div></div></div>`}).join("");
}
function renderTeacher(){
 const total=data.reduce((a,_,i)=>a+getSubStats(i).answered,0);
 $("teacherSummary").innerHTML=`<p><strong>${total}</strong> respuestas registradas en este dispositivo.</p>`+data.map((s,i)=>{const st=getSubStats(i);return `<p>${s.name}: ${st.correct}/${st.answered} respuestas correctas.</p>`}).join("");
}
function exportCSV(){
 const rows=[["Asignatura","Respuestas","Correctas","Porcentaje"]];
 data.forEach((s,i)=>{const st=getSubStats(i);rows.push([s.name,st.answered,st.correct,st.answered?Math.round(st.correct/st.answered*100)+"%":"0%"])});
 const csv=rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\r\n");
 const a=document.createElement("a");a.href=URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8;"}));a.download="mi-ruta-resumen.csv";a.click();URL.revokeObjectURL(a.href);
}
document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-tab]").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll(".view").forEach(v=>v.classList.toggle("hidden",v.id!==b.dataset.tab));if(b.dataset.tab==="progress")renderProgress();if(b.dataset.tab==="teacher")renderTeacher()});
$("checkBtn").onclick=checkAnswer;$("nextBtn").onclick=nextQuestion;$("restartBtn").onclick=()=>startSession(selectedSubject,mode);$("examBtn").onclick=()=>startSession(selectedSubject,"exam");
$("role").onchange=()=>{const teacher=$("role").value==="teacher";document.querySelector(".teacher-only").classList.toggle("hidden",!teacher);$("roleHelp").textContent=teacher?"Revisa el resumen local o exporta un CSV de este dispositivo.":"Elige una asignatura y comienza a practicar.";};
$("clearProgress").onclick=()=>{if(confirm("¿Borrar todos los resultados guardados en este navegador?")){localStorage.removeItem("mre_stats");Object.keys(stats).forEach(k=>delete stats[k]);renderProgress();renderSubjects();renderTeacher()}};
$("exportBtn").onclick=exportCSV;
renderSubjects();renderGuides();renderProgress();renderTeacher();startSession(0);
let installPrompt=null;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installPrompt=e;$("installBtn").classList.remove("hidden")});
$("installBtn").onclick=async()=>{if(!installPrompt){alert("Si tu navegador permite instalar sitios, abre el menú del navegador y elige «Instalar aplicación» o «Añadir a pantalla de inicio».");return}installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$("installBtn").classList.add("hidden")};
if("serviceWorker" in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
})();