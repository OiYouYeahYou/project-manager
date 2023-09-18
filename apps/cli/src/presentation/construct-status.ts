import { LocalBranchState, ProjectInfo } from 'project-manager-local-status'
import { humanisePath } from '../utils.js'

export interface makeStatusOptions {
	path: string
	info?: ProjectInfo
}

export function constructStatus({ path, info }: makeStatusOptions): string {
	const humanPath = humanisePath(path)
	const status = gitStatus(info)
	return `${status} ${humanPath}`
}

/** Converts `ProjectInfo` a set of emojis */
function gitStatus(info?: ProjectInfo): string {
	if (!info) {
		return Array.from({ length: 3 }, () => FUN.NO_GIT).join(' ')
	}

	const { isClean, hasStashes } = info

	const clean = isClean ? FUN.CLEAN : FUN.DIRTY
	const stashed = hasStashes ? FUN.STASHED : FUN.UNSTASHED
	const happyBranches = backupStatus(info)

	return [clean, stashed, happyBranches].join(' ')
}

/** Convert the status of relationship to upstream to a single emoji */
function backupStatus(info: Pick<ProjectInfo, 'branches' | 'hasRemotes'>): FUN {
	const { branches, hasRemotes } = info

	if (!hasRemotes) {
		return FUN.ORPHANED_REPO
	} else if (!branches?.length) {
		return FUN.NO_BRANCHES
	}

	let isSynced = true

	for (const branch of branches) {
		if (branch.status === LocalBranchState.ORPHANED) {
			return FUN.ORPHANED_BRANCHES
		} else if (branch.status === LocalBranchState.UNSYNCED) {
			isSynced = false
		}
	}

	return isSynced ? FUN.SYNCED : FUN.UNSYNCED
}

/** Emoji's all in one place */
export enum FUN {
	DIRTY = '🧹',
	CLEAN = '✨',

	STASHED = '🧺',
	UNSTASHED = '✨',

	NO_GIT = '🔴',

	ORPHANED_REPO = '💀',
	NO_BRANCHES = '⛔',
	ORPHANED_BRANCHES = '⚠️',
	UNSYNCED = '🕒',
	SYNCED = '😃',
}
