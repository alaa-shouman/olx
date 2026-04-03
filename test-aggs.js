const https = require('https');
const payload = '{"index":"olx-lb-production-ads-en"}\n{"from":0,"size":0,"query":{"bool":{"must":[{"term":{"category.externalID":"23"}}]}},"aggs":{"make":{"terms":{"field":"parameters.value","size":100}}}}\n';
const req = https.request({
  hostname: 'search.mena.sector.run', path: '/_msearch', method: 'POST',
  headers: { "Content-Type": "application/x-ndjson", "Authorization": "Basic b2x4LWxiLXByb2R1Y3Rpb24tc2VhcmNoOj5zK08zPXM5QEk0REYwSWEldWc/N1FQdXkye0RqW0Zy" }
}, (res) => { let data = ""; res.on("data", c => data += c); res.on("end", () => console.log(data.slice(0,1000))); });
req.write(payload); req.end();
