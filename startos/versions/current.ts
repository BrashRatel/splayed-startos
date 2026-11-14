import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.1.0:9',
  releaseNotes: {
    en_US:
      'Rebuilt on splayed 0.1.0-alpha.1, the first alpha: fee bumps for BTC and fan-out transactions, --batch linked, coins proven to exist on one chain only, a Split column on the Coins tab, opt-in donor routes in the web interface, and wallet-type descriptions',
    es_ES:
      'Reconstruido sobre splayed 0.1.0-alpha.1, la primera alfa: aumentos de comisión para transacciones BTC y de reparto, --batch linked, monedas que se demuestra que solo existen en una cadena, una columna Split en la pestaña Coins, rutas con donantes opcionales en la interfaz web y descripciones del tipo de cartera',
    de_DE:
      'Neu gebaut auf splayed 0.1.0-alpha.1, der ersten Alpha: Gebührenerhöhungen für BTC- und Fan-out-Transaktionen, --batch linked, Coins, die nachweislich nur auf einer Chain existieren, eine Split-Spalte im Coins-Tab, Donor-Routen in der Weboberfläche nur nach Zustimmung und Beschreibungen des Wallet-Typs',
    pl_PL:
      'Przebudowano na splayed 0.1.0-alpha.1, pierwszej wersji alfa: podbijanie opłat dla transakcji BTC i rozdzielających, --batch linked, monety, które dowodowo istnieją tylko na jednym łańcuchu, kolumna Split w karcie Coins, trasy z dawcami w interfejsie webowym tylko po wyrażeniu zgody oraz opisy typu portfela',
    fr_FR:
      'Reconstruit sur splayed 0.1.0-alpha.1, la première alpha : augmentation des frais pour les transactions BTC et de répartition, --batch linked, pièces dont on prouve qu’elles n’existent que sur une chaîne, une colonne Split dans l’onglet Coins, routes avec donneurs sur activation dans l’interface web, et description du type de portefeuille',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
