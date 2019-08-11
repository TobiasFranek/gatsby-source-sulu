import { media } from '../api/index';


export function resolveMediaMemoize() {
    let cache = {};
    return async function(mediaItems, requester) {
        let ids = [];
        if (mediaItems.ids) {
            ids = mediaItems.ids;
        } else {
            ids = mediaItems;
        }
        const result = [];
        for (let i in ids) {
            if (!cache[ids[i]]) {
                let temp = await media(requester);
                temp = temp.filter((item) => item.id === ids[i]);
                cache[ids[i]] = temp[0];
            }

            result.push(cache[ids[i]]);
        }

        return result;
    }
}


const resolveMedia = resolveMediaMemoize();

export default resolveMedia;