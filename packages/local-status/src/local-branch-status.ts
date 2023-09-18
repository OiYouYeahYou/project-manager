export enum LocalBranchState {
	SYNCED = 1,
	UNSYNCED,
	ORPHANED,
}

interface Base<Status extends LocalBranchState> {
	name: string
	status: Status
}

/** Branch only exists locally */
export interface OrphanedStatus extends Base<LocalBranchState.ORPHANED> {}

/** Branch has a remote and is synced */
export interface SyncedStatus extends Base<LocalBranchState.SYNCED> {
	remote: string
}

/** Branch has a remote, but is either ahead or behind */
export interface UnsyncedStatus extends Base<LocalBranchState.UNSYNCED> {
	remote: string
	ahead: number
	behind: number
}

/** Type guard based on possible states of the branch */
export type BranchStatus = SyncedStatus | UnsyncedStatus | OrphanedStatus

// TODO: Add tests
/**
 * Pulls out remote, _ahead and _behind into group from `-vv` branch label
 */
const upstreamInfoRegex =
	/^\[(?<remote>.+)(: (ahead (?<_ahead>\d+))?(, )?(behind (?<_behind>\d+))?)\]/

/**
 * Parses `-vv` branch labels, pulling out upstream information
 * @returns
 */
export function localBranchStatus(name: string, label: string): BranchStatus {
	const exec = upstreamInfoRegex.exec(label)
	if (!exec) {
		return {
			name,
			status: LocalBranchState.ORPHANED,
		}
	}

	const { _ahead, _behind, remote } = exec.groups!
	if (_ahead || _behind) {
		return {
			name,
			status: LocalBranchState.UNSYNCED,
			remote,
			ahead: _ahead ? parseInt(_ahead) : 0,
			behind: _behind ? parseInt(_behind) : 0,
		}
	}

	return {
		name,
		status: LocalBranchState.SYNCED,
		remote,
	}
}
