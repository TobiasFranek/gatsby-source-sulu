
export function analyticsMemoize() {
    let cache = [];
    return async function (requester) {
        if (Object.keys(cache).length === 0) {
            const response = await requester.get(`/webspaces/${requester.webspace}/analytics`, 'api',);
        
            const analytics = response['_embedded'].analytics;

            cache = analytics;
        } 
        
    
        return cache;
    }
}

const analytics = analyticsMemoize();

export default analytics;