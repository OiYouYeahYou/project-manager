# Project Manager Local Status

The core of the on device process, getting all the data locally

## Installation

```sh
npm i project-manager-local-status
```

## Usage

```ts
import { homedir } from 'os'

import { getStatus } from 'project-manager-local-status'

const projectDirectory = `${homedir}/code`
const projects = await getStatus({ directory })

for (const project of projects) {
	console.log(project.path, await project.info())
}
```
