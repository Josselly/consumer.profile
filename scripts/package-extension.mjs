import fs from 'node:fs/promises';
import path from 'node:path';
import JSZip from 'jszip';
const zip=new JSZip();
async function walk(dir,prefix=''){for(const item of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,item.name),name=prefix+item.name;if(item.isDirectory())await walk(file,name+'/');else zip.file(name,await fs.readFile(file));}}
await walk('extension');await fs.mkdir('public',{recursive:true});await fs.writeFile('public/extension.zip',await zip.generateAsync({type:'nodebuffer',compression:'DEFLATE'}));console.log('Packaged public/extension.zip');
