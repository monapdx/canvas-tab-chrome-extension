'use strict';
// Native containers retain their DOM across canvas redraws so media playback is uninterrupted.
const containerCache=new Map();
function cleanContainers(items){const ids=new Set(items.map(o=>o.id));for(const[id,c]of containerCache)if(!ids.has(id)){c.el.querySelectorAll('audio').forEach(a=>a.pause());containerCache.delete(id)}}
function containerButton(label,fn){const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=fn;return b}
function mutateContainer(id,fn){const o=item(id);if(!o)return;checkpoint();fn(o);containerCache.get(id)?.el.querySelectorAll('audio').forEach(a=>a.pause());containerCache.delete(id);changed()}
function renderContainer(o){const signature=JSON.stringify(o.type==='playlist'?{title:o.title,tracks:o.tracks}:o.type==='gallery'?{title:o.title,pictures:o.pictures}:{title:o.title,tasks:o.tasks,links:o.links,editingLinks:o.editingLinks});const cached=containerCache.get(o.id);if(cached?.signature===signature)return cached.el;if(cached)cached.el.querySelectorAll('audio').forEach(a=>a.pause());const root=document.createElement('section');root.className='native-container';const head=document.createElement('div');head.className='container-title';head.textContent=(o.type==='playlist'?'♫ ':o.type==='gallery'?'▧ ':o.type==='bookmarks'?'↗ ':'☑ ')+(o.title||'My '+o.type);root.append(head);const controls=document.createElement('div');controls.className='container-controls';root.append(controls);
if(o.type==='playlist'){const tracks=o.tracks||[],audio=document.createElement('audio');audio.controls=true;audio.preload='metadata';const now=document.createElement('div');now.className='now-playing';const list=document.createElement('div');list.className='track-list';let index=0;let buttons=[];function choose(i,play=false){index=i;if(!tracks[i]){now.textContent='Add audio files to start';return}audio.src=tracks[i].src;now.textContent=tracks[i].name;buttons.forEach((b,n)=>b.classList.toggle('playing',n===i));if(play)audio.play().catch(()=>status('Playback could not start'))}tracks.forEach((track,i)=>{const row=document.createElement('div');row.className='track-row';const b=containerButton(`${i+1}. ${track.name}`,()=>choose(i,true));b.title=track.name;buttons.push(b);row.append(b,containerButton('×',()=>mutateContainer(o.id,x=>x.tracks.splice(i,1))));list.append(row)});const transport=document.createElement('div');transport.className='transport';transport.append(containerButton('← Previous',()=>choose((index-1+tracks.length)%tracks.length,true)),containerButton('Next →',()=>choose((index+1)%tracks.length,true)));const loop=document.createElement('label'),cb=document.createElement('input');cb.type='checkbox';cb.checked=!!o.loop;cb.onchange=()=>{const live=item(o.id);if(live){live.loop=cb.checked;save()}};loop.append(cb,'Loop playlist');transport.append(loop);audio.onended=()=>{if(index+1<tracks.length)choose(index+1,true);else if(item(o.id)?.loop)choose(0,true)};controls.append(now,audio,transport,list,containerButton('+ Add audio',()=>pickContainerFiles('audioFiles',o.id)));choose(0)}
else if(o.type==='bookmarks'){renderBookmarks(o,controls)}
else if(o.type==='checklist'){const list=document.createElement('div');for(const task of o.tasks||[]){const row=document.createElement('div');row.className='task-row';const cb=document.createElement('input');cb.type='checkbox';cb.checked=!!task.done;cb.onchange=()=>{checkpoint();const t=item(o.id)?.tasks.find(x=>x.id===task.id);if(t){t.done=cb.checked;save();row.classList.toggle('completed',cb.checked)}};row.classList.toggle('completed',!!task.done);const input=document.createElement('input');input.value=task.text;input.setAttribute('aria-label','Task');input.onchange=()=>{checkpoint();const t=item(o.id)?.tasks.find(x=>x.id===task.id);if(t){t.text=input.value;save()}};row.append(cb,input,containerButton('×',()=>mutateContainer(o.id,x=>x.tasks=x.tasks.filter(t=>t.id!==task.id))));list.append(row)}const field=document.createElement('input');field.placeholder='Add a task…';const submit=()=>{if(!field.value.trim())return;mutateContainer(o.id,x=>x.tasks.push({id:crypto.randomUUID(),text:field.value.trim(),done:false}))};field.onkeydown=e=>{if(e.key==='Enter')submit()};controls.append(list,field,containerButton('+ Add task',submit))}
else{const pictures=o.pictures||[];let index=0;const img=document.createElement('img');img.className='gallery-picture';const caption=document.createElement('div');caption.className='now-playing';function show(){if(pictures.length){img.src=pictures[index].src;img.alt=pictures[index].name;caption.textContent=`${index+1} / ${pictures.length} · ${pictures[index].name}`}else{img.removeAttribute('src');caption.textContent='Add images to start'}}const nav=document.createElement('div');nav.className='transport';nav.append(containerButton('← Previous',()=>{index=(index-1+pictures.length)%pictures.length;show()}),containerButton('Next →',()=>{index=(index+1)%pictures.length;show()}),containerButton('Remove',()=>{if(pictures.length)mutateContainer(o.id,x=>x.pictures.splice(index,1))}));controls.append(img,caption,nav,containerButton('+ Add pictures',()=>pickContainerFiles('galleryFiles',o.id)));show()}
containerCache.set(o.id,{signature,el:root});return root}
let uploadTarget=null;
function pickContainerFiles(id,target=null){uploadTarget=target;$(id).click()}
function editContainer(o){const name=prompt('Container title',o.title||'');if(name!==null)mutateContainer(o.id,x=>x.title=name)}
async function readContainerFiles(files,type){const valid=[...files].filter(f=>type==='playlist'?/\.(mp3|wav)$/i.test(f.name):f.type.startsWith('image/'));if(!valid.length){status(type==='playlist'?'Choose MP3 or WAV files':'Choose image files');return[]}return Promise.all(valid.map(f=>new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve({name:f.name,src:r.result});r.onerror=reject;r.readAsDataURL(f)})))}
addEventListener('DOMContentLoaded',()=>{$('library').onclick=()=>$('libraryDialog').showModal();$('addPlaylist').onclick=()=>{$('libraryDialog').close();pickContainerFiles('audioFiles')};$('addGallery').onclick=()=>{$('libraryDialog').close();pickContainerFiles('galleryFiles')};$('addBookmarks').onclick=()=>{$('libraryDialog').close();add({type:'bookmarks',title:'Favorite links',links:[],w:380,h:340})};$('addChecklist').onclick=()=>{$('libraryDialog').close();add({type:'checklist',title:'My checklist',tasks:[{id:crypto.randomUUID(),text:'Make something wonderful',done:false}],w:340,h:300})};for(const[id,type,key]of[['audioFiles','playlist','tracks'],['galleryFiles','gallery','pictures']])$(id).onchange=async e=>{const target=uploadTarget;uploadTarget=null;try{status('Reading files…');const entries=await readContainerFiles(e.target.files,type);if(entries.length){if(target&&item(target))mutateContainer(target,o=>o[key].push(...entries));else add({type,title:type==='playlist'?'My playlist':'My gallery',[key]:entries,w:390,h:type==='playlist'?360:420})}}catch{status('Could not read selected files')}e.target.value=''}});

