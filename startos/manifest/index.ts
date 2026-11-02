import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'splayed',
  title: 'splayed',
  license: 'MIT',
  packageRepo: 'https://github.com/BrashRatel/splayed-startos',
  upstreamRepo: 'https://github.com/BrashRatel/splayed',
  marketingUrl: 'https://github.com/BrashRatel/splayed',
  donationUrl: null,
  description: { short, long },
  // main: splayed's data directory (config, wallets as public descriptors, plans, PSBTs).
  // startos: this package's store.json.
  volumes: ['main', 'startos'],
  images: {
    splayed: {
      source: {
        dockerBuild: {
          workdir: './upstream-project',
          dockerfile: './upstream-project/docker/Dockerfile',
          // StartOS runs Tor as its own service; splayed uses it (SPLAYED_TOR_MODE=system).
          buildArgs: { WITH_TOR: '0' },
        },
      },
      // Deno has no riscv64 build.
      arch: ['x86_64', 'aarch64'],
    },
  },
})
