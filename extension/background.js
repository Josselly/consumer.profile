import {authorizedSender,cleanHistoryUrl,allowedPeriod} from './policy.js';
let generation = 0;
let reading = false;
chrome.runtime.onMessage.addListener((message,sender,respond) => {
  if(sender.id !== chrome.runtime.id || !authorizedSender(sender.url)) { respond({error:'Unauthorized dashboard origin.'}); return false; }
  async function run(){
    if(message.action === 'STATUS') return {connected:await chrome.permissions.contains({permissions:['history']})};
    if(message.action === 'DISCONNECT') {generation++;await chrome.permissions.remove({permissions:['history']});return {connected:false};}
    if(message.action !== 'ANALYZE') throw new Error('Unsupported request.');
    if(!allowedPeriod(message.days)) throw new Error('Choose 7, 30, or 90 days.');
    if(!await chrome.permissions.contains({permissions:['history']})) throw new Error('Open the Orbit toolbar popup and approve history access first.');
    if(reading) throw new Error('A history analysis is already running.');
    reading=true; const requestGeneration=generation;
    try {
      const endTime=Date.now(), startTime=endTime-message.days*86400000;
      const pages=await chrome.history.search({text:'',startTime,endTime,maxResults:5001});
      const selected=pages.slice(0,5000);const records=[];let next=0;let truncated=pages.length>5000;
      async function worker(){
        while(next<selected.length&&records.length<20000){
          if(generation!==requestGeneration) throw new Error('Connection revoked.');
          const page=selected[next++];const url=cleanHistoryUrl(page.url);if(!url)continue;
          const visits=await chrome.history.getVisits({url:page.url});
          for(const visit of visits){if(records.length>=20000){truncated=true;break;}if(visit.visitTime>=startTime&&visit.visitTime<=endTime)records.push({url,title:(page.title||'').slice(0,300),time:visit.visitTime});}
        }
        if(next<selected.length)truncated=true;
      }
      await Promise.all(Array.from({length:8},()=>worker()));
      if(generation!==requestGeneration||!await chrome.permissions.contains({permissions:['history']})) throw new Error('Connection revoked.');
      return {records,truncated,coverage:{startTime,endTime,urls:selected.length,visits:records.length}};
    } finally {reading=false;}
  }
  run().then(respond).catch(error=>respond({error:error.message||'Unable to read approved history.'}));return true;
});
