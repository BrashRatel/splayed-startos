import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.1.0:6',
  releaseNotes: {
    en_US:
      'Rebuilt on splayed 0.1.0-pre-alpha.2: node RPC backends now speak JSON-RPC 2.0, so a node that only implements 2.0 can be used, and the regtest-tested signing, verify and broadcast paths are wider',
    es_ES:
      'Reconstruido sobre splayed 0.1.0-pre-alpha.2: los backends RPC de nodo ahora usan JSON-RPC 2.0, de modo que se puede usar un nodo que solo implementa 2.0, y las rutas de firma, verificación y envío probadas en regtest son más amplias',
    de_DE:
      'Neu gebaut auf splayed 0.1.0-pre-alpha.2: Knoten-RPC-Backends sprechen jetzt JSON-RPC 2.0, sodass ein Knoten, der nur 2.0 kann, nutzbar ist, und die auf Regtest getesteten Signier-, Prüf- und Broadcast-Wege sind breiter',
    pl_PL:
      'Przebudowano na splayed 0.1.0-pre-alpha.2: backendy RPC węzła używają teraz JSON-RPC 2.0, więc można użyć węzła obsługującego tylko 2.0, a ścieżki podpisywania, weryfikacji i wysyłania testowane w regtest są szersze',
    fr_FR:
      'Reconstruit sur splayed 0.1.0-pre-alpha.2 : les backends RPC de nœud utilisent désormais JSON-RPC 2.0, ce qui permet d’utiliser un nœud qui n’implémente que la 2.0, et les chemins de signature, de vérification et de diffusion testés en regtest sont plus larges',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
