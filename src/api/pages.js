import { pageMetadata } from './metadata/index';
import resolveDependencies from '../resolve/index';

export function pagesMemoize() {
    let cache = {};
    return async function (requester) {
        if (Object.keys(cache).length === 0) {
            const response = await requester.get('/nodes', 'api', {}, ['flat=true', 'depth=100'], true, true);
        
            const root = response.id;
            const rootChildren = response['_embedded'].pages.map((page) => page.id);
        
            const pageIds = [root, ...rootChildren];
        
            const pages = [];
        
            for (let id in pageIds) {
                const response =  await requester.get('/pages/' + pageIds[id], 'api', {}, [], true, true);
               
                for (let key in response) {
                    if (key.startsWith('_')) {
                        delete response[key];
                    }
                }
        
                const metadata = await pageMetadata(requester, response.template);
        
                response.ext.seo = await resolveDependencies(response.ext.seo, metadata.ext.seo, requester);
                response.ext.excerpt = await resolveDependencies(response.ext.excerpt, metadata.ext.excerpt, requester);


                pages.push(await resolveDependencies(response, metadata, requester));
            }

            cache = pages;
        } 
        
    
        return cache;
    }
}

const pages = pagesMemoize();

export default pages;