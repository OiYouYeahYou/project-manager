import { homedir } from 'node:os'
import { join } from 'node:path'

import envPaths from 'env-paths'

const ONE_HOUR = 60 * 60 * 1000
const FIVE_SECONDS = 5 * 1000

export const fetchDelay = ONE_HOUR
export const cacheWriteDelay = FIVE_SECONDS

const paths = envPaths('project-manager/local-status')

export const cacheDir = paths.cache
export const cachePath = join(paths.cache, 'cache.json')

export const defaultCodeFolder = `${homedir}/code`
