import resolveDependencies from '../resolve/index';

export function mediaMemoize() {
    let cache = [];
    return async function (requester) {
        if (Object.keys(cache).length === 0) {
            const response = await requester.get('/media', 'api', {}, ['flat=true', 'limit=10000'], true);
        
            const mediaIds = response['_embedded'].media.map((item) => item.id);

            for (let key in mediaIds) {
                const metadata = {
                    categories: 'category_selection'
                }
                cache.push(await resolveDependencies(await requester.get('/media/' + mediaIds[key], 'api', {}, ['flat=true'], true), metadata, requester))
            }
        } 
        
    
        return cache;
    }
}

const media = mediaMemoize();

export default media;