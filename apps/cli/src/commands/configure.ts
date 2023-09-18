import { createInterface, ReadLineOptions, Interface } from 'node:readline'
import { stdin, stdout } from 'node:process'

import { defaultCodeFolder } from 'project-manager-config'

interface Interaction {
	id: string
	question: string
	validation(v: string): boolean
	default?: string
}

const interactions: Interaction[] = [
	{
		id: 'computerName',
		question: 'What do you call this computer?',
		validation(v) {
			return v.length !== 0
		},
	},
	{
		id: 'codeFolder',
		question: 'Where is your code stored?',
		validation(v) {
			return v.length !== 0
		},
		default: defaultCodeFolder,
	},
	{
		id: 'depth',
		question: 'How deeply should we look for projects?',
		validation(v) {
			return v.length !== 0
		},
		default: '2',
	},
]

class RL {
	rl: Interface

	constructor(opts: ReadLineOptions) {
		this.rl = createInterface(opts)
	}

	question(query: string) {
		return new Promise<string>((resolve) =>
			this.rl.question(query, resolve),
		)
	}

	close() {
		this.rl.close()
	}
}

export async function quiz(interactions: Interaction[]) {
	const rl = new RL({ input: stdin, output: stdout })
	const ret = {} as any

	for (const interaction of interactions) {
		const question = `${interaction.question}\n${
			interaction.default ? `(${interaction.default})` : ''
		}:  `

		let value: any
		let pass = false
		while (!pass) {
			value = await rl.question(question)
			if (value.length !== 0) {
				pass = interaction.validation(value)
			} else if ('default' in interaction) {
				value = interaction.default
				pass = true
			}
		}

		ret[interaction.id] = value
	}

	rl.close()
	return ret
}

export function configure() {
	console.log('It looks like this is the first time using this here')
	console.log("Let's get set up with a few questions")
	return quiz(interactions)
}
