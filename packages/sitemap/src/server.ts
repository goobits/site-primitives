/**
 * Server-side surface: XML builders + origin resolution. Pure functions, no
 * network. For network operations (ping, validate), import `/ops` instead.
 *
 * @module @goobits/sitemap/server
 */

export {
	buildSitemapIndexXml,
	buildSitemapXml,
	escapeXml,
	formatSitemapLastMod,
	getBaseUrl,
	getPlatformEnv,
	resolveSiteOrigin,
	type SitemapIndexEntry,
	toAbsoluteUrl
} from './server/xml.ts'
