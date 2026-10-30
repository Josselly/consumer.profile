const status=document.getElementById('status');
document.getElementById('allow').addEventListener('click',async()=>{
  try{const granted=await chrome.permissions.request({permissions:['history']});status.textContent=granted?'Permission granted. Return to the dashboard, check connection, choose a period, and approve analysis.':'Permission declined. You can use file imports instead.';}catch(error){status.textContent=error.message;}
});
document.getElementById('revoke').addEventListener('click',async()=>{await chrome.permissions.remove({permissions:['history']});status.textContent='History permission revoked. Clear session data in the dashboard to remove already imported records.';});
chrome.permissions.contains({permissions:['history']}).then(granted=>{if(granted)status.textContent='History permission is currently granted. No history is read until you approve analysis in the dashboard.';});
