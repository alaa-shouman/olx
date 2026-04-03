import { fetchAds } from './src/services/ads';

async function run() {
    try {
        const res = await fetchAds({ categoryId: '2022', size: 1 } as any); // Cars for sale
        console.log(JSON.stringify(res.responses[0].hits.hits[0]._source.parameters, null, 2));
    } catch (e) {
        console.error(e);
    }
}
run();
