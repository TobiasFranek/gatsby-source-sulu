import { extractTypes } from '../../util/util';

export function pageExcerptMemoize() {
    let cache = {};
    return async function(requester) {
        if (Object.keys(cache).length === 0) {
            const response = await requester.get('/form/page_excerpt', 'metadata')

            
            const fields = {};

            for (let key in response.form) {
                let keys = key.split('/');
                if (keys.length === 3) {
                    fields[keys[2]] = response.form[key];
                }
            }

            cache.excerpt = extractTypes(fields);

            return cache;
        } else {
            return cache;
        }
    }
   
}

const pageExcerpt = pageExcerptMemoize();

export default pageExcerpt;