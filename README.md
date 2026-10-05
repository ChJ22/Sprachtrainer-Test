# Sprachtrainer – Dialog-Testversion

Separate Testversion für https://chj22.github.io/Sprachtrainer-Test/.
Der bisherige Trainer bleibt unter https://chj22.github.io/Sprachtrainer/ erreichbar.

## Angebot
Sechs Menü- und Basissprachen: Deutsch, Englisch, Französisch, Spanisch, Italienisch, Polnisch. Jede kann mit einer anderen kombiniert werden. Je Sprachpaar 300 Wörter, 120 Sätze in sechs Situationen und 60 Grammatikaufgaben je Lernrichtung. Zusätzlich: 10 Dialoge mit je 6 Schritten (60 Aufgaben) in jeder der sechs Sprachen. Die zwei Vorlesebuttons spielen nur nach Antippen.

## Benutzerkonten
Optional mit E-Mail und Passwort registrieren, Bestätigungslink öffnen, anmelden. Als Gast bleibt das Training nutzbar; Gastantworten werden nicht in die Datenbank übernommen. Angemeldete Antworten werden mit Benutzer-ID, Basissprache, Lernsprache, Übungsart, Richtung und Datum gespeichert. Mein gespeicherter Lernstand zeigt ausschließlich beantwortete Aufgaben und offene Fehler für die aktuell ausgewählte Basis- und Lernsprache. Beim Wechsel einer Sprache aktualisiert sich die Übersicht sofort; Ergebnisse anderer Sprachpaare bleiben gespeichert; in der Übungsauswahl lassen sich gespeicherte Fehler wiederholen.

Nicht übertragene Antworten bleiben im lokalen Speicher desselben Benutzers vorgemerkt. Synchronisieren versucht erneut zu übertragen. Beim Kontowechsel wird die Runde zurückgesetzt. Das ist noch kein Fortsetzen exakt derselben laufenden Runde.

Kontoverwaltung, Statusmeldungen, Lernstandsübersicht und Fehlerwiederholung folgen wie die Lernmenüs der gewählten Menüsprache (alle sechs Sprachen). Grammatik-Erklärungen sind weiterhin deutsch, einzelne Übersetzungen für Grammatikbeispiele fehlen in manchen Sprachpaaren.

## Veröffentlichung
Alle Dateien aus dem entpackten Ordner direkt im Stammverzeichnis des separaten Repository Sprachtrainer-Test hochladen. GitHub Pages: Deploy from a branch, main, / (root).
Die Supabase-Tabelle trainer_attempts_test wurde separat über den SQL Editor vorbereitet. config.js enthält nur die öffentliche Projekt-URL und den Publishable Key. Kein Datenbankpasswort oder Secret Key wird benötigt.

## Prüfstand
Automatisierte Prüfungen mit simulierter Datenbank prüfen Navigation, Sprachpaare, Speicherung, Wiederholung, Offline-Wiederholung und Kontowechsel. Die tatsächliche Registrierung, Bestätigungs-E-Mail, Speicherung und Trennung zweier Testkonten müssen anschließend auf der veröffentlichten Testseite geprüft werden.

## Darstellung
Aufgaben, Antworten und Lernaktionen sind optisch hervorgehoben. Menü- und Basissprache, Konto, Synchronisierung und Lernstand sind kompakter gestaltet. Bedienelemente behalten mindestens 44 Pixel Höhe; Eingabefelder verwenden mindestens 16 Pixel Schriftgröße.

## Dialoge
Café, Lebensmitteleinkauf, Hotel, Bahnhof, Kennenlernen, Restaurant, Arzttermin, Kleidung, Besuch bei Freunden und Wohnungssuche. Alle 30 Sprachpaare sind möglich; die Antwortsprache kann auf eine der beiden Sprachen eingestellt werden.

Der Gesprächspartner stellt eine Frage. Ein kurzer Hinweis in der anderen Sprache gibt deine gewünschte Antwort vor, damit auch bei offenen Fragen eindeutig ist, welche der drei Antworten gesucht wird. Der Verlauf zeigt die richtigen Gesprächsbeiträge. Vor dem Antworten lesen die Audiobuttons die Frage, danach die richtige Antwort vor. Keine automatische Tonwiedergabe. Die Gespräche bleiben in ihrer Reihenfolge; falsche Schritte werden erst in der Fehlerwiederholung erneut abgefragt.

Eine ausgewählte Situation umfasst sechs Schritte und endet automatisch mit der Auswertung. Bei „Alle Situationen“ werden alle zehn Gespräche in zufälliger Reihenfolge durchgeführt (60 Schritte). Du kannst jederzeit mit „Runde beenden“ aufhören.

## Zusätzlicher Datenbankschritt
Vor dem Hochladen die separat gelieferte Datei Sprachtrainer-Dialoge-Datenbank.sql im SQL Editor des bestehenden Supabase-Projekts ausführen. Sie erstellt trainer_dialog_attempts_test mit SELECT/INSERT-Rechten und benutzerspezifischen RLS-Regeln. Die bestehende Tabelle trainer_attempts_test bleibt unverändert. Dialogantworten haben eine eigene Kategorie im Lernstand; gespeicherte Fehler werden nach Benutzer, Sprachpaar und Antwortsprache getrennt.

25 Dateien aus dem Ordner Sprachtrainer-Test direkt in das Repository Sprachtrainer-Test hochladen (nicht den Ordner selbst und nicht die ZIP-Datei). Der Haupttrainer wird durch diesen Upload nicht geändert. Bisherige Übungsantworten werden weiterhin aus der bestehenden Tabelle geladen.

## Neue Prüfungen
Automatisierte Simulationen prüfen die Dialognavigation für alle 30 Sprachpaare in beiden Antwortsprachen, sechs Schritte in der richtigen Reihenfolge, Gesprächsverlauf, Auswertung, Fehlerwiederholung, separate Speicherung und Kontotrennung. Die bisherigen Funktionsprüfungen bestehen ebenfalls. Die tatsächliche Supabase-Tabelle und die Darstellung auf dem iPhone müssen nach dem SQL-Schritt und dem Upload geprüft werden.

## Überarbeitetes Layout
Ruhiger Markenbereich, kompakte Kontoverwaltung und ein eigener, hervorgehobener Lernbereich. Übungsarten erscheinen auf großen Bildschirmen in zwei Spalten und auf dem Smartphone untereinander. Einheitliche Abstände, gut erkennbare Fokusmarkierungen, klare Antwortzustände und ein reduzierter Bewegungsmodus unterstützen die Bedienung. styles.css muss mit hochgeladen werden. Die Datenbank benötigt für die Layoutänderung keine Anpassung.

## Lernstand hervorheben
Wörter, Sätze, Grammatik und Dialoge haben eigene Karten mit fett hervorgehobener Kategorie und einer großen Zahl offener Fehler. Bereiche mit offenen Fehlern sind bernsteinfarben markiert; bei null offenen Fehlern bleibt die Karte neutral. Die ergänzenden Antwortzahlen stehen kleiner darunter. Die Anzeige bleibt nach Sprachpaar und Benutzer getrennt und folgt allen sechs Menüsprachen.
