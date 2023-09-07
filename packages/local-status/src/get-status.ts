import { readdir, stat } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { simpleGit as Git } from 'simple-git'
import { Project } from './Project.js'

export async function getStatus({
	directory,
	depth = 2,
}: {
	directory: string
	depth?: number
}): Promise<Project[]> {
	const targetPath = resolve(directory)

	const entries = await readdir(targetPath)
	const projects = entries.map(async (folder) => {
		const dirPath = join(targetPath, folder)

		const stats = await stat(dirPath)
		if (!stats.isDirectory()) {
			return
		}

		const git = Git({ baseDir: dirPath })

		if (await git.checkIsRepo()) {
			return new Project(dirPath, git)
		}

		if (depth < 2) {
			return new Project(dirPath)
		}

		return getStatus({
			directory: dirPath,
			depth: depth - 1,
		})
	})

	return (await Promise.all(projects)).filter(filterNonNullable).flat()
}

const filterNonNullable = <T>(v: T): v is NonNullable<T> =>
	v !== undefined && v !== null
