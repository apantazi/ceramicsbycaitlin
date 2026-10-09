const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
async function build() {
  await fs.mkdir(output, { recursive: true });
  for (const name of ['index.html', 'styles.css', 'app.js', 'CNAME']) await fs.copyFile(path.join(root, name), path.join(output, name));
  const catalog = JSON.parse(await fs.readFile(path.join(root, 'catalog.json'), 'utf8'));
  await fs.writeFile(path.join(output, 'content.js'), 'window.CATALOG = ' + JSON.stringify(catalog) + ';\n', 'utf8');
  for (const directory of ['images', 'media/photos', 'media/videos']) await fs.cp(path.join(root, directory), path.join(output, directory), { recursive: true });
  await fs.writeFile(path.join(output, '.nojekyll'), '');
  console.log('Static portfolio built in dist. Local editor and original media are excluded.');
}
build().catch(error => { console.error(error.message); process.exitCode = 1; });
