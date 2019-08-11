import { pageMetadata } from '../api/metadata/index';
import resolveDependencies from './index';

export function resolveSmartContentMemoize() {
    let cache = {};
    return async function(smartContentConfig, requester) {
        let params = [];
        let result = [];

        for(let key in smartContentConfig) {
            if (smartContentConfig[key]) {
                if (key === 'limitResult') {
                    params.push('limitResult=1000');
                } else if (key === 'dataSource') {
                    params.push(`excluded=${smartContentConfig[key]}`);
                    params.push(`${key}=${smartContentConfig[key]}`);
                }else {
                    params.push(`${key}=${smartContentConfig[key]}`);
                }
            }
        }
        params.push('provider=pages');

        const smartContentItems = (await requester.get('/items', 'api', {}, params, true))['_embedded'].items

        for (let key in smartContentItems) {
            if (!cache[smartContentItems[key].id]) {
                let page =  await requester.get('/pages/' + smartContentItems[key].id, 'api', {}, [], true, true);

                for (let key in page) {
                    if (key.startsWith('_')) {
                        delete page[key];
                    }
                }

                const metadata = await pageMetadata(requester, page.template);

                page.ext.seo = await resolveDependencies(page.ext.seo, metadata.ext.seo, requester);
                page.ext.excerpt = await resolveDependencies(page.ext.excerpt, metadata.ext.excerpt, requester);

                cache[smartContentItems[key].id] = (await resolveDependencies(page, metadata, requester)); 
            }
            result.push(cache[smartContentItems[key].id]);
        }

        return result;
    }
}


const resolveSmartContent = resolveSmartContentMemoize();

export default resolveSmartContent;