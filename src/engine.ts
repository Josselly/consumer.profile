import Papa from 'papaparse';
import JSZip from 'jszip';

export type RecordItem = {id:string; title:string; url:string; domain:string; time:number; source:string; category:string; brand?:string; shopping:boolean; text?:string};
export type Product = {id:string; name:string; url:string; category:string; price?:number; currency:string; image?:string; capturedAt?:string; provenance:string};
export type Feedback = Record<string,'accurate'|'inaccurate'|'uncertain'>;
export type ImportResult = {records:RecordItem[]; products:Product[]; skipped:number; warnings:string[]};
export const categories = [
  {name:'Technology', color:'#a99bff', words:/\b(laptop|computer|keyboard|camera|headphone|smartphone|software|gaming|monitor|electronics|tablet)\b/i, domains:['bestbuy.com','newegg.com','theverge.com','microcenter.com','apple.com'], brands:['Apple','Samsung','Sony','Dell','Lenovo','Nvidia','Logitech']},
  {name:'Style & beauty', color:'#f0a7c5', words:/\b(fashion|sneaker|clothing|dress|outfit|handbag|makeup|cosmetic|skincare)\b/i, domains:['sephora.com','ulta.com','zara.com','uniqlo.com','nordstrom.com'], brands:['Nike','Adidas','Uniqlo','Zara','Sephora','Lululemon']},
  {name:'Home & living', color:'#f3c67a', words:/\b(furniture|decor|sofa|kitchen|bedding|garden|interior|cookware)\b/i, domains:['ikea.com','wayfair.com','homedepot.com','westelm.com'], brands:['Ikea','Dyson','KitchenAid','West Elm']},
  {name:'Travel & outdoors', color:'#8bcce8', words:/\b(travel|hotel|flight|hiking|camping|luggage|backpack|outdoor|vacation)\b/i, domains:['booking.com','airbnb.com','rei.com','expedia.com'], brands:['Patagonia','REI','Osprey','Samsonite']},
  {name:'Food & cooking', color:'#b9e69b', words:/\b(recipe|cooking|coffee|restaurant|baking|grocery|espresso|cookbook)\b/i, domains:['allrecipes.com','seriouseats.com','foodnetwork.com','wholefoodsmarket.com'], brands:['Nespresso','Breville','Starbucks']},
  {name:'Arts & entertainment', color:'#eaa782', words:/\b(music|movie|cinema|book|novel|concert|photography|illustration|art supplies)\b/i, domains:['spotify.com','netflix.com','goodreads.com','imdb.com','bandcamp.com'], brands:['Kindle','Spotify','Netflix']},
];
// A conservative exclusion layer, not a guarantee of identifying every sensitive record.
export const sensitive = /\b(cancer|diagnosis|therapy|therapist|mental health|depression|anxiety|diabetes|pregnan\w*|abortion|sexual\w*|porn\w*|gay|lesbian|bisexual|transgender|religio\w*|church|mosque|bible|quran|christian|muslim|jewish|politic\w*|democrat\w*|republican\w*|election|vot(e|ing)|medical|patient|hospital|banking|bank account|credit score|social security|password|auth|token)\b/i;
const blockedDomains = /(^|\.)(webmd|healthline|mayoclinic|plannedparenthood|chase|bankofamerica|wellsfargo|mychart|pornhub|xvideos)\./i;
export function safeUrl(value:unknown):string {
  try { const u=new URL(String(value)); if(!['https:','http:'].includes(u.protocol)||u.username||u.password)return ''; u.search='';u.hash=''; return u.href; } catch {return '';}
}
export function classify(text:string,domain='') {return categories.find(c=>c.domains.some(d=>domain===d||domain.endsWith('.'+d))||c.words.test(text))?.name??'Uncategorized';}
export function normalizeTime(v:unknown):number {
  if(v===null||v===undefined||v==='')return NaN;
  const n=Number(v);
  if(Number.isFinite(n)) { if(n>1e16)return n/1000-11644473600000; if(n>1e14)return n/1000; if(n<1e11)return n*1000; return n; }
  return Date.parse(String(v));
}
function ownWords(text:string) {return text.replace(/```[\s\S]*?```/g,' ').split('\n').filter(l=>!/^\s*>/.test(l)).join(' ').replace(/"[^"\n]*"|“[^”]*”|«[^»]*»/g,' ').slice(0,3000);}
type Raw = Record<string,any>;
export function normalizeRows(rows:Raw[],source:string):ImportResult {
  if(rows.length>50000)throw new Error('Import exceeds 50,000 records. Split your export into smaller files.');
  const result:ImportResult={records:[],products:[],skipped:0,warnings:[]};
  const add=(raw:Raw,index:number)=>{
    if(!raw||typeof raw!=='object'){result.skipped++;return;}
    const rawUrl=raw.url??raw.titleUrl??raw.link??raw.URL??'';
    const url=safeUrl(rawUrl); const domain=url?new URL(url).hostname.replace(/^www\./,''):'';
    const title=String(raw.title??raw.name??raw.product_name??raw.pageTitle??'').replace(/^Visited /,'').slice(0,300);
    if(sensitive.test(title+' '+url)||blockedDomains.test(domain)){result.skipped++;return;}
    const hasDate=raw.time??raw.timestamp??raw.date??raw.ordered_at??raw.order_date;
    if(raw.type==='product'||((raw.product_name||raw.productName)&&!hasDate)){
      const name=String(raw.product_name??raw.productName??raw.name??raw.title??'').slice(0,200);
      if(!url||!name){result.skipped++;return;}
      const rawPrice=String(raw.price??'').replace(/[^\d.\-]/g,''); const price=rawPrice?Number(rawPrice):undefined;
      result.products.push({id:crypto.randomUUID(),name,url,category:classify(name,domain),price:price!==undefined&&Number.isFinite(price)&&price>=0?price:undefined,currency:['USD','CAD','EUR','GBP','AUD','JPY','MXN'].includes(raw.currency)?raw.currency:'USD',image:safeUrl(raw.image??raw.image_url)||undefined,capturedAt:typeof(raw.capturedAt??raw.captured_at)==='string'?(raw.capturedAt??raw.captured_at):undefined,provenance:'User-provided catalog · price not independently verified'});return;
    }
    const time=normalizeTime(raw.time??raw.timestamp??raw.lastVisitTime??raw.visitTime??raw.date??raw.ordered_at??raw.order_date??raw.last_visit_time??raw.time_usec);
    if(!Number.isFinite(time)||time<946684800000||time>Date.now()+86400000||(!url&&!raw.userText)){result.skipped++;return;}
    const text=raw.userText?ownWords(String(raw.userText)):undefined;
    if(text&&sensitive.test(text)){result.skipped++;return;}
    const evidenceText=(text??title)+' '+domain;
    const category=classify(evidenceText,domain);
    const brand=categories.flatMap(c=>c.brands).find(b=>new RegExp('\\b'+b.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i').test(evidenceText));
    result.records.push({id:crypto.randomUUID(),title:text?'User-authored conversation statement':title||domain,url,domain:domain||'User statements',time,source,category,brand,shopping:raw.type==='order'||/\b(shop|buy|price|cart|deal|sale|review|compare|order|purchase)\b/i.test(evidenceText)||/amazon\.|walmart\.|target\.|bestbuy\.|etsy\./.test(domain),text});
    if(index>=50000)throw new Error('Import exceeds 50,000 records. Split your export into smaller files.');
  };
  rows.forEach(add); return result;
}
export function parseJson(data:any,source:string):ImportResult {
  const rows:Raw[]=[]; const warnings:string[]=[];
  if(Array.isArray(data)&&data.some(d=>d?.mapping)){
    for(const conversation of data){ for(const node of Object.values(conversation.mapping??{}) as any[]){const m=node?.message;if(m?.author?.role==='user'){const text=(m.content?.parts??[]).filter((p:any)=>typeof p==='string').join('\n');rows.push({userText:text,time:m.create_time});}} }
    warnings.push('Only user-authored messages were read. Assistant, system, and tool messages were excluded. Quote removal is heuristic; review your evidence before accepting inferences.');
  }else if(Array.isArray(data))rows.push(...data);
  else {const list=data?.['Browser History']??data?.history??data?.records??data?.products??data?.orders??data?.items;if(!Array.isArray(list))throw new Error('Unsupported JSON structure. Use an array, Browser History, history, records, products, or orders.'); rows.push(...list.map((r:Raw)=>data.products?{...r,type:'product'}:data.orders?{...r,type:'order'}:r));}
  if(rows.length>50000)throw new Error('This file has over 50,000 records. Split it before importing.');
  const result=normalizeRows(rows,source); result.warnings.push(...warnings); return result;
}
export async function parseFile(file:File):Promise<ImportResult>{
  if(file.size>30*1024*1024)throw new Error('Choose a file smaller than 30 MB.');
  if(file.name.toLowerCase().endsWith('.zip')){
    const zip=await JSZip.loadAsync(await file.arrayBuffer()); const entries=Object.values(zip.files).filter(e=>!e.dir&&/((conversations|history|myactivity)\.json|\.csv)$/i.test(e.name));
    if(entries.length>10||entries.reduce((sum,e)=>sum+((e as any)._data?.uncompressedSize??Infinity),0)>30*1024*1024)throw new Error('ZIP expands beyond the 30 MB / 10-file limit. Extract the intended file first.');
    if(!entries.length)throw new Error('No supported history, conversations, or CSV file in this ZIP.');
    const out:ImportResult={records:[],products:[],skipped:0,warnings:[]};
    for(const entry of entries.slice(0,10)){
      const declared=(entry as any)._data?.uncompressedSize;
      if(!Number.isFinite(declared)||declared>30*1024*1024)throw new Error('ZIP entry is too large. Extract the intended JSON or CSV file first.');
      const body=await entry.async('uint8array'); if(body.byteLength>30*1024*1024)throw new Error('Expanded file exceeds 30 MB.');
      const parsed=await parseFile(new File([new Uint8Array(body).buffer],entry.name)); out.records.push(...parsed.records);out.products.push(...parsed.products);out.skipped+=parsed.skipped;out.warnings.push(...parsed.warnings);
      if(out.records.length>50000)throw new Error('Import exceeds 50,000 records.');
    }return out;
  }
  const body=await file.text();
  if(file.name.toLowerCase().endsWith('.csv')){
    const parsed=Papa.parse<Raw>(body,{header:true,skipEmptyLines:true}); if(parsed.errors.some(e=>e.type==='Quotes'))throw new Error('Malformed CSV quoting.');
    return normalizeRows(parsed.data,file.name.toLowerCase().includes('order')?'Order import':'CSV import');
  }
  try{return parseJson(JSON.parse(body),'JSON import');}catch(e){throw new Error(e instanceof SyntaxError?'Invalid JSON. Choose a supported export.':String((e as Error).message));}
}
export function deduplicate(records:RecordItem[]){const seen=new Set<string>();return records.filter(r=>{const k=[r.url,r.time,r.text??r.title].join('|');if(seen.has(k))return false;seen.add(k);return true;});}
export function analyze(records:RecordItem[],feedback:Feedback={}){
  const sorted=[...records].sort((a,b)=>a.time-b.time); const n=records.length;
  const interests=categories.map(c=>{const evidence=records.filter(r=>r.category===c.name);return {...c,count:evidence.length,share:n?evidence.length/n:0,evidence,confidence:evidence.length>=10?'Moderate':evidence.length>=3?'Low':'INSUFFICIENT DATA',accepted:feedback[c.name]!=='inaccurate'};}).filter(c=>c.count>0).sort((a,b)=>b.count-a.count);
  const domains=new Map<string,RecordItem[]>();records.forEach(r=>domains.set(r.domain,[...(domains.get(r.domain)??[]),r]));
  const shopping=records.filter(r=>r.shopping);const shops=new Set(shopping.map(r=>r.domain));
  const brands=[...new Set(records.map(r=>r.brand).filter(Boolean))];
  const first=sorted[0]?.time,last=sorted.at(-1)?.time;
  const repeats=[...domains.values()].filter(r=>r.length>1).reduce((s,r)=>s+r.length,0);
  const compared=shopping.filter(r=>/\b(compare|comparison|versus|vs|review)\b/i.test(r.title+' '+r.text));
  const deals=shopping.filter(r=>/\b(price|deal|discount|sale|coupon|budget)\b/i.test(r.title+' '+r.text));
  const tendencies=[
    {name:'Research intensity', numerator:compared.length,denominator:shopping.length,description:'Share of shopping records explicitly mentioning reviews or comparisons.', evidence:compared},
    {name:'Value-seeking signals',numerator:deals.length,denominator:shopping.length,description:'Share of shopping records mentioning price, deals, discounts, or budget. This does not establish income or willingness to pay.',evidence:deals},
    {name:'Exploratory browsing',numerator:domains.size,denominator:n,description:'Distinct domains divided by imported activity records. Export coverage affects this estimate.',evidence:records},
    {name:'Repeat engagement',numerator:repeats,denominator:n,description:'Share of records belonging to domains visited more than once.',evidence:records.filter(r=>(domains.get(r.domain)?.length??0)>1)},
  ].map(t=>({...t,score:t.denominator>=10?Math.round(t.numerator/t.denominator*100):null,confidence:t.denominator>=30?'Moderate':t.denominator>=10?'Low':'INSUFFICIENT DATA'}));
  return {n,interests,domains:[...domains].sort((a,b)=>b[1].length-a[1].length),shopping,shops,brands,first,last,tendencies};
}
export function recommendations(products:Product[],records:RecordItem[],feedback:Feedback){
  const a=analyze(records,feedback);
  return products.map(p=>{const interest=a.interests.find(i=>i.name===p.category&&i.accepted);return {product:p,score:interest&&interest.count>=3?Math.round(interest.share*100):null,evidence:interest?.evidence??[],reason:interest&&interest.count>=3?`${interest.count} imported records relate to ${interest.name}. Category share is ${Math.round(interest.share*100)}%. This is an overlap score, not a purchase probability.`:'INSUFFICIENT DATA — at least 3 accepted records in this category are needed.'};}).sort((x,y)=>(y.score??-1)-(x.score??-1));
}
export function categoryColor(name:string){return categories.find(c=>c.name===name)?.color??'#7e929f';}
