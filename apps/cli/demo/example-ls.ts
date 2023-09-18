import { constructStatus } from '../src/presentation/construct-status.js'
import { helpLs } from '../src/commands/help.js'

import { items } from './example-ls-mock-data.js'

const lines = items
	.sort(({ path: a }, { path: b }) => {
		const A = a.split(/\/+/g)
		const aLast = A.pop()!
		const B = b.split(/\/+/g)
		const bLast = B.pop()!

		while (true) {
			const aCurr = A.pop()!
			const bCurr = B.pop()!

			if (!aCurr && !bCurr) {
				return aLast.localeCompare(bLast)
			} else if (!aCurr) {
				return -1
			} else if (!bCurr) {
				return -1
			} else if (aCurr !== bCurr) {
				return aCurr.localeCompare(bCurr)
			}
		}
	})
	.map((blah) => constructStatus(blah))
console.log(lines.join('\n'))
console.log(helpLs)
