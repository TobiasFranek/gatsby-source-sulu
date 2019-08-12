import { extractTypes } from '../../util/util';

export function snippetMetadataMemoize() {
    let cache = {};
    return async function(requester, type = null) {
        if (Object.keys(cache).length === 0) { 
            const response = await requester.get('/form/snippet', 'metadata')

            const additonalFields = {
                author: 'contact',
                changer: 'contact',
                creator: 'contact',
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

const snippetMetadata = snippetMetadataMemoize();

export default snippetMetadata;