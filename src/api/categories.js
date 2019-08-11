import resolveDependencies from '../resolve/index';

export function categoriesMemoize() {
    let cache = [];
    return async function (requester) {
        if (Object.keys(cache).length === 0) {
            const response = await requester.get('/categories', 'api', {}, [], true);
        
            const categories = response['_embedded'].categories;

            for (let key in categories) {
                const metadata = {
                    medias: 'media_selection'
                }
                cache.push(await resolveDependencies(categories[key], metadata, requester))
            }
        } 
        
    
        return cache;
    }
}

const categories = categoriesMemoize();

export default categories;