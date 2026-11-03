import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.1.0:2',
  releaseNotes: {
    en_US:
      'Adds a Get amnesia action and button to wipe the wallet, scans and plans and start over (keeps your servers); uses the Bitcoin node on first install when one is already installed, and keeps retrying it until it answers',
    es_ES:
      'Añade la acción y el botón Olvidar todo para borrar billetera, análisis y planes y empezar de nuevo (conserva tus servidores); usa el nodo Bitcoin en la primera instalación si ya existe uno y lo reintenta hasta que responde',
    de_DE:
      'Neue Aktion und Schaltfläche „Gedächtnis löschen“: Wallet, Scans und Pläne löschen und neu beginnen (Server bleiben); nutzt bei der Erstinstallation den vorhandenen Bitcoin-Knoten und versucht es erneut, bis er antwortet',
    pl_PL:
      'Dodaje akcję i przycisk Zapomnij wszystko (usuwa portfel, skany i plany; serwery zostają); używa węzła Bitcoin przy pierwszej instalacji, jeśli istnieje, i ponawia próbę do skutku',
    fr_FR:
      'Ajoute l’action et le bouton Perdre la mémoire (efface portefeuille, analyses et plans, garde vos serveurs) ; utilise le nœud Bitcoin à la première installation s’il existe et réessaie jusqu’à ce qu’il réponde',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
