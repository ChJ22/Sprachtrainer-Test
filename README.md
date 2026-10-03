# Sprachtrainer – Konten-Testversion

Separate Testversion für https://chj22.github.io/Sprachtrainer-Test/.
Der bisherige Trainer bleibt unter https://chj22.github.io/Sprachtrainer/ erreichbar.

## Angebot
Sechs Menü- und Basissprachen: Deutsch, Englisch, Französisch, Spanisch, Italienisch, Polnisch. Jede kann mit einer anderen kombiniert werden. Je Sprachpaar 300 Wörter, 120 Sätze in sechs Situationen und 60 Grammatikaufgaben je Lernrichtung. Die zwei Vorlesebuttons spielen nur nach Antippen.

## Benutzerkonten
Optional mit E-Mail und Passwort registrieren, Bestätigungslink öffnen, anmelden. Als Gast bleibt das Training nutzbar; Gastantworten werden nicht in die Datenbank übernommen. Angemeldete Antworten werden mit Benutzer-ID, Basissprache, Lernsprache, Übungsart, Richtung und Datum gespeichert. Mein gespeicherter Lernstand zeigt ausschließlich beantwortete Aufgaben und offene Fehler für die aktuell ausgewählte Basis- und Lernsprache. Beim Wechsel einer Sprache aktualisiert sich die Übersicht sofort; Ergebnisse anderer Sprachpaare bleiben gespeichert; in der Übungsauswahl lassen sich gespeicherte Fehler wiederholen.

Nicht übertragene Antworten bleiben im lokalen Speicher desselben Benutzers vorgemerkt. Synchronisieren versucht erneut zu übertragen. Beim Kontowechsel wird die Runde zurückgesetzt. Das ist noch kein Fortsetzen exakt derselben laufenden Runde.

Die neue Kontoverwaltung ist vorerst deutsch beschriftet. Die bisherigen Lernmenüs sind weiterhin in sechs Sprachen verfügbar. Grammatik-Erklärungen sind weiterhin deutsch, einzelne Übersetzungen für Grammatikbeispiele fehlen in manchen Sprachpaaren.

## Veröffentlichung
Alle Dateien aus dem entpackten Ordner direkt im Stammverzeichnis des separaten Repository Sprachtrainer-Test hochladen. GitHub Pages: Deploy from a branch, main, / (root).
Die Supabase-Tabelle trainer_attempts_test wurde separat über den SQL Editor vorbereitet. config.js enthält nur die öffentliche Projekt-URL und den Publishable Key. Kein Datenbankpasswort oder Secret Key wird benötigt.

## Prüfstand
Automatisierte Prüfungen mit simulierter Datenbank prüfen Navigation, Sprachpaare, Speicherung, Wiederholung, Offline-Wiederholung und Kontowechsel. Die tatsächliche Registrierung, Bestätigungs-E-Mail, Speicherung und Trennung zweier Testkonten müssen anschließend auf der veröffentlichten Testseite geprüft werden.
