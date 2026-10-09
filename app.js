const catalog = window.CATALOG;
const gallery = document.querySelector('#gallery');
const dialog = document.querySelector('#piece-dialog');
const tabs = document.querySelector('#category-tabs');
const published = catalog.pieces.filter(p => p.published);
const categories = catalog.categories.filter(c => published.some(p => p.category === c));
let current = categories[0];
function showPiece(piece, src = piece.images[0]) {
  const image = document.querySelector('#piece-image');
  image.src = src; image.alt = piece.alt;
  document.querySelector('#piece-title').textContent = piece.title;
  document.querySelector('#piece-description').textContent = piece.description;
  document.querySelector('#piece-dimensions').textContent = [['Height',piece.height],['Width',piece.width],['Capacity',piece.capacity]].filter(v => v[1]).map(v => v.join(': ')).join(' · ');
  const details = document.querySelector('#piece-sales-details'); details.replaceChildren();
  [['Price',piece.price],['Availability',piece.availability],['Care',piece.care],['Shipping / pickup',piece.shipping]].filter(row=>row[1]).forEach(([label,value])=>{const term=document.createElement('dt');term.textContent=label;const text=document.createElement('dd');text.textContent=value;details.append(term,text);});
  const thumbs = document.querySelector('#piece-thumbnails'); thumbs.replaceChildren();
  piece.images.forEach((src,i) => {
    const button = document.createElement('button'); button.type = 'button'; button.setAttribute('aria-label','View photo '+(i+1));
    const thumb = document.createElement('img'); thumb.src = src; thumb.alt = ''; button.append(thumb); button.setAttribute('aria-pressed',String(src===image.getAttribute('src')));
    button.onclick = () => { image.src = src; thumbs.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button))); }; thumbs.append(button);
  });
  dialog.showModal();
}
function section(pieces, heading) {
  if (!pieces.length) return;
  if (heading) { const h = document.createElement(current === 'Mugs' && heading !== 'Everyday mugs' ? 'h4' : 'h3'); h.className = 'collection-title'; h.textContent = heading; gallery.append(h); }
  const grid = document.createElement('div'); grid.className = 'gallery photo-group';
  pieces.forEach(piece => {
    piece.images.slice(0, /corporate goon/i.test(piece.title) ? 4 : 2).forEach((src, i) => {
      const button = document.createElement('button'); button.className = 'piece'; button.type = 'button';
      button.setAttribute('aria-label', 'View ' + piece.title + ', photo ' + (i + 1));
      const image = document.createElement('img'); image.src = src; image.alt = piece.alt; image.loading = 'lazy';
      button.append(image); button.onclick = () => showPiece(piece, src); grid.append(button);
    });
  }); gallery.append(grid);
}
function render() {
  gallery.replaceChildren();
  tabs.querySelectorAll('button').forEach(b => { const active = b.textContent === current; b.setAttribute('aria-pressed',String(active)); b.classList.toggle('active',active); });
  const pots = published.filter(p => p.category === current);
  if (current === 'Mugs') {
    const purpose = pots.filter(p => p.purpose);
    if (purpose.length) { const h = document.createElement('h3'); h.className = 'collection-title'; h.textContent = 'Drink your coffee with a purpose'; gallery.append(h); }
    section(purpose.filter(p => /fight fascism/i.test(p.title)), 'Fight fascism');
    section(purpose.filter(p => !/fight fascism/i.test(p.title)), 'No corporate goon can make me use AI');
    section(pots.filter(p => !p.purpose), 'Everyday mugs');
  } else section(pots);
}
categories.forEach(c => { const button = document.createElement('button'); button.type = 'button'; button.textContent = c; button.onclick = () => { current = c; render(); }; tabs.append(button); });
if (!categories.length) gallery.textContent = 'New pottery coming soon. Follow Caitlin on Instagram for new pieces.';
else render();
dialog.querySelector('.close').onclick = () => dialog.close();
dialog.addEventListener('click', event => { const box = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close(); });
document.querySelector('#year').textContent = new Date().getFullYear();

