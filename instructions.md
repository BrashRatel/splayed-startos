# splayed

splayed separates the BTC, XBT and ECX copies of coins you held before those chains split. It
never asks for a seed or private key: it builds unsigned transactions (PSBTs), your wallet signs
them, and splayed checks, broadcasts and tracks them.

## Documentation

- [Web UI guide](https://github.com/BrashRatel/splayed/blob/main/docs/user/web-ui-guide.md): the
  whole route in the browser, step by step, with screenshots.
- [User guide](https://github.com/BrashRatel/splayed/blob/main/docs/user/guide.md): how splitting
  works and why the forks go first.
- [Network and privacy](https://github.com/BrashRatel/splayed/blob/main/docs/user/network-and-privacy.md):
  what each server learns, and the Tor settings.
- [Signers](https://github.com/BrashRatel/splayed/blob/main/docs/user/signers.md): which wallets
  can sign for each chain.
- [Recovery](https://github.com/BrashRatel/splayed/blob/main/docs/user/recovery.md): what to do
  when a transaction is stuck or replaced.

## What you get on StartOS

- **Web UI**: the splayed web interface. It asks for an access token when you sign in.
- **Tor**: splayed reaches public servers only through the Tor service on this server. Tor must be
  installed and running.
- **Your Bitcoin node (optional)**: with the **Use the Bitcoin node** action, splayed reads from
  and broadcasts through Bitcoin Core or Knots on this server instead of public servers, for the
  chain the node follows (BTC, or XBT for a Knots RDTS node). ECX always goes through Tor.

## Getting set up

1. Install and start **Tor** if it isn't already running.
2. Start splayed, then run the **Show UI token** action and copy the token.
3. Open the **Web UI** and paste the token into the sign-in screen. Each browser tab signs in on
   its own.
4. Follow the setup guide on the first screen: review the network settings, import your wallet,
   scan, and plan.
5. Optional: run **Use the Bitcoin node** and switch it on. StartOS then asks you to run a task on
   your Bitcoin node that creates splayed's login; after that, splayed works out which chain the
   node follows and adds it on every start.

To scan wallet QR codes with your camera, open the Web UI at its HTTPS address (the `.local`
address or a domain); browsers allow the camera only over HTTPS.

## Actions

- **Show UI token**: shows the token the Web UI asks for.
- **Reset UI token**: makes a new token. The old one stops working, open tabs must sign in again,
  and splayed restarts.
- **Use the Bitcoin node**: switches your node on or off as a backend. Switching it off leaves it
  in splayed's network settings; remove it there if you no longer want it used.
- **Server passwords**: passwords for node RPC servers you add yourself in the Web UI (Network,
  "Add your own backend", under "Node RPC credentials"). splayed never stores a password in its
  settings; it reads it from the variable named in the server's "Password env var" field. Pick a
  name there, for example `XBT_RPC_PASSWORD`, then add the same name and the password here. splayed
  restarts to pick them up.
