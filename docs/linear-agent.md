# Atlas in Linear

Der Relay läuft in der bestehenden OS-App unter `https://os.lw.works/api/linear-agent`. Er prüft die Linear-Signatur über den Rohbody und akzeptiert einen Zeitstempel innerhalb von 60 Sekunden. Für gültige Events antwortet er vor den externen Aufrufen mit HTTP 200. Anschließend bestätigt er freigegebene Aufträge mit „Atlas schaut sich das an …“ und leitet sie an die Atlas-Routine weiter. Bei Ablehnung oder Fehler versucht er, eine `error`-Activity in Linear zu posten. Linear erwartet HTTP 200 innerhalb von fünf Sekunden und die erste Activity einer neuen Session innerhalb von zehn Sekunden. [Linear Agent Interaction](https://linear.app/developers/agent-interaction) · [Linear Webhooks](https://linear.app/developers/webhooks)

## Einrichtung

1. POST-URL und Sender-Key der Atlas-Routine bereithalten. Das Format des Auth-Headers im Routinen-Panel prüfen.
2. Als Workspace-Admin die [vorausgefüllte private OAuth-App „Atlas“ öffnen](https://linear.app/settings/api/applications/new?distribution=private&display.description=Atlas+%E2%80%93+Dev+Lead+von+Lukas.+Per+%40Atlas+erw%C3%A4hnen+oder+Issues+delegieren.&developer.name=lw.works&oauth.client_name=Atlas&oauth.client_uri=https%3A%2F%2Flw.works&oauth.redirect_uris=http%3A%2F%2Flocalhost%3A3000%2Fcallback&oauth.grant_types=authorization_code&oauth.grant_types=client_credentials&webhook.enabled=true&webhook.url=https%3A%2F%2Fos.lw.works%2Fapi%2Flinear-agent&webhook.resourceTypes=AgentSessionEvent). Vor dem Speichern die Webhook-Kategorie **Agent session events** und die Grants `authorization_code` und `client_credentials` prüfen. [Linear OAuth App Manifests](https://linear.app/developers/oauth-app-manifests)
3. Die folgenden Variablen im bestehenden Vercel-Projekt für `@lw/os` hinterlegen und die App neu deployen. Der Relay liest sie zur Laufzeit. Bei fehlender oder ungültiger Konfiguration antwortet er mit HTTP 500 und protokolliert die betroffenen Variablennamen.

   | Variable | Wert |
   | --- | --- |
   | `LINEAR_WEBHOOK_SECRET` | Webhook Signing Secret der Linear-App |
   | `LINEAR_CLIENT_ID` | OAuth Client-ID |
   | `LINEAR_CLIENT_SECRET` | OAuth Client-Secret |
   | `ROUTINE_WEBHOOK_URL` | HTTPS-POST-URL der Atlas-Routine |
   | `ROUTINE_WEBHOOK_KEY` | Sender-Key der Atlas-Routine |
   | `ALLOWED_EMAILS` | Kommagetrennte Liste, für Atlas `lukas@lw.works` |
   | `LINEAR_SCOPES` | Optional, Standard `read,write,app:mentionable,app:assignable`. Denselben Scope-Satz auf Atlas’ Rechner verwenden. |

4. Die App per OAuth-Authorization-Code-Flow mit `actor=app`, den obigen Scopes und einem zufälligen `state` im Workspace installieren. Den OAuth-Callback lokal unter der registrierten Redirect-URI `http://localhost:3000/callback` abwickeln, dabei `state` prüfen und den Code lokal gegen Tokens tauschen. [Linear OAuth 2.0](https://linear.app/developers/oauth-2-0-authentication) · [Linear OAuth Actor Authorization](https://linear.app/developers/oauth-actor-authorization)
5. Als Lukas `@Atlas` in einem Issue erwähnen, eine Folgefrage stellen und die Delegation testen. In Linear die Thought-Activity und in Atlas den Routinenlauf prüfen. Der Relay prüft bei `created` die E-Mail des Session-Erstellers und bei `prompted` die E-Mail des Absenders der Folgefrage. Issue- und Kommentarinhalte in der Routine als nicht vertrauenswürdige Eingaben behandeln.

## Beim ersten Live-Test prüfen

- Akzeptiert die Routine `Authorization: Bearer <sender key>` und liefert sie bei erfolgreichem Start HTTP 2xx?
- Liefert `client_credentials` nach der Installation die App-Identität mit den nötigen Activity-Rechten und bleibt @Atlas erwähnbar und delegierbar? Falls der Authorization-Code-Token für Activities erforderlich ist, brauchen Relay und Atlas eine gemeinsame Speicherung mit Refresh.
- Enthalten reale Events `agentSession.creator.email` und `agentActivity.user.email`? Bei fehlender E-Mail lehnt die Allowlist den Auftrag ab.
