import { sdk } from '../sdk'
import { burnHistory } from './burnHistory'
import { serverPasswords } from './serverPasswords'
import { resetUiToken, showUiToken } from './uiToken'
import { useBitcoind } from './useBitcoind'

export const actions = sdk.Actions.of()
  .addAction(showUiToken)
  .addAction(resetUiToken)
  .addAction(useBitcoind)
  .addAction(serverPasswords)
  .addAction(burnHistory)
