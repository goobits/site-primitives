/**
 * Network-side surface: search-engine pings + URL HEAD validation. All
 * functions are fetch-dependent; import from server contexts only (Node,
 * SvelteKit `+server.ts`, edge runtimes with a global `fetch`).
 *
 * @module @goobits/sitemap/ops
 */

export {
	HISTORICAL_PING_ENDPOINTS,
	pingSearchEngines,
	type PingSearchEnginesOptions,
	type SearchEnginePingTarget,
	type SitemapPingResult
} from './ops/ping.ts'
export type { RetryOptions } from './ops/http.ts'
export {
	type SitemapUrlHeadResult,
	type SitemapValidationResult,
	validateSitemapUrls,
	type ValidateSitemapUrlsOptions
} from './ops/validate.ts'
export type { SitemapOperationLogger } from './ops/_sitemapOperationLogger.ts'
