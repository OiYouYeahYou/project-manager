import { helpLs } from './commands/help.js'
import { ls } from './commands/ls.js'

const args = process.argv.slice(2)
const hasHelp = args.some((arg) => arg.match(/^(--help|help|-h)$/))

if (hasHelp) {
	console.log(helpLs)
} else {
	ls().catch((err) => console.error(err))
}
