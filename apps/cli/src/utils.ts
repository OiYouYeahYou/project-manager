import { homedir } from 'node:os'

export function humanisePath(path: string) {
	return path.replace(new RegExp(`^${homedir}`, 'i'), '~')
}
