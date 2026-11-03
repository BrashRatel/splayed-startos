import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v_0_1_0_0 } from './v0.1.0.0'
import { v_0_1_0_1 } from './v0.1.0.1'
import { v_0_1_0_2 } from './v0.1.0.2'
import { v_0_1_0_3 } from './v0.1.0.3'

export const versionGraph = VersionGraph.of({
  current,
  other: [v_0_1_0_0, v_0_1_0_1, v_0_1_0_2, v_0_1_0_3],
})
