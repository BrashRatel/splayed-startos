import { readFile } from 'node:fs/promises'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { dataDir, runAs, tokenFile, tokenSubpath } from '../utils'

function tokenResult(title: string, message: string | null, token: string) {
  return {
    version: '1' as const,
    title,
    message,
    result: {
      type: 'single' as const,
      value: token,
      copyable: true,
      masked: true,
      qr: false,
      launchable: false,
    },
  }
}

export const showUiToken = sdk.Action.withoutInput(
  'show-ui-token',
  async () => ({
    name: i18n('Show UI token'),
    description: i18n(
      'Show the access token the web interface asks for when you sign in.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: i18n('Web interface'),
    visibility: 'enabled',
  }),
  async () => {
    const token = await readFile(
      sdk.volumes.main.subpath(tokenSubpath),
      'utf8',
    ).then(
      (t) => t.trim(),
      () => '',
    )
    if (!token) {
      return {
        version: '1',
        title: i18n('No token yet'),
        message: i18n(
          'splayed makes the token when it first starts. Start the service, then try again.',
        ),
        result: null,
      }
    }
    return tokenResult(
      i18n('UI access token'),
      i18n(
        'Paste it into the sign-in screen. Each browser tab signs in on its own.',
      ),
      token,
    )
  },
)

export const resetUiToken = sdk.Action.withoutInput(
  'reset-ui-token',
  async () => ({
    name: i18n('Reset UI token'),
    description: i18n(
      'Make a new access token. The old one stops working, and open tabs have to sign in again.',
    ),
    warning: i18n(
      'splayed restarts. A job running in the web interface is stopped.',
    ),
    allowedStatuses: 'only-running',
    group: i18n('Web interface'),
    visibility: 'enabled',
  }),
  async ({ effects }) => {
    await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'splayed' },
      sdk.Mounts.of().mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: dataDir,
        readonly: false,
      }),
      'reset-ui-token',
      (sub) =>
        sub.execFail(
          [
            'sh',
            '-c',
            `splayed ui --new-token-file ${tokenFile} && chown ${runAs}:${runAs} ${tokenFile}`,
          ],
          { user: 'root' },
        ),
    )
    const token = (
      await readFile(sdk.volumes.main.subpath(tokenSubpath), 'utf8')
    ).trim()
    // splayed reads the token at start.
    await sdk.restart(effects)
    return tokenResult(i18n('New UI access token'), null, token)
  },
)
