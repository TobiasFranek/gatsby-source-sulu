import { extractTypes } from '../../util/util';

export function pageSeoMemoize() {
    let cache = {};
    return async function(requester) {
        if (Object.keys(cache).length === 0) {
            const response = await requester.get('/form/page_seo', 'metadata')
            
            const fields = {};

            for (let key in response.form) {
                let keys = key.split('/');
                if (keys.length === 3) {
                    fields[keys[2]] = response.form[key];
                }
            }

            cache.seo = extractTypes(fields);

            return cache;
        } else {
            return cache;
        }
    }
   
}

const pageSeo = pageSeoMemoize();

export default pageSeo;