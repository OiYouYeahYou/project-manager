import { defaultCodeFolder } from 'project-manager-config'
import {
	LocalBranchState,
	ProjectInfo,
	Project,
	getStatus,
} from 'project-manager-local-status'

import { humanisePath } from '../utils.js'

export async function ls() {
	const projects = await getStatus({ directory: defaultCodeFolder })

	for (const project of projects) {
		const status = await makeStatus(project)
		console.log(status)
	}
}

async function makeStatus(project: Project): Promise<string> {
	const info = await project.info()
	const humanPath = humanisePath(project.path)
	const status = gitStatus(info)
	return `${status} ${humanPath}`
}

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

function backupStatus(info: ProjectInfo): FUN {
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

enum FUN {
	DIRTY = '🧹',
	CLEAN = '✨',

	STASHED = '🧺',
	UNSTASHED = '🗑️',

	NO_GIT = '🔴',

	ORPHANED_REPO = '💀', // Has no remote
	NO_BRANCHES = '⚠️', // Has no branch
	ORPHANED_BRANCHES = '🏚️', // Has branches without remotes
	UNSYNCED = '⛔', // Has branches that are ahead and/or behind
	SYNCED = '😃', // Everything is great
}
