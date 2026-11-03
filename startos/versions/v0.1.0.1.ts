import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const v_0_1_0_1 = VersionInfo.of({
  version: '0.1.0:1',
  releaseNotes: {
    en_US:
      'Uses the Bitcoin node on first install when one is already installed, and keeps retrying it until it answers (no restart needed)',
    es_ES:
      'Usa el nodo Bitcoin en la primera instalación si ya hay uno instalado, y lo reintenta hasta que responde (sin reiniciar)',
    de_DE:
      'Nutzt bei der Erstinstallation den Bitcoin-Knoten, wenn schon einer installiert ist, und versucht es erneut, bis er antwortet (kein Neustart nötig)',
    pl_PL:
      'Używa węzła Bitcoin przy pierwszej instalacji, jeśli jest już zainstalowany, i ponawia próbę do skutku (bez restartu)',
    fr_FR:
      'Utilise le nœud Bitcoin à la première installation s’il y en a déjà un, et réessaie jusqu’à ce qu’il réponde (sans redémarrage)',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
