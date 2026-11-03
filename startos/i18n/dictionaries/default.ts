export const DEFAULT_LANG = 'en_US'

const dict = {
  'Show UI token': 0,
  'Show the access token the web interface asks for when you sign in.': 1,
  'Web interface': 2,
  'No token yet': 3,
  'splayed makes the token when it first starts. Start the service, then try again.': 4,
  'UI access token': 5,
  'Paste it into the sign-in screen. Each browser tab signs in on its own.': 6,
  'Reset UI token': 7,
  'Make a new access token. The old one stops working, and open tabs have to sign in again.': 8,
  'splayed restarts. A job running in the web interface is stopped.': 9,
  'New UI access token': 10,
  'Use the Bitcoin node on this server': 11,
  'splayed works out whether the node follows BTC or XBT and uses it for that chain, in place of public servers. ECX and the other chain still go through Tor.': 12,
  'Use the Bitcoin node': 13,
  'Read from and broadcast through your own Bitcoin Core or Knots node on this server.': 14,
  'Bitcoin node switched off': 15,
  'splayed keeps the node in its network settings. To stop using it, remove it in the web interface (Network: its address starts with http://10.0.3.1).': 16,
  'Reaches public ECX, XBT and BTC servers without revealing your IP address': 17,
  'Optional: your own node for BTC or XBT, in place of public servers': 18,
  'Create the RPC login splayed uses to read from your node': 19,
  'Web UI': 20,
  'The splayed web interface. Sign in with the token from the Show UI token action.': 21,
  'Starting splayed': 22,
  'The web interface is ready': 23,
  'The web interface is not ready': 24,
  'I understand: forget everything and start over': 25,
  'Removes your imported wallet, fork destinations, scan results and every plan with its PSBTs, signed files and progress. Keeps your network settings and any servers you added, and the web interface token. The network confirmation is reset, so you confirm it again. Nothing on any blockchain changes.': 26,
  'Even if sent transactions are not confirmed yet': 27,
  'splayed refuses while a transaction you sent is still unconfirmed, because wiping stops it from following that transaction. Switch this on only if you are sure.': 28,
  'Burn history': 29,
  'Forget your wallet, scan results and plans, and start over. Keeps your servers and settings.': 30,
  'This deletes your plans and signed files for good. Back up first if you want to keep them.': 31,
  Data: 32,
  'Nothing wiped': 33,
  'Switch on "I understand" to wipe. Nothing was changed.': 34,
  Wiped: 35,
  'Not wiped': 36,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
