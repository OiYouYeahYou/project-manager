import chalk from 'chalk'

import { FUN } from '../presentation/construct-status.js'

export const helpLs = `
${chalk.bold('ABOUT:')}
File Status:
	${FUN.DIRTY}: Dirty
	${FUN.CLEAN}: Clean

File Status:
	${FUN.STASHED}: Stashed
	${FUN.UNSTASHED}: Unstashed

File Status:
	${FUN.ORPHANED_REPO}: Orphaned; has no upstream
	${FUN.NO_BRANCHES}: No Branches
	${FUN.ORPHANED_BRANCHES}: Orphaned Branches
	${FUN.UNSYNCED}: Unsynced; either ahead or behind
	${FUN.SYNCED}: Synced up and down
`
