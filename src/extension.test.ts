import {describe,it,expect,vi} from 'vitest';
import fs from 'node:fs';
// @ts-expect-error Extension policy is plain JS shared with Chrome.
import {authorizedSender,cleanHistoryUrl,allowedPeriod} from '../extension/policy.js';
describe('extension origin and permission boundary',()=>{
  it('only authorizes the exact production origin and project path',()=>{expect(authorizedSender('https://josselly.github.io/consumer.profile/')).toBe(true);for(const u of ['https://evil.example/consumerprofile/','https://josselly.github.io/other-project/','http://josselly.github.io/consumer.profile/','https://josselly.github.io.evil.example/consumerprofile/'])expect(authorizedSender(u)).toBe(false);});
  it('only allows bounded history periods',()=>{expect(allowedPeriod(7)).toBe(true);expect(allowedPeriod(30)).toBe(true);expect(allowedPeriod(90)).toBe(true);expect(allowedPeriod(365)).toBe(false);expect(allowedPeriod('30')).toBe(false);});
  it('strips query data and rejects credential URLs before transmission',()=>{expect(cleanHistoryUrl('https://example.com/a?q=private#token')).toBe('https://example.com/a');expect(cleanHistoryUrl('https://u:p@example.com')).toBe('');});
  it('declares history as optional and no other permission',()=>{const m=JSON.parse(fs.readFileSync('extension/manifest.json','utf8'));expect(m.optional_permissions).toEqual(['history']);expect(m.permissions).toBeUndefined();expect(m.host_permissions).toBeUndefined();expect(m.content_scripts[0].matches).toEqual(['https://josselly.github.io/consumer.profile/*']);});
  it('contains no network upload API or history deletion methods',()=>{const code=fs.readFileSync('extension/background.js','utf8');expect(code).not.toMatch(/\bfetch\s*\(|XMLHttpRequest|deleteUrl|deleteAll|deleteRange|cookies/);});
  it('rejects external senders and missing history permission in the worker',async()=>{
    let listener:any;
    const contains=vi.fn().mockResolvedValue(false);
    vi.stubGlobal('chrome',{runtime:{id:'test-extension',onMessage:{addListener:(f:any)=>listener=f}},permissions:{contains,remove:vi.fn()},history:{search:vi.fn(),getVisits:vi.fn()}});
    // @ts-expect-error Chrome worker is plain JS.
    await import('../extension/background.js');
    const send=(msg:any,sender:any)=>new Promise<any>(resolve=>listener(msg,sender,resolve));
    expect((await send({action:'ANALYZE',days:7},{id:'evil',url:'https://josselly.github.io/consumer.profile/'})).error).toContain('Unauthorized');
    expect((await send({action:'ANALYZE',days:7},{id:'test-extension',url:'https://josselly.github.io/consumer.profile/'})).error).toContain('approve history');
    contains.mockResolvedValue(true);
    (globalThis as any).chrome.history.search.mockResolvedValue([{url:'https://example.com/a?secret=yes',title:'Laptop'}]);
    (globalThis as any).chrome.history.getVisits.mockResolvedValue([{visitTime:Date.now()-1000},{visitTime:Date.now()-100*86400000}]);
    const result=await send({action:'ANALYZE',days:7},{id:'test-extension',url:'https://josselly.github.io/consumer.profile/'});
    expect(result.records).toHaveLength(1);expect(result.records[0].url).toBe('https://example.com/a');
    vi.unstubAllGlobals();
  });
});
