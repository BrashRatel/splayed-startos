import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { dataDir, runAs } from '../utils'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  confirm: Value.toggle({
    name: i18n('I understand: forget everything and start over'),
    description: i18n(
      'Removes your imported wallet, fork destinations, scan results and every plan with its PSBTs, signed files and progress. Keeps your network settings and any servers you added, and the web interface token. The network confirmation is reset, so you confirm it again. Nothing on any blockchain changes.',
    ),
    default: false,
  }),
  force: Value.toggle({
    name: i18n('Even if sent transactions are not confirmed yet'),
    description: i18n(
      'splayed refuses while a transaction you sent is still unconfirmed, because wiping stops it from following that transaction. Switch this on only if you are sure.',
    ),
    default: false,
  }),
})

/** The web interface's "Burn history" button, as an action: `splayed wipe --yes`. */
export const burnHistory = sdk.Action.withInput(
  'burn-history',
  async () => ({
    name: i18n('Burn history'),
    description: i18n(
      'Forget your wallet, scan results and plans, and start over. Keeps your servers and settings.',
    ),
    warning: i18n(
      'This deletes your plans and signed files for good. Back up first if you want to keep them.',
    ),
    allowedStatuses: 'any',
    group: i18n('Data'),
    visibility: 'enabled',
  }),
  inputSpec,
  async () => ({ confirm: false, force: false }),
  async ({ effects, input }) => {
    if (!input.confirm) {
      return {
        version: '1',
        title: i18n('Nothing wiped'),
        message: i18n('Switch on "I understand" to wipe. Nothing was changed.'),
        result: null,
      }
    }
    const res = await sdk.SubContainer.withTemp(
      effects,
      { imageId: 'splayed' },
      sdk.Mounts.of().mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: dataDir,
        readonly: false,
      }),
      'burn-history',
      (sub) =>
        sub.exec(
          ['splayed', 'wipe', '--yes', ...(input.force ? ['--force'] : [])],
          {
            user: runAs,
          },
        ),
    )
    const out = [res.stdout, res.stderr]
      .map((t) => (typeof t === 'string' ? t.trim() : ''))
      .filter(Boolean)
      .join('\n')
    return {
      version: '1',
      title: res.exitCode === 0 ? i18n('Wiped') : i18n('Not wiped'),
      message: out || null,
      result: null,
    }
  },
)
