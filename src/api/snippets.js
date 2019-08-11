import { pageSeo, pageExcerpt } from './metadata/index';
import resolveDependencies from '../resolve/index';

export function snippetsMemoize() {
    let cache = {};
    return async function (requester) {
        if (Object.keys(cache).length === 0) {
            const response = await requester.get('/snippets', 'api', {}, ['flat=true', 'depth=1000'], true);
        
            const snippets = response['_embedded'].snippets;

            let resolvedSnippets = [];

            const seo = (await pageSeo(requester)).seo;
            const excerpt = (await pageExcerpt(requester)).excerpt;

            for (let snippetKey in snippets) {
                for (let key in snippets[snippetKey]) {
                    if (key.startsWith('_')) {
                        delete snippets[snippetKey][key];
                    }
                }

                const metadata = {
                    author: 'contact',
                    changer: 'contact',
                    creator: 'contact'
                }

                snippets[snippetKey].ext.seo = await resolveDependencies(snippets[snippetKey].ext.seo, seo, requester);
                snippets[snippetKey].ext.excerpt = await resolveDependencies(snippets[snippetKey].ext.excerpt, excerpt, requester);

                resolvedSnippets.push(await resolveDependencies(snippets[snippetKey], metadata, requester));
            }

            cache = resolvedSnippets;
        }

        return cache;
    }
}

const snippets = snippetsMemoize();

export default snippets;