import { pageMetadata } from './metadata/index';
import resolveDependencies from '../resolve/index';

const fetchAllPageIds = async (id = '', requester) => {
	let response = null;
	if (id && id !== '') {
		response = await requester.get('/pages', 'api', {}, [`parentId=${id}`], true, true);
	} else {
		response = await requester.get('/pages', 'api', {}, [], true, true);
	}
	let ids = [];
	if (response && response._embedded && response._embedded.pages) {
		let pages = response._embedded.pages;
		for (let page of pages) {
			ids.push(page.id);

			if (page.hasChildren) {
				ids.push(...await fetchAllPageIds(page.id, requester));
			}
		}
	}
	
	return ids;
}


export function pagesMemoize() {
    let cache = {};
    return async function (requester) {
        if (Object.keys(cache).length === 0) {
			const pageIds = await fetchAllPageIds('', requester);
            
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