
import fetch from 'node-fetch';

export function getElementByString(element, key) {
    const keys = key.split('.');
    
    if (keys.length === 1) {
        return element[keys[0]];
    }

    const firstKey = keys[0];

    if (element[firstKey]) {
        return getElementByString(element[firstKey], keys.splice(0, 1).join('.'));
    } else {
        return null
    }
}

export function extractTypes(types) {
    let result = {};

    for (let key in types) {
        switch (types[key].type) {
            case 'block':
                const block = {};

                for (let childKey in types[key].types) {
                    block[childKey] = extractTypes(types[key].types[childKey].form);
                }
                
                result[key] = {
                    type: 'block',
                    children: block
                };
                break;
                
            case 'section':
                const section = extractTypes(types[key].items);

                result = {...result, ...section};
                break;

            default: 
                result[key] = types[key].type;
                break;
        }
    }

    return result;
}

export class Request {
    token = '';

    url = {};
    webspace = '';
    locale = ''
    authType = {};
    
    constructor(authType, apiUrl, authUrl, metadataUrl, webspace, locale) {
        this.url = {
            api: apiUrl,
            auth: authUrl,
            metadata: metadataUrl
        }

        this.locale = locale;
        this.webspace = webspace;

        this.authType = authType;
    }

    async login(credentials, tokenKey) {
        const headers = {
            'Content-Type': 'application/json'
        }
    
        const request = await fetch(this.url.auth, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: headers,
            body: JSON.stringify(credentials)
        })
    
        if (request.status === 200) {
            const response = await request.json();
    
            this.token = getElementByString(response, tokenKey);
        } else {
            return null
        }
    }

    async get(path, type, headers = {}, params = [], locale = false, webspace = false,) {
        const queryPostfix = '';
        const defaultHeaders = {
            'Content-Type': 'application/json',
            ...headers
        }

        if (this.authType.type === 'header') {
            defaultHeaders['Authorization'] = `${this.authType.name} ${this.token}`;
        } else if (this.authType.type === 'query') {
            queryPostfix = `${this.authType.name}=${this.token}`;
        }

        if (queryPostfix !== '') params.push(queryPostfix);
        if (locale) params.push(`locale=${this.locale}`);
        if (webspace) params.push(`webspace=${this.webspace}`);


        const request = await fetch(`${this.url[type]}${path}${params.length > 0 ? '?' : ''}${params.join('&')}`,
            {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                headers: defaultHeaders,
            }
        )

        if (request.status !== 200) {
            return null;
        }

        return await request.json();
    }
}