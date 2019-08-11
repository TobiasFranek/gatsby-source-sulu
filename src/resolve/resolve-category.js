import { categories } from '../api/index';


export function resolveCategoryMemoize() {
    let cache = {};
    return async function(categoryIds, requester) {
        let ids = [];
        if (categoryIds.ids) {
            ids = categoryIds.ids;
        } else {
            ids = categoryIds;
        }
        
        const result = [];
        for (let i in ids) {
            if (!cache[ids[i]]) {
                let temp = await categories(requester);
                temp = temp.filter((item) => item.id === ids[i]);
                cache[ids[i]] = temp[0];
            }

            result.push(cache[ids[i]]);
        }

        return result;
    }
}


const resolveCategory = resolveCategoryMemoize();

export default resolveCategory;