function normalizeBookmarkUrl(value){
 const raw=value.trim();if(!raw)throw Error('Enter a URL.');
 const parsed=new URL(/^[a-z][a-z0-9+.-]*:/i.test(raw)?raw:'https://'+raw);
 if(!['http:','https:'].includes(parsed.protocol)||!parsed.hostname)throw Error('Use an http or https link.');
 return parsed.href;
}
function renderBookmarks(o,controls){
 const editingLinks=!!o.editingLinks;
 controls.classList.add('bookmark-controls');controls.classList.toggle('bookmarks-view',!editingLinks);
 const modeBar=document.createElement('div');modeBar.className='bookmark-mode-bar';
 const toggle=containerButton(editingLinks?'✓ Done':'Edit links',()=>mutateContainer(o.id,x=>x.editingLinks=!x.editingLinks));
 toggle.setAttribute('aria-pressed',String(editingLinks));modeBar.append(toggle);controls.append(modeBar);
 const list=document.createElement('div');list.className='bookmark-list';
 const form=document.createElement('form');form.className='bookmark-form';
 const name=document.createElement('input');name.placeholder='Name (leave blank to fetch page title)';name.setAttribute('aria-label','Link name');
 const url=document.createElement('input');url.placeholder='https://example.com';url.setAttribute('aria-label','Link URL');url.required=true;
 const feedback=document.createElement('div');feedback.className='bookmark-feedback';feedback.setAttribute('role','status');
 let editing=null;const submit=document.createElement('button');submit.type='submit';submit.textContent='+ Add link';
 const cancel=containerButton('Cancel',()=>{editing=null;name.value='';url.value='';feedback.textContent='';submit.textContent='+ Add link';cancel.hidden=true});cancel.hidden=true;
 const links=o.links||[];
 if(!links.length){const empty=document.createElement('p');empty.textContent=editingLinks?'Add your favorite corners of the web below.':'No links yet. Click Edit links to add some.';empty.className='bookmark-empty';list.append(empty)}
 links.forEach((link,index)=>{
  const row=document.createElement('div');row.className='bookmark-row';const a=document.createElement('a');
  try{a.href=normalizeBookmarkUrl(link.url)}catch{a.removeAttribute('href')}
  a.target='_blank';a.rel='noopener noreferrer';a.textContent=link.name||link.url;a.title=link.url;
  const actions=document.createElement('div');actions.className='bookmark-actions';
  const edit=containerButton('Edit',()=>{editing=link.id;name.value=link.name||'';url.value=link.url;submit.textContent='Save link';cancel.hidden=false;feedback.textContent='';name.focus()});
  const remove=containerButton('×',()=>mutateContainer(o.id,x=>x.links=x.links.filter(l=>l.id!==link.id)));remove.setAttribute('aria-label','Remove '+(link.name||link.url));
  const up=containerButton('↑',()=>{if(index>0)mutateContainer(o.id,x=>{[x.links[index-1],x.links[index]]=[x.links[index],x.links[index-1]]})});up.disabled=index===0;up.title='Move up';
  const down=containerButton('↓',()=>{if(index+1<links.length)mutateContainer(o.id,x=>{[x.links[index+1],x.links[index]]=[x.links[index],x.links[index+1]]})});down.disabled=index===links.length-1;down.title='Move down';
  actions.append(up,down,edit,remove);row.append(a);if(editingLinks)row.append(actions);list.append(row);
 });
 form.append(name,url,submit,cancel,feedback);form.onsubmit=async e=>{e.preventDefault();let normalized;try{normalized=normalizeBookmarkUrl(url.value)}catch(err){feedback.textContent='Enter a valid http or https URL.';return}
 const editingId=editing,customName=name.value.trim();let label=customName||new URL(normalized).hostname;
 submit.disabled=true;feedback.textContent=customName?'Saving…':'Fetching page title…';
 if(!customName){const fetched=await fetchBookmarkTitle(normalized);if(fetched)label=fetched}
 if(!item(o.id)){submit.disabled=false;return}
 mutateContainer(o.id,x=>{if(editingId){const link=x.links.find(l=>l.id===editingId);if(link)Object.assign(link,{name:label,url:normalized})}else x.links.push({id:crypto.randomUUID(),name:label,url:normalized})});
 submit.disabled=false;
};
 controls.append(list);if(editingLinks){
 const access=document.createElement('div');access.className='bookmark-access';
 const accessStatus=document.createElement('span');accessStatus.textContent='Enable once to fetch titles without prompts.';
 const enable=containerButton('Enable automatic titles',async()=>{
  if(!globalThis.chrome?.permissions?.request){accessStatus.textContent='Available when installed in Chrome.';return}
  try{
   const pending=chrome.permissions.request({origins:['https://*/*','http://*/*']});
   enable.disabled=true;const granted=await pending;
   accessStatus.textContent=granted?'Automatic titles enabled for all websites.':'Access declined. Links still save with domain names.';
   enable.textContent=granted?'Automatic titles enabled':'Enable automatic titles';enable.disabled=granted;
  }catch{accessStatus.textContent='Could not grant access. Try again.';enable.disabled=false}
 });
 access.append(enable,accessStatus);controls.append(access,form);
 if(globalThis.chrome?.permissions?.contains)chrome.permissions.contains({origins:['https://*/*','http://*/*']}).then(granted=>{if(granted){enable.textContent='Automatic titles enabled';enable.disabled=true;accessStatus.textContent='No permission prompts when adding links.'}}).catch(()=>{});
}
}

