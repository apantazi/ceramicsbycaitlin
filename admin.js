let catalog = structuredClone(window.CATALOG);
let selected = catalog.pieces[0];
let dirty = false;
const form = document.querySelector('#piece-form'), list = document.querySelector('#piece-list'), status = document.querySelector('#status');
const textFields = ['title','category','height','width','capacity','description','alt','price','availability','care','shipping'];
function renderList() {
 list.replaceChildren();
 catalog.pieces.forEach(p => {const b=document.createElement('button');b.type='button';b.textContent=p.title+(p.published?'':' (hidden)');b.classList.toggle('active',p===selected);b.onclick=()=>{selected=p;renderForm();renderList();};list.append(b);});
}
function preview() {
 const box=document.querySelector('#photo-preview');box.replaceChildren();
 selected.images.forEach(src=>{const img=document.createElement('img');img.src=src;img.alt=selected.alt||'Pottery preview';box.append(img);});
}
function renderForm() {
 const select=form.elements.category;select.replaceChildren();catalog.categories.forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;select.append(o);});
 textFields.forEach(k=>form.elements[k].value=selected[k]||'');
 form.elements.purpose.checked=!!selected.purpose;form.elements.published.checked=selected.published;
 form.elements.images.value=selected.images.join('\n');preview();
}
form.addEventListener('submit',e=>e.preventDefault());
form.addEventListener('input',()=>{textFields.forEach(k=>selected[k]=form.elements[k].value);selected.purpose=form.elements.purpose.checked;selected.published=form.elements.published.checked;selected.images=form.elements.images.value.split('\n').map(s=>s.trim()).filter(Boolean);dirty=true;status.textContent='Unsaved changes';renderList();preview();});
document.querySelector('#hide-piece').onclick=()=>{selected.published=false;dirty=true;renderForm();renderList();status.textContent='Hidden in draft. Save website to apply.';};
document.querySelector('#new-piece').onclick=()=>{selected={id:crypto.randomUUID(),title:'New pot',category:catalog.categories[0],purpose:false,published:false,images:[],height:'',width:'',capacity:'',description:'',alt:'',price:'',availability:'',care:'',shipping:''};catalog.pieces.push(selected);dirty=true;renderForm();renderList();status.textContent='New draft. Add photos before saving.';};
const categoryField=document.querySelector('#categories');categoryField.value=catalog.categories.join('\n');
categoryField.addEventListener('change',()=>{const values=[...new Set(categoryField.value.split('\n').map(s=>s.trim()).filter(Boolean))];if(!values.length||catalog.pieces.some(p=>!values.includes(p.category))){status.textContent='Keep at least one category and all categories currently used by pots.';categoryField.value=catalog.categories.join('\n');return;}catalog.categories=values;dirty=true;renderForm();status.textContent='Categories updated in draft. Save website to apply.';});
document.querySelector('#save').onclick=async()=>{
 if(catalog.pieces.some(p=>!p.title.trim()||!p.images.length||p.images.some(i=>!/^images\/[\w .-]+\.(jpg|png|webp)$/i.test(i)))){status.textContent='Each pot needs a name and at least one JPG, PNG, or WebP path in images/.';return;}
 const button=document.querySelector('#save');button.disabled=true;status.textContent='Saving…';
 try{const response=await fetch('/api/catalog',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(catalog)});if(!response.ok)throw Error('Save failed. Run npm start and open the editor on localhost.');dirty=false;status.textContent='Saved to website files. Refresh the portfolio to see changes.';}catch(error){status.textContent=error.message;}finally{button.disabled=false;}
};
window.addEventListener('beforeunload',event=>{if(dirty){event.preventDefault();event.returnValue='';}});
renderList();renderForm();
