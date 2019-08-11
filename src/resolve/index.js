import resolveMedia from './resolve-media';
import resolveContact from './resolve-contact';
import resolveCategory from './resolve-category';
import resolveSmartContent from './resolve-smart-content';

export default async function resolveDependencies(content, schema, requester) {
    for (let key in content) {
        if (schema[key]) {
            const type = schema[key].type ? schema[key].type : schema[key];
            switch (type) {
                case 'section':
                    content[key] = await resolveDependencies(content[key], schema[key].children);
                    break;
                case 'block':
                    let temp = [];
                    for (let blockKey in content[key]) {
                        temp.push(await resolveDependencies(content[key][blockKey], schema[key].children[content[key][blockKey].type]));
                    }

                    content[key] = temp;
                    break;
                case 'media_selection':
                    content[key] = await resolveMedia(content[key], requester);
                    break;
                case 'contact':
                    content[key] = await resolveContact(content[key], requester);
                    break;
                case 'smart_content':
                    content[key] = await resolveSmartContent(content[key], requester);
                    break;
                case 'category_selection':
                    content[key] = await resolveCategory(content[key], requester);
                    break;
            }
        }
    }

    return content;
}


export {
    resolveMedia,
    resolveContact,
    resolveCategory,
    resolveSmartContent
}