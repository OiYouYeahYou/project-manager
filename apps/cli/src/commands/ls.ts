import { defaultCodeFolder } from 'project-manager-config'
import { getStatus } from 'project-manager-local-status'

import { constructStatus } from '../presentation/construct-status.js'

export async function ls() {
	const projects = await getStatus({ directory: defaultCodeFolder })

	for (const project of projects) {
		const info = await project.info()
		const { path } = project
		const status = constructStatus({ path, info })
		console.log(status)
	}
}
