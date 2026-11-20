# Linear-Relay für Atlas

- In der bestehenden OS-App `POST /api/linear-agent` ergänzen. Signatur, Zeitstempel und Event vor der Bestätigung validieren. Den Relay mit Next.js `after()` ausführen.
- Die E-Mail des auslösenden Benutzers prüfen, eine Linear-Activity posten und den reduzierten Payload an die Atlas-Routine senden.
- Signatur, Zeitfenster, Allowlist, Mapping und Upstream-Fehler mit Vitest und Mock-Fetch prüfen. Die spätere Einrichtung und offenen Live-Checks in [linear-agent.md](linear-agent.md) dokumentieren.
