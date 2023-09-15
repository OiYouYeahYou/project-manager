import { SimpleGit } from 'simple-git'
import { localBranchStatus } from './local-branch-status.js'
import { shouldFetch } from './cache.js'

export class Project {
	constructor(
		public path: string,
		private _git?: SimpleGit,
	) {}

	async info() {
		const git = this._git

		if (!git) {
			return
		}

		await this.fetch()

		const [isClean, hasStashes, branches, { hasRemotes, remotes }] =
			await Promise.all([
				this.isClean(),
				this.hasStashes(),
				this.branches(),
				this.remotes(),
			])

		return {
			isClean,
			remotes,
			hasStashes,
			branches,
			hasRemotes,
		}
	}

	async fetch() {
		const { _git } = this
		if (!_git || !(await shouldFetch(this.path))) {
			return
		}

		try {
			await _git.fetch()
		} catch (err) {
			// TODO: Handle error
			console.log(err)
		}
	}

	async isClean() {
		const status = await this._git!.status()
		const { not_added, conflicted, created, deleted } = status
		return (
			0 ===
			not_added.length +
				conflicted.length +
				created.length +
				deleted.length
		)
	}

	async hasStashes() {
		const stashes = await this._git!.stashList()
		return stashes.all.length !== 0
	}

	async branches() {
		const _branches = await this._git!.branch(['-vv']).catch(() => {})
		return _branches
			? _branches.all.map((name) => {
					const { label } = _branches.branches[name]
					return localBranchStatus(name, label)
			  })
			: undefined
	}

	async remotes() {
		const remotesRaw = (await this._git!.remote(['--verbose']))!
		const remoteLines = remotesRaw
			.trim()
			.split(/\n/)
			.filter((ln) => ln.length)
		let remotes:
			| Record<
					string,
					{
						[key in 'fetch' | 'push']?: string
					}
			  >
			| undefined

		if (remoteLines.length) {
			remotes = {}
			for (const remote of remoteLines) {
				const [name, path, _direction] = remote.split(/\s+/)
				const direction = _direction.replace(/\(|\)/g, '') as
					| 'fetch'
					| 'push'
				if (name in remotes) {
					remotes[name][direction] = path
				} else {
					remotes[name] = {
						[direction]: path,
					}
				}
			}
		}

		return {
			remotes,
			hasRemotes: remoteLines.length !== 0,
		}
	}
}

export type ProjectInfo = NonNullable<Awaited<ReturnType<Project['info']>>>