async function fetchBookmarkTitle(url){
 let timer;
 try{
  const parsed=new URL(normalizeBookmarkUrl(url));
  if(!globalThis.chrome?.permissions?.contains)return null;
  // Automatic lookup never opens a permission dialog. Grant access explicitly once.
  const granted=await chrome.permissions.contains({origins:[`${parsed.protocol}//${parsed.hostname}/*`]});
  if(!granted)return null;
  const abort=new AbortController();timer=setTimeout(()=>abort.abort(),8000);
  const response=await fetch(parsed.href,{signal:abort.signal,credentials:'omit',referrerPolicy:'no-referrer'});
  if(!response.ok||!/(text\/html|application\/xhtml\+xml)/i.test(response.headers.get('content-type')||''))return null;
  const reader=response.body.getReader(),decoder=new TextDecoder();let html='',bytes=0;
  try{while(bytes<2097152){const {done,value}=await reader.read();if(done)break;bytes+=value.length;if(bytes>2097152)break;html+=decoder.decode(value,{stream:true});if(/<\/title\s*>/i.test(html)||/<\/head\s*>/i.test(html))break}}finally{await reader.cancel()}
  const raw=html.match(/<title(?:\s[^>]*)?>([\s\S]*?)<\/title\s*>/i)?.[1];if(!raw)return null;
  // Decode entities in a text-only fragment; never insert remote page markup.
  const safe=raw.replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const title=new DOMParser().parseFromString(`<body>${safe}</body>`,'text/html').body.textContent.replace(/\s+/g,' ').trim().slice(0,300);
  return title||null;
 }catch{return null}finally{clearTimeout(timer)}
}
