// Runs only on the production dashboard path, never on retailer pages.
const origin = 'https://josselly.github.io';
if (location.origin === origin && location.pathname.startsWith('/consumer.profile/')) {
  let inFlight = false;
  window.addEventListener('message', async event => {
    if(event.source !== window || event.origin !== origin || event.data?.channel !== 'ORBIT_REQUEST') return;
    const {action,id,days} = event.data;
    if(!['STATUS','ANALYZE','DISCONNECT'].includes(action) || typeof id !== 'string' || id.length > 100) return;
    if(action === 'ANALYZE' && inFlight) return;
    if(action === 'ANALYZE') inFlight = true;
    try {
      const result = await chrome.runtime.sendMessage({action,days});
      window.postMessage({channel:'ORBIT_RESPONSE',action,id,...result},origin);
    } catch {
      window.postMessage({channel:'ORBIT_RESPONSE',action,id,error:'Extension unavailable. Reload the dashboard after installing or updating it.'},origin);
    } finally { if(action === 'ANALYZE') inFlight = false; }
  });
}
