import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.1.0:5',
  releaseNotes: {
    en_US:
      'Rebuilt on the released splayed 0.1.0-pre-alpha.1: a failed broadcast that says nothing about the transaction (a gateway error, a node still starting) is no longer recorded as a rejection, and track reports a chain it could not reach instead of exiting quietly',
    es_ES:
      'Reconstruido sobre splayed 0.1.0-pre-alpha.1: un envío fallido que no dice nada sobre la transacción (error de pasarela, nodo aún iniciando) ya no se registra como rechazo, y track informa de una cadena inalcanzable en lugar de terminar en silencio',
    de_DE:
      'Neu gebaut auf dem veröffentlichten splayed 0.1.0-pre-alpha.1: Ein fehlgeschlagener Broadcast, der nichts über die Transaktion aussagt (Gateway-Fehler, Knoten startet noch), wird nicht mehr als Ablehnung gespeichert, und track meldet eine nicht erreichbare Chain, statt stillschweigend zu enden',
    pl_PL:
      'Przebudowano na wydanym splayed 0.1.0-pre-alpha.1: nieudane wysłanie, które nic nie mówi o transakcji (błąd bramy, węzeł jeszcze się uruchamia), nie jest już zapisywane jako odrzucenie, a track zgłasza nieosiągalny łańcuch zamiast kończyć po cichu',
    fr_FR:
      'Reconstruit sur splayed 0.1.0-pre-alpha.1 : une diffusion échouée qui ne dit rien de la transaction (erreur de passerelle, nœud en cours de démarrage) n’est plus enregistrée comme un rejet, et track signale une chaîne inaccessible au lieu de se terminer en silence',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
