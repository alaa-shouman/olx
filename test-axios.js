const axios = require('axios');

const instance = axios.create({
  baseURL: 'https://search.mena.sector.run/',
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(config => {
  config.headers["X-Request-ID"] = "123";
  console.log("Headers before send:", config.headers);
  return config;
});

instance({
  method: 'POST',
  url: '_msearch',
  data: '{"index":"olx-lb-production-ads-en"}\n{"from":0,"size":12}\n',
  headers: {
    'Content-Type': 'application/x-ndjson',
    'Authorization': 'Basic b2x4LWxiLXByb2R1Y3Rpb24tc2VhcmNoOj5zK08zPXM5QEk0REYwSWEldWc/N1FQdXkye0RqW0Zy',
  }
}).then(res => console.log('Result:', res.status)).catch(err => console.log('Error status:', err.response ? err.response.status : err.message));
