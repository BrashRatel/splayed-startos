import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v_0_1_0_0 } from './v0.1.0.0'
import { v_0_1_0_1 } from './v0.1.0.1'

export const versionGraph = VersionGraph.of({
  current,
  other: [v_0_1_0_0, v_0_1_0_1],
})
