import { contacts } from '../api/index';


export function resolveContactMemoize() {
    let cache = {};
    return async function(contact, requester) {
        let result = [];

        if (typeof contact === 'number') {
            if (!cache[contact]) {
                let temp = await contacts(requester);

                temp = temp.filter((item) => item.id === contact);
    
                cache[contact] = temp[0];
            }
           
            result = cache[contact];
        } else if (contact.ids) {
            for (let index in contact.ids) {
                if (!cache[contact.ids[index]]) {
                    let temp = await contacts(requester);
                    temp = temp.filter((item) => item.id === contact.ids[index]);
        
                    cache[contact.ids[index]] = temp[0];
                }
                result.push(cache[contact.ids[index]]);
            }
        }
       
        return result;
    }
}


const resolveContact = resolveContactMemoize();

export default resolveContact;