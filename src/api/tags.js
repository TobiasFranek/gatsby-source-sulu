export function tagsMemoize() {
    let cache = [];
    return async function (requester) {
        if (Object.keys(cache).length === 0) {
            const response = await requester.get('/tags', 'api', {}, ['limit=10000', 'flat=true']);
        
            const tags = response['_embedded'].tags;

            cache = tags;
        } 
        
    
        return cache;
    }
}

const tags = tagsMemoize();

export default tags;