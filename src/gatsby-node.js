import { Request } from './util/util';
import * as api from './api';
import * as metadata from './api/metadata';
import { createRemoteFileNode } from 'gatsby-source-filesystem';
import mime from 'mime-types';

export async function sourceNodes ({ actions, createNodeId, createContentDigest, store, cache }, { 
	apiURL = 'http://localhost/admin/api',
	authURL = 'http://localhost/admin/jwt/login',
	metadataURL = 'http://localhost/admin/metadata',
	mediaURL = 'http://localhost/media',
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
	const { createNode, createNodeField } = actions;

	const requester = new Request(authType, apiURL, authURL, metadataURL, webspace, locale);

	await requester.login(credentials, authToken);

	const pages = await api.pages(requester);
	const metadataPage = await metadata.pageMetadata(requester);
	const metadataSnippet = await metadata.snippetMetadata(requester);
	const media = await api.media(requester);
	const contacts = await api.contacts(requester);
	const categories = await api.categories(requester);
	const tags = await api.tags(requester);
	const snippets = await api.snippets(requester);
	const analytics = await api.analytics(requester);

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
	
	analytics.forEach(analytic => {
		const nodeContent = JSON.stringify(analytic);
		const nodeMeta = {
			id: createNodeId(`sulu-analytics-${analytic.id}`),
			parent: null,
			children: [],
			internal: {
				type: `SuluAnalytics`,
				content: nodeContent,
				contentDigest: createContentDigest(analytic)
			}
		};
		const node = Object.assign({}, analytic, nodeMeta);
		createNode(node);
	})

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

	for(const mediaItem of media) {
		const nodeContent = JSON.stringify(mediaItem);
		const nodeId = createNodeId(`sulu-media-${mediaItem.id}`)
		const nodeMeta = {
			id: nodeId,
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

		let fileNode = await createRemoteFileNode({
			url: mediaURL + mediaItem.url,
			parentNodeId: nodeId,
			cache,
			store,
			createNode,
			createNodeId,
			ext: `.${mime.extension(mediaItem.mimeType)}`
		});

		await createNodeField({
			node: fileNode,
			name: 'suluMedia',
			value: 'true'
		});

		await createNodeField({
			node: fileNode,
			name: 'id',
			value: mediaItem.id
		});

		await createNodeField({
			node: fileNode,
			name: 'tags',
			value: mediaItem.tags
		})
	};

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

	for (let metadataKey in metadataSnippet) {
		const nodeContent = JSON.stringify({...metadataSnippet[metadataKey], ...{template: metadataKey}});
		const nodeMeta = {
			id: createNodeId(`sulu-snippet-metadata-${metadataKey}`),
			parent: null,
			children: [],
			internal: {
				type: `SuluSnippetMetadata`,
				content: nodeContent,
				contentDigest: createContentDigest({...metadataSnippet[metadataKey], ...{template: metadataKey}})
			}
		};
		const node = Object.assign({}, {...metadataSnippet[metadataKey], ...{template: metadataKey}}, nodeMeta);
		createNode(node);
	}

	return;
};