const studioMedia = [
  {type:'photo',src:'media/photos/caitlin-at-the-wheel-laughing.jpg',title:'At the wheel',alt:'Caitlin laughing while centering clay at the pottery wheel',note:'Caitlin in the pottery studio.'},
  {type:'video',src:'media/videos/caitlin-throwing-pottery-at-the-wheel.mp4',poster:'media/photos/caitlin-throwing-pottery-at-the-wheel-poster.jpg',title:'From clay to a pot',note:'23-second silent film of Caitlin throwing pottery.',duration:'23 sec'},
  {type:'photo',src:'media/photos/carved-pots-drying-before-firing.jpg',title:'Before the firing',alt:'Carved pots drying upside down before firing',note:'Carving, texture, and a batch waiting for the kiln.'},
  {type:'video',src:'media/videos/caitlin-shaping-a-pot-close-up.mp4',poster:'media/photos/caitlin-shaping-a-pot-close-up-poster.jpg',title:'A closer look at the making',note:'18-second silent film of Caitlin shaping a pot.',duration:'18 sec'}
];
const studioViewer=document.querySelector('#studio-dialog');
const studioVideo=document.querySelector('#studio-full-video');
const studioImage=document.querySelector('#studio-full-image');
let studioIndex=0;
function stopStudioVideo(){studioVideo.pause();studioVideo.removeAttribute('src');studioVideo.load();}
function displayStudio(index){
  stopStudioVideo();studioIndex=(index+studioMedia.length)%studioMedia.length;
  const media=studioMedia[studioIndex];
  studioImage.hidden=media.type!=='photo';studioVideo.hidden=media.type!=='video';
  document.querySelector('#studio-position').textContent=(studioIndex+1)+' / '+studioMedia.length;
  document.querySelector('#studio-video-status').textContent='';
  if(media.type==='photo'){studioImage.src=media.src;studioImage.alt=media.alt;}
  else {studioVideo.src=media.src;studioVideo.poster=media.poster;studioVideo.play().catch(()=>{document.querySelector('#studio-video-status').textContent='Press Play to watch the film.';});}
}
studioMedia.forEach((media,index)=>{
  const button=document.createElement('button');button.type='button';button.className='studio-card '+media.type;
  button.setAttribute('aria-label',media.title);
  const image=document.createElement('img');image.src=media.poster||media.src;image.alt=media.alt||'';image.loading='lazy';button.append(image);
  if(media.type==='video'){const play=document.createElement('span');play.className='play-icon';play.setAttribute('aria-hidden','true');play.textContent='\u25b6';button.append(play);const time=document.createElement('span');time.className='film-duration';time.textContent=media.duration;button.append(time);}
  button.onclick=()=>{studioViewer.showModal();displayStudio(index);};document.querySelector('#studio-gallery').append(button);
});
studioViewer.querySelector('.close').onclick=()=>studioViewer.close();
studioViewer.addEventListener('close',stopStudioVideo);
studioViewer.addEventListener('click',event=>{const box=studioViewer.getBoundingClientRect();if(event.target===studioViewer&&(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom))studioViewer.close();});
document.querySelector('#studio-previous').onclick=()=>displayStudio(studioIndex-1);
document.querySelector('#studio-next').onclick=()=>displayStudio(studioIndex+1);
studioViewer.addEventListener('keydown',event=>{if(event.target===studioVideo)return;if(event.key==='ArrowRight'){event.preventDefault();displayStudio(studioIndex+1);}if(event.key==='ArrowLeft'){event.preventDefault();displayStudio(studioIndex-1);}});
studioVideo.addEventListener('error',()=>{if(studioVideo.hasAttribute('src'))document.querySelector('#studio-video-status').textContent='The film could not load. Please try again.';});
