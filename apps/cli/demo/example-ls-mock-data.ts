import {
	BranchStatus,
	LocalBranchState,
	ProjectInfo,
} from 'project-manager-local-status'

import { makeStatusOptions } from '../src/presentation/construct-status.js'

export const items: makeStatusOptions[] = []

addItem('~/code/games/endless-minesweeper', {}, { noGit: true })
addItem('~/code/games-related/stats-tracker', {
	branches: [mockBranch(LocalBranchState.ORPHANED)],
	hasRemotes: false,
})
addItem('~/code/personal/blog', {})
addItem('~/code/projects/next-big-thing', { branches: [] })
addItem('~/code/projects/project-manager', { isClean: false })
addItem('~/code/top-secret/corpo-mono-repo', { hasStashes: true })
addItem('~/code/top-secret/small-client-app', {
	branches: [mockBranch(LocalBranchState.UNSYNCED)],
})

function mockBranch(status = LocalBranchState.SYNCED): BranchStatus {
	switch (status) {
		case LocalBranchState.ORPHANED:
			return {
				status: LocalBranchState.ORPHANED,
				name: 'main',
			}
		case LocalBranchState.SYNCED:
			return {
				status: LocalBranchState.SYNCED,
				name: 'main',
				remote: 'origin/main',
			}
		case LocalBranchState.UNSYNCED:
			return {
				status: LocalBranchState.UNSYNCED,
				name: 'main',
				remote: 'origin/main',
				ahead: 0,
				behind: 0,
			}
	}
}

function addItem(
	path: string,
	{
		isClean = true,
		hasStashes = false,
		hasRemotes = true,
		branches = [mockBranch()],
		remotes = {},
	}: Partial<ProjectInfo> = {},
	{ noGit = false } = {},
) {
	if (noGit) {
		items.push({ path })
		return
	}

	const blah: makeStatusOptions = {
		path,
		info: {
			isClean,
			hasStashes,
			hasRemotes,
			branches,
			remotes,
		},
	}

	items.push(blah)
}
