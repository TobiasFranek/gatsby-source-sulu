import { Request } from './util/util';
import * as api from './api';
import * as metadata from './api/metadata';

export async function sourceNodes ({ actions, createNodeId, createContentDigest }, { 
	apiURL = 'http://localhost/admin/api',
	authURL = 'http://localhost/admin/jwt/login',
	metadataURL = 'http://localhost/admin/metadata',
	authToken = 'token',
	webspace = 'webspace',
	locale = 'en',
	authType = {
		type: 'header',
		name: 'Bearer'
	},
	credentials = {
		username: 'admin',
		password: 'admin'
	}
 }) {
	const { createNode } = actions;

	const requester = new Request(authType, apiURL, authURL, metadataURL, webspace, locale);

	await requester.login(credentials, authToken);

	const pages = await api.pages(requester);
	const metadataPage = await metadata.pageMetadata(requester);
	const media = await api.media(requester);
	const contacts = await api.contacts(requester);
	const categories = await api.categories(requester);
	const tags = await api.tags(requester);
	const snippets = await api.snippets(requester);

	pages.forEach(page => {
		const nodeContent = JSON.stringify(page);
		const nodeMeta = {
			id: createNodeId(`sulu-pages-${page.id}`),
			parent: null,
			children: [],
			internal: {
				type: `SuluPage`,
				content: nodeContent,
				contentDigest: createContentDigest(page)
			}
		};
		const node = Object.assign({}, page, nodeMeta);
		createNode(node);
	});

	snippets.forEach(snippet => {
		const nodeContent = JSON.stringify(snippet);
		const nodeMeta = {
			id: createNodeId(`sulu-snippet-${snippet.id}`),
			parent: null,
			children: [],
			internal: {
				type: `SuluSnippet`,
				content: nodeContent,
				contentDigest: createContentDigest(snippet)
			}
		};
		const node = Object.assign({}, snippet, nodeMeta);
		createNode(node);
	})

	media.forEach(mediaItem => {
		const nodeContent = JSON.stringify(mediaItem);
		const nodeMeta = {
			id: createNodeId(`sulu-media-${mediaItem.id}`),
			parent: null,
			children: [],
			internal: {
				type: `SuluMedia`,
				content: nodeContent,
				contentDigest: createContentDigest(mediaItem)
			}
		};
		const node = Object.assign({}, mediaItem, nodeMeta);
		createNode(node);
	});

	contacts.forEach(contact => {
		const nodeContent = JSON.stringify(contact);
		const nodeMeta = {
			id: createNodeId(`sulu-contact-${contact.id}`),
			parent: null,
			children: [],
			internal: {
				type: `SuluContact`,
				content: nodeContent,
				contentDigest: createContentDigest(contact)
			}
		};
		const node = Object.assign({}, contact, nodeMeta);
		createNode(node);
	});

	categories.forEach(category => {
		const nodeContent = JSON.stringify(category);
		const nodeMeta = {
			id: createNodeId(`sulu-category-${category.id}`),
			parent: null,
			children: [],
			internal: {
				type: `SuluCategory`,
				content: nodeContent,
				contentDigest: createContentDigest(category)
			}
		};
		const node = Object.assign({}, category, nodeMeta);
		createNode(node);
	});

	tags.forEach(tag => {
		const nodeContent = JSON.stringify(tag);
		const nodeMeta = {
			id: createNodeId(`sulu-tag-${tag.id}`),
			parent: null,
			children: [],
			internal: {
				type: `SuluTag`,
				content: nodeContent,
				contentDigest: createContentDigest(tag)
			}
		};
		const node = Object.assign({}, tag, nodeMeta);
		createNode(node);
	});

	for (let metadataKey in metadataPage) {
		const nodeContent = JSON.stringify({...metadataPage[metadataKey], ...{template: metadataKey}});
		const nodeMeta = {
			id: createNodeId(`sulu-pages-metadata-${metadataKey}`),
			parent: null,
			children: [],
			internal: {
				type: `SuluPageMetadata`,
				content: nodeContent,
				contentDigest: createContentDigest({...metadataPage[metadataKey], ...{template: metadataKey}})
			}
		};
		const node = Object.assign({}, {...metadataPage[metadataKey], ...{template: metadataKey}}, nodeMeta);
		createNode(node);
	}


	return;
};