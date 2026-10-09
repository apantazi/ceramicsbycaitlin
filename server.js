const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = __dirname, dataFile = path.join(root,'catalog.json');
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.mp4':'video/mp4'};
let saving = false;
http.createServer(async (req,res) => {
 try {
  const url = new URL(req.url,'http://localhost');
  if (url.pathname === '/api/catalog') {
   res.setHeader('Cache-Control','no-store');
   if (req.method === 'GET') {res.setHeader('Content-Type','application/json');res.end(await fs.readFile(dataFile));return;}
   if (req.method !== 'PUT') {res.writeHead(405).end();return;}
   if (req.headers.origin !== `http://${req.headers.host}` || req.headers['content-type'] !== 'application/json') {res.writeHead(403).end('Use the local editor.');return;}
   let body = '';for await (const chunk of req) {body += chunk;if (Buffer.byteLength(body)>2000000) {res.writeHead(413).end();return;}}
   const data = JSON.parse(body);
   if (!Array.isArray(data.categories)||!Array.isArray(data.pieces)||data.pieces.length>500||data.categories.some(c=>typeof c!=='string'||!c.trim())) throw Error('Invalid catalog');
   for(const p of data.pieces) if(typeof p.id!=='string'||typeof p.title!=='string'||!p.title.trim()||!data.categories.includes(p.category)||typeof p.published!=='boolean'||!Array.isArray(p.images)||!p.images.length||p.images.some(i=>typeof i!=='string'||!/^images\/[\w .-]+\.(jpg|png|webp)$/i.test(i))||['alt','description','height','width','capacity'].some(k=>typeof p[k]!=='string')) throw Error('Invalid piece');
   if (saving) {res.writeHead(409).end('Another save is in progress.');return;}
   saving = true;
   try {await fs.copyFile(dataFile,dataFile+'.backup');await fs.writeFile(dataFile+'.tmp',JSON.stringify(data,null,2));await fs.rename(dataFile+'.tmp',dataFile);await fs.writeFile(path.join(root,'content.js'),'window.CATALOG = '+JSON.stringify(data,null,2)+';\n');} finally {saving=false;}
   res.setHeader('Content-Type','application/json');res.end('{"saved":true}');return;
  }
  const file=path.resolve(root,'.'+(url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname)));
  const relative=path.relative(root,file);
  if(relative.startsWith('..')||path.isAbsolute(relative)||!(/^(index\.html|admin\.html|styles\.css|admin\.css|app\.js|admin\.js|content\.js)$/.test(relative)||/^images[\\/][\w .-]+\.(jpg|png|webp)$/i.test(relative)||/^media[\\/](photos[\\/][\w .-]+\.jpg|videos[\\/][\w .-]+\.mp4)$/i.test(relative))) {res.writeHead(404).end();return;}
  const bytes=await fs.readFile(file);
  res.setHeader('Accept-Ranges','bytes');
  if (req.headers.range) {
    const match = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range);
    if (!match) { res.writeHead(416, {'Content-Range':'bytes */'+bytes.length}).end(); return; }
    const start=Number(match[1]),end=match[2]?Math.min(Number(match[2]),bytes.length-1):bytes.length-1;
    if (start>end || start>=bytes.length) {res.writeHead(416,{'Content-Range':'bytes */'+bytes.length}).end();return;}
    res.writeHead(206,{'Content-Type':mime[path.extname(file)],'Content-Range':`bytes ${start}-${end}/${bytes.length}`,'Content-Length':end-start+1});res.end(bytes.subarray(start,end+1));return;
  }
  res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');res.setHeader('Cache-Control','no-cache');res.end(bytes);
 } catch(error) {res.writeHead(error.code==='ENOENT'?404:400).end('Could not complete the request.');}
}).listen(process.env.PORT||5173,'127.0.0.1',()=>console.log('Portfolio: http://localhost:'+(process.env.PORT||5173)+' · Editor: /admin.html'));
