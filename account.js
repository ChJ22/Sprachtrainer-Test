(() => {
 'use strict';
 const $ = id => document.getElementById(id);
 const cfg = window.TRAINER_CONFIG || {};
 let client = null, user = null, revision = 0, remote = new Map(), pending = [], storageOK = true;
 let pipeline = Promise.resolve(), busy = false;
 const table = 'trainer_attempts_test';
 const project = String(cfg.supabaseUrl || '').replace(/\/$/, '');
 const redirect = location.origin + location.pathname.replace(/index\.html$/, '').replace(/\/?$/, '/');
 const storagePrefix = 'trainer-test-v1:' + project + ':';
 const keyFor = uid => storagePrefix + uid;
 const status = text => { $('account-status').textContent = text; };
 const itemKey = (base, lang, mode, entry) => JSON.stringify([base, lang, mode, entry.category, entry.de, entry.target, entry.prompt || '']);
 function merged() {
  const map = new Map(remote);
  for (const row of pending) map.set(row.id, row);
  return [...map.values()].sort((a,b) => a.answered_at.localeCompare(b.answered_at) || a.id.localeCompare(b.id));
 }
 function writeQueue() {
  if (!user) return;
  try { localStorage.setItem(keyFor(user.id), JSON.stringify(pending)); storageOK = true; }
  catch { storageOK = false; }
 }
 function readQueue(uid) {
  try { const value = JSON.parse(localStorage.getItem(keyFor(uid)) || '[]'); return Array.isArray(value) ? value.filter(x => x.user_id === uid && x.id && x.item_key && x.answered_at) : []; }
  catch { return []; }
 }
 function latest(scope) {
  const map = new Map();
  for (const row of merged()) {
   if (row.base_language !== scope.base_language || row.language !== scope.language || row.mode !== scope.mode || row.direction !== scope.direction) continue;
   map.set(row.item_key, row);
  }
  return map;
 }
 function wrongEntries(scope, entries) {
  const saved = latest(scope);
  return entries.filter(entry => saved.get(itemKey(scope.base_language,scope.language,scope.mode,entry))?.correct === false);
 }
 function render() {
  $('account-label').textContent = user ? 'Angemeldet: ' + (user.user_metadata?.display_name || user.email || 'Nutzer') : 'Gast · Ergebnisse nur in dieser Runde';
  $('account-form').hidden = !!user;
  $('account-logout').hidden = !user;
  $('account-sync').hidden = !user;
  $('progress-open').disabled = !user;
  $('progress-content').replaceChildren();
  if (!user) { $('progress-panel').hidden = true; return; }
  const baseLanguage = $('ui-language').value, targetLanguage = $('language').value;
  const rows = merged().filter(row => row.base_language === baseLanguage && row.language === targetLanguage);
  if (!rows.length) { const p = document.createElement('p');p.textContent='Noch keine gespeicherten Antworten für '+languageName(baseLanguage)+' ↔ '+languageName(targetLanguage)+'. Starte eine Übung.';$('progress-content').append(p); }
  for (const pair of new Set(rows.map(x => x.base_language+'|'+x.language))) {
   const [base,target]=pair.split('|');
   const subset = rows.filter(x => x.base_language === base && x.language === target);
   if (!subset.length) continue;
   const section = document.createElement('section'), heading = document.createElement('h3');heading.textContent=languageName(base)+' ↔ '+languageName(target);section.append(heading);
   for (const [mode,name] of [['words','Wörter'],['sentences','Sätze'],['grammar','Grammatik']]) {
    const attempts=subset.filter(x=>x.mode===mode), last=new Map();
    for(const x of attempts) last.set(x.item_key+'|'+x.direction,x);
    const p=document.createElement('p');
    p.textContent=`${name}: ${attempts.filter(x=>x.correct).length} von ${attempts.length} Antworten richtig · ${last.size} Aufgaben/Richtungen bearbeitet · ${[...last.values()].filter(x=>!x.correct).length} offene Fehler`;
    section.append(p);
   }
   $('progress-content').append(section);
  }
  window.dispatchEvent(new Event('trainer-progresschange'));
 }
 async function syncNow(uid, token, pull) {
  if (!client || !uid || user?.id !== uid || revision !== token) return;
  const outgoing = pending.slice();
  try {
   for(let i=0;i<outgoing.length;i+=100) {
    if(user?.id!==uid || revision!==token) return;
    const batch=outgoing.slice(i,i+100);
    const { error }=await client.from(table).upsert(batch,{onConflict:'id',ignoreDuplicates:true});
    if(error) throw error;
    if(user?.id!==uid || revision!==token) return;
    for(const row of batch) remote.set(row.id,row);
    const ids=new Set(batch.map(x=>x.id));pending=pending.filter(x=>!ids.has(x.id));writeQueue();
   }
   if(pull) {
    const downloaded=new Map();
    for(let from=0;;from+=1000) {
     const {data,error}=await client.from(table).select('*').eq('user_id',uid).order('answered_at').order('id').range(from,from+999);
     if(error) throw error;
     if(user?.id!==uid || revision!==token) return;
     for(const row of data || []) downloaded.set(row.id,row);
     if(!data || data.length<1000) break;
    }
    remote=downloaded;
   }
   if(user?.id!==uid || revision!==token) return;
   status(pending.length ? `${pending.length} Antworten warten auf Übertragung.` : 'Lernstand mit der Datenbank synchronisiert.');render();
  } catch {
   if(user?.id!==uid || revision!==token) return;
   status(storageOK ? 'Verbindung nicht möglich. Nicht übertragene Antworten bleiben auf diesem Gerät vorgemerkt. Nutze später „Synchronisieren“.' : 'Speichern derzeit nicht möglich. Lass die Seite geöffnet und versuche „Synchronisieren“ erneut.');render();
  }
 }
 function scheduleSync(pull=false) {
  const uid=user?.id, token=revision;
  pipeline=pipeline.then(()=>syncNow(uid,token,pull)).catch(()=>{});
  return pipeline;
 }
 function setUser(next) {
  if((user?.id || null)===(next?.id || null)) {user=next;render();return;}
  revision++;user=next;remote=new Map();pending=user ? readQueue(user.id) : [];render();
  window.dispatchEvent(new Event('trainer-userchange'));
  if(user) {status('Lernstand wird geladen …');scheduleSync(true);} else status('Als Gast kannst du weiter üben.');
 }
 function record({base_language,language,mode,direction,entry,chosen,correct}) {
  if(!user) return;
  const row={id:crypto.randomUUID(),user_id:user.id,base_language,language,mode,direction,item_key:itemKey(base_language,language,mode,entry),question:mode==='grammar'?entry.prompt:direction==='de'?entry.de:entry.target,expected:mode==='grammar'?entry.answer:direction==='de'?entry.target:entry.de,chosen,correct:!!correct,answered_at:new Date().toISOString()};
  pending.push(row);writeQueue();render();
  status(storageOK ? 'Antwort wird gespeichert …' : 'Lokaler Speicher nicht verfügbar. Antwort wird online übertragen …');scheduleSync();
 }
 window.TrainerStore={record,wrongEntries,isLoggedIn:()=>!!user,refresh:()=>scheduleSync(true)};
 $('progress-open').onclick=()=>{ $('progress-panel').hidden=!$('progress-panel').hidden;render();if(!$('progress-panel').hidden)scheduleSync(true); };
 $('account-sync').onclick=()=>scheduleSync(true);
 function message(error) {
  if(error?.message?.includes('Invalid login credentials')) return 'E-Mail oder Passwort stimmt nicht.';
  if(error?.message?.includes('Email not confirmed')) return 'Bitte bestätige zuerst den Link in deiner E-Mail.';
  return 'Das Konto konnte nicht verarbeitet werden. Prüfe deine Angaben und versuche es erneut. Bei E-Mail-Limits bitte später erneut versuchen.';
 }
 async function accountAction(kind) {
  if(!client || busy) return;
  const form=$('account-form');if(!form.reportValidity()) return;
  busy=true;for(const id of ['account-login','account-signup'])$(id).disabled=true;
  try {
   const email=$('account-email').value.trim(),password=$('account-password').value;
   if(kind==='signup') {
    const {data,error}=await client.auth.signUp({email,password,options:{emailRedirectTo:redirect,data:{display_name:$('account-name').value.trim() || 'Lernender'}}});
    if(error)throw error;
    $('account-password').value='';
    if(data.session){setUser(data.session.user);}else status('Falls die Registrierung möglich ist, erhältst du eine Bestätigungs-E-Mail. Öffne den Link und melde dich danach hier an.');
   }else{
    const {data,error}=await client.auth.signInWithPassword({email,password});if(error)throw error;
    $('account-password').value='';setUser(data.user);
   }
  }catch(error){status(message(error));}
  finally{busy=false;for(const id of ['account-login','account-signup'])$(id).disabled=false;}
 }
 $('account-form').onsubmit=event=>{event.preventDefault();accountAction('login');};
 $('account-signup').onclick=()=>accountAction('signup');
 $('account-logout').onclick=async()=>{
  if(!client || busy)return;
  busy=true;$('account-logout').disabled=true;
  try {await scheduleSync();const {error}=await client.auth.signOut({scope:'local'});if(error)throw error;setUser(null);}catch{status('Abmelden nicht möglich. Bitte erneut versuchen.');}
  finally{busy=false;$('account-logout').disabled=false;}
 };
 window.addEventListener('trainer-languagechange',render);
 window.addEventListener('online',()=>scheduleSync(true));
 async function init() {
  render();
  if(!project || !cfg.supabasePublishableKey) { status('Konten sind noch nicht verbunden. Die Testversion lässt sich als Gast ausprobieren.');return; }
  if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(project) || !/^sb_publishable_/.test(cfg.supabasePublishableKey)) {status('Konfiguration prüfen: Projekt-URL und öffentlicher Publishable Key erforderlich.');return;}
  try {
   if(!window.supabase)await new Promise((resolve,reject)=>{const s=document.createElement('script');const timeout=setTimeout(()=>reject(new Error('SDK timeout')),10000);s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';s.onload=()=>{clearTimeout(timeout);resolve();};s.onerror=()=>{clearTimeout(timeout);reject(new Error('SDK unavailable'));};document.head.append(s);});
   client=window.supabase.createClient(project,cfg.supabasePublishableKey,{auth:{storageKey:storagePrefix+'auth',persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
   client.auth.onAuthStateChange((event,session)=>{setTimeout(()=>setUser(session?.user || null),0);});
   const {data,error}=await client.auth.getSession();if(error)throw error;setUser(data.session?.user || null);
   $('account-login').disabled=false;$('account-signup').disabled=false;
   if(!user)status('Melde dich an oder lege ein Testkonto an.');
  }catch{status('Kontoverbindung nicht verfügbar. Du kannst als Gast üben.');}
 }
 init();
})();
