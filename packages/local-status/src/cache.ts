import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

import {
	cacheDir,
	cachePath,
	cacheWriteDelay,
	fetchDelay,
} from 'project-manager-config'

interface Cache {
	fetches: Record<string, number>
}

if (!existsSync(cacheDir)) {
	mkdirSync(cacheDir, { recursive: true })
}

const cache: Cache = existsSync(cachePath)
	? JSON.parse(readFileSync(cachePath, 'utf-8'))
	: { fetches: {} }

let timer: ReturnType<typeof setTimeout> | undefined
/**
 * Debounced write timer
 */
function update() {
	clearTimeout(timer)
	timer = setTimeout(() => {
		writeFileSync(cachePath, JSON.stringify(cache))
	}, cacheWriteDelay)
}

/**
 * Determine if enough time has passed to fetch again
 */
export async function shouldFetch(path: string) {
	const now = Date.now()
	const last = cache.fetches[path]
	if (last && now - last < fetchDelay) {
		return false
	}

	cache.fetches[path] = now
	try {
		update()
	} catch (err) {
		console.log(err)
	}
	return true
}
