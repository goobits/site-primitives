/** Optional diagnostic sink shared by Sitemap network operations. */
export type SitemapOperationLogger = {
	info?: (message: string, context?: Record<string, unknown>) => void
	warn?: (message: string, context?: Record<string, unknown>) => void
	error?: (message: string, context?: Record<string, unknown>) => void
}
