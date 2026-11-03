import { sdk } from '../sdk'
import { burnHistory } from './burnHistory'
import { resetUiToken, showUiToken } from './uiToken'
import { useBitcoind } from './useBitcoind'

export const actions = sdk.Actions.of()
  .addAction(showUiToken)
  .addAction(resetUiToken)
  .addAction(useBitcoind)
  .addAction(burnHistory)
