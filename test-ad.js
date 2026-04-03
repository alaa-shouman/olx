const https = require('https');

const payload = '{"index":"olx-lb-production-ads-en"}\n{"from":0,"size":1,"query":{"match_all":{}}}\n';

const options = {
  hostname: 'search.mena.sector.run',
  port: 443,
  path: '/_msearch',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-ndjson',
    'Authorization': 'Basic b2x4LWxiLXByb2R1Y3Rpb24tc2VhcmNoOj5zK08zPXM5QEk0REYwSWEldWc/N1FQdXkye0RqW0Zy'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log(JSON.stringify(JSON.parse(data), null, 2)));
});

req.write(payload);
req.end();
