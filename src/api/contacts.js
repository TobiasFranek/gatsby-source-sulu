import resolveDependencies from '../resolve/index';

export function contactsMemoize() {
    let cache = [];
    return async function (requester) {
        if (Object.keys(cache).length === 0) {
            const response = await requester.get('/contacts', 'api', {}, [], true);
        
            const contacts = response['_embedded'].contacts;

            for (let key in contacts) {
                const metadata = {
                    categories: 'category_selection',
                    medias: 'media_selection'
                }
                cache.push(await resolveDependencies(contacts[key], metadata, requester))
            }
        } 
        
    
        return cache;
    }
}

const contacts = contactsMemoize();

export default contacts;