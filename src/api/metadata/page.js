import { extractTypes } from '../../util/util';
import pageSeo from './page_seo';
import pageExcerpt from './page_excerpt';

export function pageMetadataMemoize() {
    let cache = {};
    return async function(requester, type = null) {
        if (Object.keys(cache).length === 0) { 
            const response = await requester.get('/form/page', 'metadata')

            const pageSeoData = await pageSeo(requester);
            const pageExcerptData = await pageExcerpt(requester);


            const additonalFields = {
                author: 'contact',
                changer: 'contact',
                creator: 'contact',
                ext: {
                    ...pageSeoData,
                    ...pageExcerptData
                }
            }

            for(let key in response.types) {
                cache[key] = {...extractTypes(response.types[key].form), ...additonalFields};
            }

            return type ? cache[type] : cache;
        } else {
            return type ? cache[type] : cache;
        }
    }
   
}

const pageMetadata = pageMetadataMemoize();

export default pageMetadata;