import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.1.0:8',
  releaseNotes: {
    en_US:
      'Adds a Server passwords action: passwords for node RPC servers you add in the web interface, given to splayed under the variable named in the server\'s "Password env var" field',
    es_ES:
      'Añade la acción Contraseñas de servidores: contraseñas de los servidores RPC de nodos que añades en la interfaz web, que splayed recibe en la variable indicada en el campo «Password env var» del servidor',
    de_DE:
      'Neue Aktion „Server-Passwörter“: Passwörter für Knoten-RPC-Server, die du in der Weboberfläche hinzufügst; splayed erhält sie in der Variable aus dem Feld „Password env var“ des Servers',
    pl_PL:
      'Dodaje akcję Hasła serwerów: hasła do serwerów RPC węzłów dodanych w interfejsie webowym, przekazywane do splayed w zmiennej podanej w polu „Password env var” serwera',
    fr_FR:
      'Ajoute l’action Mots de passe des serveurs : les mots de passe des serveurs RPC de nœuds ajoutés dans l’interface web, transmis à splayed dans la variable indiquée dans le champ « Password env var » du serveur',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
