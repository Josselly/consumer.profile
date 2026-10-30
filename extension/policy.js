export function authorizedSender(value){try{const url=new URL(value);return url.origin==='https://josselly.github.io'&&url.pathname.startsWith('/consumer.profile/');}catch{return false;}}
export function allowedPeriod(value){return [7,30,90].includes(value);}
export function cleanHistoryUrl(value){try{const url=new URL(value);if(!['https:','http:'].includes(url.protocol)||url.username||url.password)return '';url.search='';url.hash='';return url.href;}catch{return '';}}
