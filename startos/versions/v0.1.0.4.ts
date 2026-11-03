import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const v_0_1_0_4 = VersionInfo.of({
  version: '0.1.0:4',
  releaseNotes: {
    en_US:
      'Updates splayed (refuses bare hex keys that could be private keys, explains timelocked and miniscript descriptors, asks about the rest of a chain when its TEST FIRST transaction cannot go out) and adds the splayed icon',
    es_ES:
      'Actualiza splayed (rechaza claves hexadecimales sueltas que podrían ser privadas, explica los descriptores con bloqueo temporal y miniscript, pregunta por el resto de una cadena cuando su transacción TEST FIRST no puede salir) y añade el icono de splayed',
    de_DE:
      'Aktualisiert splayed (lehnt nackte Hex-Schlüssel ab, die private Schlüssel sein könnten, erklärt Deskriptoren mit Zeitsperre und Miniscript, fragt nach dem Rest einer Chain, wenn deren TEST-FIRST-Transaktion nicht gesendet werden kann) und fügt das splayed-Symbol hinzu',
    pl_PL:
      'Aktualizuje splayed (odrzuca gołe klucze hex, które mogą być kluczami prywatnymi, wyjaśnia deskryptory z blokadą czasową i miniscript, pyta o resztę łańcucha, gdy jego transakcja TEST FIRST nie może zostać wysłana) i dodaje ikonę splayed',
    fr_FR:
      'Met à jour splayed (refuse les clés hexadécimales nues qui pourraient être privées, explique les descripteurs à verrou temporel et miniscript, pose la question pour le reste d’une chaîne quand sa transaction TEST FIRST ne peut pas partir) et ajoute l’icône de splayed',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
