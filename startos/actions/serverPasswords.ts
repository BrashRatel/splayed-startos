import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { envNamePattern, isServerPasswordEnv } from '../utils'

const { InputSpec, List, Value } = sdk

const inputSpec = InputSpec.of({
  passwords: Value.list(
    List.obj(
      {
        name: i18n('Passwords'),
        description: i18n(
          'One entry for each server that needs a password. In the web interface, put the same variable name in the server\'s "Password env var" field and the user name in "RPC user".',
        ),
        default: [],
      },
      {
        spec: InputSpec.of({
          variable: Value.text({
            name: i18n('Variable name'),
            description: i18n(
              'The name you put in the server\'s "Password env var" field, for example XBT_RPC_PASSWORD. Capital letters, digits and _; it can\'t start with SPLAYED_.',
            ),
            required: true,
            default: null,
            placeholder: 'XBT_RPC_PASSWORD',
            patterns: [
              {
                regex: envNamePattern,
                description: i18n(
                  'Capital letters, digits and _, starting with a letter',
                ),
              },
            ],
          }),
          password: Value.text({
            name: i18n('Password'),
            description: null,
            required: true,
            default: null,
            masked: true,
          }),
        }),
        displayAs: '{{variable}}',
        uniqueBy: 'variable',
      },
    ),
  ),
})

/**
 * Passwords for servers the user adds in the web interface (an RPC node elsewhere). splayed reads
 * an RPC password only from the environment variable named in the server's settings, and a
 * StartOS user has no other way to set one: this stores them and main.ts passes them in.
 */
export const serverPasswords = sdk.Action.withInput(
  'server-passwords',
  async () => ({
    name: i18n('Server passwords'),
    description: i18n(
      'Passwords for node RPC servers you added in the web interface. splayed reads each from the variable named in the server\'s "Password env var" field.',
    ),
    warning: i18n(
      'splayed restarts when the passwords change. A job running in the web interface is stopped.',
    ),
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),
  inputSpec,
  async () => ({
    passwords: (await storeJson.read((s) => s.serverPasswords).once()) ?? [],
  }),
  async ({ effects, input }) => {
    const bad = input.passwords
      .map((p) => p.variable)
      .filter((v) => !isServerPasswordEnv(v))
    if (bad.length) {
      return {
        version: '1',
        title: i18n('Not saved'),
        message: `${i18n('These names are reserved; choose others:')} ${bad.join(', ')}`,
        result: null,
      }
    }
    await storeJson.merge(effects, {
      serverPasswords: input.passwords.map((p) => ({
        variable: p.variable,
        password: p.password,
      })),
    })
    return null
  },
)
