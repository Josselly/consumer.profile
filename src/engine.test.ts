import {describe,it,expect} from 'vitest';
import {normalizeRows,normalizeTime,parseJson,parseFile,safeUrl,analyze,deduplicate,recommendations,type RecordItem} from './engine';
const time=Date.now()-100000;
const tech=(n:number)=>normalizeRows(Array.from({length:n},(_,i)=>({url:'https://bestbuy.com/laptop',title:'Laptop review',time:time-i*1000})),'Test-only fixture').records;
describe('local import normalization',()=>{
  it('never substitutes missing data',()=>expect(analyze([]).interests).toEqual([]));
  it('removes query, fragment and embedded credential URLs',()=>{expect(safeUrl('https://shop.example/item?token=secret#private')).toBe('https://shop.example/item');expect(safeUrl('https://name:secret@shop.example/item')).toBe('');expect(safeUrl('javascript:alert(1)')).toBe('');});
  it('normalizes seconds, milliseconds, Unix microseconds, Chrome epoch, and ISO',()=>{const t=Date.UTC(2026,0,1);for(const v of [t,t/1000,t*1000,(t+11644473600000)*1000,new Date(t).toISOString()])expect(normalizeTime(v)).toBe(t);});
  it('rejects missing dates, invalid URLs and future records',()=>{const r=normalizeRows([{url:'https://example.com',title:'Laptop'},{url:'bad',time},{url:'https://example.com',time:Date.now()+1e10}],'test');expect(r.records).toHaveLength(0);expect(r.skipped).toBe(3);});
  it('excludes known sensitive topics from inference',()=>{const r=normalizeRows([{url:'https://example.com',title:'Cancer diagnosis',time},{url:'https://chase.com/home',title:'My bank',time},{url:'https://example.com',title:'Election polls',time}],'test');expect(r.records).toHaveLength(0);expect(r.skipped).toBe(3);});
  it('supports Takeout Browser History',()=>expect(parseJson({'Browser History':[{url:'https://bestbuy.com/laptop',title:'Laptop',time_usec:time*1000}]},'Takeout').records).toHaveLength(1));
  it('supports My Activity visited records',()=>expect(parseJson([{title:'Visited laptop store',titleUrl:'https://example.com',time:new Date(time).toISOString()}],'Takeout').records[0].category).toBe('Technology'));
  it('imports only user authored ChatGPT messages and strips quotes/code',()=>{const result=parseJson([{mapping:{a:{message:{author:{role:'assistant'},content:{parts:['I like laptop computers']},create_time:time/1000}},b:{message:{author:{role:'user'},content:{parts:['I like coffee\n> laptop computers\n"sneaker"\n```\nfurniture\n```']},create_time:time/1000}},c:{message:{author:{role:'system'},content:{parts:['Travel']},create_time:time/1000}}}}],'ChatGPT');expect(result.records).toHaveLength(1);expect(result.records[0].category).toBe('Food & cooking');expect(result.records[0].text).not.toMatch(/laptop|sneaker|furniture/);});
  it('keeps assistant-only conversations empty',()=>expect(parseJson([{mapping:{a:{message:{author:{role:'assistant'},content:{parts:['Laptop']},create_time:time/1000}}}}],'test').records).toHaveLength(0));
  it('deduplicates visits but preserves distinct timestamps',()=>{const rows=tech(2);expect(deduplicate([...rows,...rows])).toHaveLength(2);});
  it('imports CSV without fabricated timestamps',async()=>{const file=new File([`url,title,time\nhttps://example.com,Laptop,${time}\nhttps://example.com,Camera,`],'history.csv');const result=await parseFile(file);expect(result.records).toHaveLength(1);expect(result.skipped).toBe(1);});
  it('reports unsupported JSON structures',()=>expect(()=>parseJson({secret:'not supported'},'test')).toThrow('Unsupported JSON'));
  it('guards oversized row lists',()=>expect(()=>normalizeRows(Array(50001).fill({}),'test')).toThrow('50,000'));
  it('keeps unknown categories unclassified',()=>expect(normalizeRows([{url:'https://example.com',title:'Welcome',time}],'test').records[0].category).toBe('Uncategorized'));
  it('imports catalog prices with explicit provenance and no false verification',()=>{const result=parseJson({products:[{name:'Laptop',url:'https://example.com/item',price:'$999.00'}]},'Catalog');expect(result.products[0].price).toBe(999);expect(result.products[0].provenance).toContain('not independently verified');});
  it('does not turn an absent price into a zero price',()=>expect(parseJson({products:[{name:'Laptop',url:'https://example.com/item'}]},'Catalog').products[0].price).toBeUndefined());
});
describe('explainable inference',()=>{
  it('requires 10 eligible records for a tendency score',()=>{expect(analyze(tech(9)).tendencies[0].score).toBeNull();expect(analyze(tech(10)).tendencies[0].score).toBe(100);});
  it('uses a denominator of all selected records for category share',()=>{const rows=[...tech(3),...normalizeRows([{url:'https://example.com',title:'Welcome',time}],'test').records];expect(analyze(rows).interests[0].share).toBe(.75);});
  it('updates category evidence after record deletion',()=>expect(analyze(tech(3).slice(1)).interests[0].count).toBe(2));
  it('does not recommend invented products',()=>expect(recommendations([],tech(10),{})).toHaveLength(0));
  it('requires 3 accepted category records for matches',()=>{const p=parseJson({products:[{name:'Laptop',url:'https://example.com/item'}]},'Catalog').products;expect(recommendations(p,tech(2),{})[0].score).toBeNull();expect(recommendations(p,tech(3),{})[0].score).toBe(100);expect(recommendations(p,tech(3),{'Technology':'inaccurate'})[0].score).toBeNull();});
});
