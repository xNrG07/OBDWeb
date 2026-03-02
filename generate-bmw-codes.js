#!/usr/bin/env node
// generate-bmw-codes.js – Creates src/bmw-codes.json
const fs = require("fs");
const path = require("path");

const codes = [];
function add(code, system, title, short, long, symptoms, causes, urgency, checks, shop, faqs, related) {
  codes.push({ code, system, title, shortMeaning: short, meaningLong: long, symptoms, causes, urgency, firstChecks: checks, whenToShop: shop, faqs, related });
}

// ═══════════════════════════════════════════════════════════════
// DME – Digitale Motor Elektronik (Benziner)
// ═══════════════════════════════════════════════════════════════

add("2EF5","DME","Kennfeldthermostat, Ansteuerung","Der elektrisch gesteuerte Kennfeldthermostat wird nicht korrekt angesteuert.","BMW nutzt elektrisch geregelte Thermostaten, die vom DME je nach Last und Temperatur gesteuert werden. Bei Fehler 2EF5 kann das Steuergerät den Thermostat nicht korrekt öffnen oder schließen. Das führt zu Temperaturproblemen.",
["Motorkontrollleuchte leuchtet","Motor wird zu heiß oder nicht warm genug","Heizung funktioniert schlecht","Kühlerlüfter läuft ständig","Erhöhter Kraftstoffverbrauch"],
["Kennfeldthermostat defekt (häufigste Ursache)","Verkabelung zum Thermostat beschädigt","Korrodierter Stecker","Kühlmittelverlust","Steuergerät-Fehler (selten)","Thermostat mechanisch blockiert","Falsches Ersatzteil verbaut","Sicherung defekt"],
"medium",
["Kühlmittelstand und -zustand prüfen","Stecker am Thermostat auf festen Sitz kontrollieren","Temperaturanzeige beobachten – pendelt sie oder bleibt sie niedrig?","Kühlerlüfter-Verhalten beobachten","Fehlercode mit BMW-Diagnose auslesen und Freeze-Frame prüfen"],
"Wenn der Motor überhitzt oder die Temperatur dauerhaft zu niedrig bleibt. Der Kennfeldthermostat ist ein bekanntes Verschleißteil bei BMW.",
[{q:"Ist der Kennfeldthermostat ein häufiges Problem?",a:"Ja, besonders bei N52, N54, N55 und B48 Motoren ist er ein bekanntes Verschleißteil."},{q:"Was kostet der Thermostat?",a:"Das Originalteil kostet 80 bis 200 Euro, Einbau 100 bis 250 Euro."},{q:"Kann ich weiterfahren?",a:"Bei Überhitzung nicht. Wenn der Motor nur nicht warm wird, kurzfristig ja."},{q:"Wie erkenne ich den Defekt?",a:"Temperaturanzeige bleibt niedrig, Heizung wird nicht warm, oder Motor wird zu heiß."},{q:"Kann ich den Thermostat selbst tauschen?",a:"Bei einigen Modellen machbar, aber die Kühlsystem-Entlüftung erfordert Erfahrung."},{q:"Wird der Fehler beim TÜV geprüft?",a:"BMW-interne Codes werden beim TÜV nicht direkt geprüft, aber Überhitzungsschäden schon."}],
["2E81","2E82","2E83","2EAE"]);

add("2E81","DME","Kühlmitteltemperatursensor, Signal nicht plausibel","Der Kühlmitteltemperatursensor liefert dem DME unplausible Werte.","Das DME vergleicht den ECT-Sensorwert mit anderen Parametern (Ansaugluft, Öltemperatur, Fahrtdauer). Bei deutlichen Abweichungen wird 2E81 gesetzt.",
["Motorkontrollleuchte möglich","Temperaturanzeige schwankt oder zeigt falsch","Lüftersteuerung arbeitet falsch","Kaltstartprobleme","Erhöhter Verbrauch"],
["Defekter Kühlmitteltemperatursensor","Luftblase im Kühlsystem","Korrodierter Stecker","Kabelbruch","Thermostat defekt","Niedriger Kühlmittelstand","Defekter Kühler","Steuergerätfehler (selten)"],
"medium",
["Kühlmittelstand prüfen","Kühlsystem auf Luftblasen prüfen","Sensor-Stecker kontrollieren","Temperaturverlauf mit Diagnose beobachten","Auf Kühlmittelspuren unter dem Auto achten"],
"Wenn die Temperaturanzeige dauerhaft falsch anzeigt oder der Motor überhitzt.",
[{q:"Kann eine Luftblase den Fehler verursachen?",a:"Ja, das ist bei BMW ein häufiges Problem, besonders nach Kühlmittelarbeiten."},{q:"Wie entlüfte ich das BMW-Kühlsystem?",a:"BMW hat ein spezielles Entlüftungsverfahren – in der Werkstatt machen lassen."},{q:"Was kostet ein neuer Sensor?",a:"20 bis 60 Euro plus Einbau."},{q:"Ist der Fehler gefährlich?",a:"Bei falsch gesteuertem Lüfter besteht Überhitzungsgefahr."},{q:"Wo sitzt der Sensor?",a:"Meist am Motorblock oder am Thermostatgehäuse."},{q:"Hängt 2E81 mit dem Thermostat zusammen?",a:"Möglich – ein klemmender Thermostat kann ähnliche Symptome verursachen."}],
["2EF5","2E82","2E83","2EAE"]);

add("2E82","DME","Kühlmitteltemperatursensor, Signal zu niedrig","Der ECT-Sensor meldet dem DME eine unrealistisch niedrige Temperatur.","Meist ein Kurzschluss in der Sensorleitung oder ein defekter Sensor.",
["Temperaturanzeige bleibt auf Minimum","Lüfter läuft nicht an","Fettes Gemisch (mehr Verbrauch)","Keine Motorwarnleuchte zwingend","Heizung evtl. schlecht"],
["Kurzschluss in der Sensorleitung","Defekter Sensor","Wasser im Stecker","Korrodierte Kontakte","Kabelschaden","Massefehler","Falscher Sensor verbaut","Steuergerät-Eingang defekt (selten)"],
"medium",
["Sensor-Stecker auf Feuchtigkeit prüfen","Verkabelung kontrollieren","Kühlmittelstand prüfen","Fehlercode mit BMW-Diagnose auslesen","Sensorwiderstand messen (wenn möglich)"],
"Wenn der Lüfter nicht anspringt – Überhitzungsgefahr, besonders im Stau.",
[{q:"Warum ist das gefährlich?",a:"Das DME denkt, der Motor ist kalt, und aktiviert den Lüfter nicht – Überhitzungsgefahr."},{q:"Kann Feuchtigkeit die Ursache sein?",a:"Ja, Wasser im Stecker verursacht häufig Kurzschlüsse."},{q:"Was kostet die Reparatur?",a:"Sensor: 20 bis 60 Euro. Steckerreinigung: kostenlos."},{q:"Kann ich den Sensor selbst prüfen?",a:"Mit einem Multimeter den Widerstand bei bekannter Temperatur messen."},{q:"Tritt der Fehler saisonal auf?",a:"Feuchtigkeit im Herbst/Winter kann den Fehler begünstigen."},{q:"Ist der Fehler im Fehlerspeicher dauerhaft?",a:"Er bleibt gespeichert, bis er mit BMW-Diagnose gelöscht wird."}],
["2E81","2E83","2EF5","2EAE"]);

add("2E83","DME","Kühlmitteltemperatursensor, Signal zu hoch","Der ECT-Sensor meldet unrealistisch hohe Temperatur.","Meist ein Kabelbruch oder offener Stromkreis.",
["Lüfter läuft dauerhaft","Temperaturanzeige auf Maximum","Mageres Gemisch möglich","Leistungsbegrenzung möglich","Kaltstartprobleme"],
["Kabelbruch","Loser Stecker","Korrodierte Pins","Defekter Sensor","Oxidierte Kontakte","Beschädigter Kabelbaum","Massefehler","Steuergerätfehler (selten)"],
"medium",
["Sensor-Stecker auf festen Sitz prüfen","Kabel auf Brüche kontrollieren","Kontakte reinigen","Kühlmittelstand prüfen","Fehler löschen und beobachten"],
"Wenn Leistungsbegrenzung aktiv ist oder Kaltstartprobleme auftreten.",
[{q:"Warum läuft der Lüfter ständig?",a:"Das DME denkt, der Motor überhitzt, und lässt den Lüfter dauerlaufen."},{q:"Ist das schädlich?",a:"Der Dauerlauf selbst nicht, aber das Gemisch ist nicht optimal."},{q:"Kann ein loser Stecker die Ursache sein?",a:"Ja, ein offener Stromkreis zeigt typischerweise Hochsignal."},{q:"Was kostet die Diagnose bei BMW?",a:"Eine Fehlerdiagnose kostet beim BMW-Händler 80 bis 150 Euro."},{q:"Kann ich das selbst reparieren?",a:"Stecker prüfen ja. Für Kabelbaum-Reparatur besser in die Werkstatt."},{q:"Hängt der Fehler mit 2E82 zusammen?",a:"Beide betreffen den gleichen Sensor, aber mit umgekehrtem Problem."}],
["2E81","2E82","2EF5","2EAE"]);

add("2EAE","DME","Elektrische Kühlmittelpumpe, Ansteuerung","Die elektrische Wasserpumpe wird nicht korrekt angesteuert.","BMW verwendet seit der N52-Motorenreihe elektrische Wasserpumpen. Fehler 2EAE zeigt, dass die Pumpe nicht auf die Steuersignale des DME reagiert.",
["Motorkontrollleuchte leuchtet","Motor überhitzt","Warnmeldung im Display: Motortemperatur","Leistungsreduzierung","Kühlmittelwarnung"],
["Elektrische Wasserpumpe defekt (häufig!)","Verkabelung beschädigt","Sicherung durchgebrannt","Pumpenlaufrad gebrochen","Korrodierter Stecker","Pumpenmotor verschlissen","Steuergerätfehler (selten)","Kühlmittelverlust führt zu Trockenlauf"],
"high",
["Sofort Motortemperatur beobachten","Motor abstellen bei Überhitzungswarnung","Kühlmittelstand prüfen","Auf Geräusche der Pumpe achten (läuft sie?)","Fehlercode mit BMW-Diagnose auslesen"],
"Sofort bei Überhitzungswarnung. Die elektrische Wasserpumpe ist ein bekanntes Verschleißteil bei BMW.",
[{q:"Ist die Wasserpumpe ein häufiges Problem?",a:"Ja, besonders bei N51, N52, N54, N55 Motoren. Lebensdauer oft nur 80.000 bis 120.000 km."},{q:"Was kostet eine neue Pumpe?",a:"Originalteil: 400 bis 800 Euro. Aftermarket: 200 bis 400 Euro. Plus 200 bis 400 Euro Einbau."},{q:"Kann der Motor Schaden nehmen?",a:"Ja, Überhitzung kann Kopfdichtung, Zylinderkopf und Motor schwer beschädigen."},{q:"Kann ich noch fahren?",a:"Nur wenn der Motor nicht überhitzt. Bei Warnmeldung sofort anhalten."},{q:"Gibt es Vorzeichen?",a:"Manchmal hört man ein ungewöhnliches Summen, oder die Pumpe wird laut."},{q:"Kann ich die Pumpe selbst tauschen?",a:"Technisch anspruchsvoll – Kühlsystem muss entlüftet werden."}],
["2EF5","2E81","2E82","2E83"]);

add("2A70","DME","Drosselklappensteller, Ansteuerung","Der elektronische Drosselklappensteller wird nicht korrekt angesteuert.","Die E-Gas Drosselklappe reagiert nicht auf die Steuersignale des DME.",
["Notlauf (reduzierte Leistung)","Motorkontrollleuchte leuchtet","Schlechte Gasannahme","Motor stirbt ab","Warnmeldung im Display"],
["Defekter Drosselklappensteller","Verschmutzte Drosselklappe","Verkabelungsproblem","Korrodierter Stecker","Defekter Drosselklappen-Positionssensor","Steuergerätfehler (selten)","Falsches Ersatzteil","Sicherung defekt"],
"high",
["Drosselklappe sichtprüfen – Verschmutzung?","Stecker auf festen Sitz prüfen","Sicherung kontrollieren","Fehlercode auslesen und Freeze-Frame prüfen","Motor neu starten – Notlauf ggf. temporär"],
"Sofort, wenn der Motor im Notlauf ist. Die Drosselklappenreinigung kann helfen, der Steller muss oft angelernt werden.",
[{q:"Was ist der Notlauf?",a:"Der Motor begrenzt Leistung und Drehzahl als Schutzmaßnahme."},{q:"Kann ich die Drosselklappe reinigen?",a:"Ja, mit Drosselklappenreiniger. Danach muss sie mit ISTA/Diagnosegerät angelernt werden."},{q:"Was kostet ein neuer Steller?",a:"200 bis 600 Euro je nach Motor."},{q:"Ist der Notlauf gefährlich?",a:"Nicht direkt, aber die Fahrbarkeit ist stark eingeschränkt."},{q:"Muss die Drosselklappe nach Reinigung angelernt werden?",a:"Ja, zwingend – sonst funktioniert der Leerlauf nicht korrekt."},{q:"Betrifft das alle BMW-Motoren?",a:"Ja, alle modernen BMW mit E-Gas Drosselklappe."}],
["2A7A","2A69","2A6C","2A6F"]);

add("2A7A","DME","Ladedruckregelung, Ladedruck zu niedrig","Der Turbolader erreicht nicht den geforderten Ladedruck.","Das DME erkennt, dass trotz Ansteuerung des Ladedruckreglers der Sollwert nicht erreicht wird.",
["Deutlicher Leistungsverlust","Motorkontrollleuchte leuchtet","Boost-Druck bleibt niedrig","Warnmeldung möglich","Pfeifgeräusche vom Turbo möglich"],
["Undichter Ladeluftschlauch (häufig bei BMW!)","Defektes Wastegate","Ladedruckregler defekt","Turbolader verschlissen","Undichte Ladeluftkühler","Unterdruckleitung gerissen","Ladedrucksensor defekt","Verstopfter Luftfilter"],
"medium",
["Ladeluftschläuche auf Risse und lose Schellen prüfen","Auf Pfeif- oder Zischgeräusche unter Last achten","Luftfilter kontrollieren","Ladeluftschlauch-Verbindungen prüfen","Fehlercode auslesen und Ladedruck-Istwert beobachten"],
"Wenn der Leistungsverlust deutlich spürbar ist. Ladeluftschläuche sind ein häufiges BMW-Problem.",
[{q:"Sind undichte Ladeluftschläuche häufig?",a:"Ja, besonders bei N54 und N55 Motoren ein bekanntes Problem."},{q:"Was kostet ein Ladeluftschlauch?",a:"30 bis 120 Euro. Verstärkte Silikon-Varianten sind langlebiger."},{q:"Kann der Turbo defekt sein?",a:"Möglich, aber erst die günstigeren Ursachen (Schläuche, Leitungen) prüfen."},{q:"Wie erkenne ich ein undichtes Rohr?",a:"Unter Volllast ein Zischen oder Pfeifen – die Werkstatt nutzt eine Rauchmaschine."},{q:"Was kostet ein neuer Turbo?",a:"1.500 bis 3.000 Euro inklusive Einbau."},{q:"Kann ich den Fehler ignorieren?",a:"Fahren ist möglich, aber mit weniger Leistung. Zeitnah prüfen."}],
["2A70","2A69","2A6C","2A6F"]);

add("2A69","DME","Vanos Einlass, Abweichung","Die variable Ventilsteuerung (VANOS) Einlass zeigt eine Abweichung.","Die VANOS-Verstellung weicht von der Sollposition ab. Das kann an verschlissenem Öl, defekten Magnetventilen oder der VANOS-Einheit selbst liegen.",
["Motorkontrollleuchte leuchtet","Rauer Leerlauf","Leistungsverlust im unteren Drehzahlbereich","Klapperndes Geräusch bei Kaltstart","Erhöhter Verbrauch"],
["Vanos-Magnetventil defekt oder verschmutzt","Öldruckproblem (zu wenig oder altes Öl)","Vanos-Einheit verschlissen","Steuerkette gelängt","Verschlissene Dichtungen","Verkabelungsproblem","Nockenwellensensor defekt","Ölfilter verstopft"],
"medium",
["Ölstand und -alter prüfen – wann war der letzte Wechsel?","Auf Klapper- oder Rasselgeräusche beim Kaltstart achten","Fehlercode auslesen und Vanos-Stellwerte beobachten","Ölfiltergehäuse auf Undichtigkeit prüfen","Motorgeräusche im Leerlauf beobachten"],
"Wenn Rasselgeräusche auftreten oder der Fehler nach einem Ölwechsel nicht verschwindet.",
[{q:"Kann frisches Öl das Problem lösen?",a:"Manchmal ja – altes, dickes Öl kann die Vanos-Magnetventile beeinträchtigen."},{q:"Was ist das Vanos-Rasseln?",a:"Ein typisches Klappern beim Kaltstart, besonders bei N51/N52/N54/N55 Motoren."},{q:"Was kosten neue Magnetventile?",a:"30 bis 100 Euro pro Stück – es gibt 2 bis 4 Stück je nach Motor."},{q:"Ist eine Vanos-Reparatur teuer?",a:"Magnetventile: günstig. Vanos-Einheit: 500 bis 1.500 Euro."},{q:"Kann eine gelängte Steuerkette die Ursache sein?",a:"Ja, besonders bei N47 und N20 Motoren ein bekanntes Problem."},{q:"Hilft häufigerer Ölwechsel?",a:"Ja, kurze Ölwechselintervalle (max. 15.000 km) halten die Vanos gesund."}],
["2A6C","2A6F","2A70","2A7A"]);

add("2A6C","DME","Vanos Einlass, Stellzeit zu lang","Die Einlass-Vanos braucht zu lange, um die Sollposition zu erreichen.","Das DME erwartet, dass die Nockenwelle innerhalb einer bestimmten Zeit die neue Position erreicht. Dauert es zu lange, wird 2A6C gesetzt.",
["Motorkontrollleuchte leuchtet","Ruckeln im unteren Drehzahlbereich","Leistungsverlust","Geräusche beim Kaltstart","Schlechte Gasannahme"],
["Altes oder zu dickflüssiges Öl","Defektes Vanos-Magnetventil","Verschlissene Vanos-Einheit","Niedriger Öldruck","Verstopfter Ölkanal","Steuerkette gelängt","Nockenwellenversteller verschlissen","Verkabelungsproblem"],
"medium",
["Ölstand und Ölqualität prüfen","Ölwechsel-Intervall kontrollieren","Vanos-Magnetventile auf Verschmutzung prüfen","Motorgeräusche beobachten","Fehlercode auslesen und Stellzeiten mit BMW-Diagnose prüfen"],
"Wenn ein Ölwechsel den Fehler nicht behebt oder Rasselgeräusche auftreten.",
[{q:"Hilft ein Ölwechsel?",a:"Oft ja – das ist der erste und günstigste Versuch."},{q:"Welches Öl ist richtig?",a:"Unbedingt die BMW-Freigabe beachten (meist LL-01 oder LL-04)."},{q:"Kann ich die Magnetventile reinigen?",a:"Ja, Ausbau und Reinigung mit Bremsenreiniger ist möglich."},{q:"Was ist die Steuerketten-Problematik?",a:"Bei einigen BMW-Motoren (N47, N20) längt sich die Kette und verursacht Vanos-Fehler."},{q:"Wie teuer ist eine Steuerketten-Reparatur?",a:"1.000 bis 3.000 Euro je nach Motor und Umfang."},{q:"Ist der Fehler kritisch?",a:"Mittlere Dringlichkeit – bei Rasselgeräuschen zeitnah handeln."}],
["2A69","2A6F","2A70","2A7A"]);

add("2A6F","DME","Vanos Auslass, Abweichung","Die Auslass-Vanos zeigt eine Positionsabweichung.","Wie 2A69, aber für die Auslassseite.",
["Motorkontrollleuchte leuchtet","Leistungsverlust","Unruhiger Leerlauf","Erhöhter Verbrauch","Klappern bei Kaltstart"],
["Vanos-Magnetventil Auslass defekt","Öldruckproblem","Vanos-Einheit verschlissen","Steuerkette gelängt","Dichtungen defekt","Ölqualität schlecht","Nockenwellensensor defekt","Verkabelungsproblem"],
"medium",
["Ölstand und -zustand prüfen","Vanos-Geräusche beobachten","Fehlercode auslesen","Ölwechsel durchführen","Magnetventil-Stecker prüfen"],
"Wenn der Fehler nach Ölwechsel bestehen bleibt.",
[{q:"Ist Auslass-Vanos genauso anfällig?",a:"Ja, die gleichen Ursachen wie bei der Einlassseite."},{q:"Muss ich beide Seiten reparieren?",a:"Nicht zwingend – nur die betroffene Seite."},{q:"Kann der Fehler beide Seiten gleichzeitig betreffen?",a:"Ja, wenn Öldruck oder Ölqualität die Ursache ist."},{q:"Was bringt ein Ölwechsel?",a:"Frisches, fließfähiges Öl verbessert die Vanos-Funktion oft deutlich."},{q:"Brauche ich BMW-Spezialöl?",a:"Ja, unbedingt die korrekte BMW-Freigabe verwenden."},{q:"Wann wird es teuer?",a:"Wenn die Vanos-Einheit selbst oder die Steuerkette getauscht werden muss."}],
["2A69","2A6C","2A70","2A7A"]);

add("29D0","DME","Gemischregelung, Gemisch zu mager","Das Kraftstoffgemisch ist dauerhaft zu mager.","Das BMW-Pendant zu P0171 – die Langzeit-Kraftstofftrimmung liegt dauerhaft über dem Normbereich.",
["Motorkontrollleuchte leuchtet","Ruckeln beim Beschleunigen","Unruhiger Leerlauf","Erhöhter Verbrauch","Motorstottern"],
["Falschluft (CCV-Ventil, Ansaugdichtungen)","Defekter LMM","DISA-Klappe undicht","Schwache Kraftstoffpumpe","Verstopfte Einspritzdüsen","Lambda-Sonde defekt","Undichter Ansaugkrümmer","PCV/CCV-System undicht"],
"medium",
["CCV-Membran/Ölabscheider prüfen (häufige BMW-Ursache!)","Ansaugschläuche auf Risse kontrollieren","LMM-Stecker prüfen","Auf Zisch- oder Pfeifgeräusche achten","Fehlercode auslesen und Kraftstofftrimmung prüfen"],
"Wenn der Motor merklich ruckelt oder der Fehler sofort wiederkommt.",
[{q:"Was ist das CCV/Ölabscheider?",a:"Die Kurbelgehäuseentlüftung – ein häufiges Falschluft-Problem bei BMW."},{q:"Was kostet ein CCV-Tausch?",a:"Teil: 50 bis 150 Euro. Einbau: 100 bis 300 Euro."},{q:"Was ist die DISA-Klappe?",a:"Eine Umschaltklappe im Ansaugtrakt (N52) – die Metallklappe kann brechen."},{q:"Betrifft das alle BMW-Motoren?",a:"CCV-Probleme besonders bei N52, N54, N55. DISA bei N52."},{q:"Kann ein Falschluft-Leck den Motor schädigen?",a:"Langfristig ja, da magere Verbrennung zu höheren Temperaturen führt."},{q:"Wie finde ich die Falschluft?",a:"Werkstätten nutzen Rauchmaschinen. Häufige Stellen: CCV, Ansaugbrücke, Ventildeckel."}],
["29CD","29E0","2A69","2A70"]);

add("29CD","DME","Gemischregelung, Gemisch zu fett","Das Kraftstoffgemisch ist dauerhaft zu fett.","BMW-Pendant zu P0172 – zu viel Kraftstoff im Verhältnis zur Luft.",
["Motorkontrollleuchte leuchtet","Schwarzer Rauch","Erhöhter Verbrauch","Benzingeruch","Verrußte Zündkerzen"],
["Defekter LMM","Undichte Einspritzdüsen","Kraftstoffdruckregler defekt","Verstopfter Luftfilter","Lambda-Sonde defekt","Kühlmitteltemperatursensor fehlerhaft","EVAP-Spülventil klemmt","Hoher Kraftstoffdruck"],
"medium",
["Luftfilter prüfen","Auf Benzingeruch achten","LMM-Stecker kontrollieren","Ölstand prüfen – riecht es nach Benzin?","Zündkerzen optisch prüfen"],
"Bei schwarzem Rauch oder deutlichem Benzingeruch zeitnah in die Werkstatt.",
[{q:"Kann ein LMM-Defekt die Ursache sein?",a:"Ja, ein verschmutzter oder defekter LMM ist eine häufige Ursache."},{q:"Kann ich den LMM reinigen?",a:"Ja, mit speziellem LMM-Reiniger (nicht Bremsenreiniger!)."},{q:"Was kostet ein BMW-LMM?",a:"80 bis 250 Euro je nach Motor."},{q:"Schädigt fettes Gemisch den Kat?",a:"Ja, unverbrannter Kraftstoff kann den Kat überhitzen."},{q:"Kann das Öl verdünnt werden?",a:"Ja, Kraftstoff im Öl verdünnt den Schmierfilm – Ölstand steigt."},{q:"Ist der Fehler dringend?",a:"Bei schwarzem Rauch ja, sonst mittlere Dringlichkeit."}],
["29D0","29E0","2A69","2A70"]);

add("29E0","DME","Lambda-Regelung, Grenzwert überschritten Bank 1","Die Lambda-Regelung auf Bank 1 kann das Gemisch nicht mehr korrigieren.","Die Kraftstofftrimmung hat ihren maximalen Korrekturbereich erreicht.",
["Motorkontrollleuchte leuchtet","Ruckeln oder Stottern","Leistungsverlust","Erhöhter Verbrauch","Schlechter Leerlauf"],
["Massive Falschluft","Defekte Lambda-Sonde","Kraftstoffdruckproblem","Verstopfte Einspritzdüsen","Defekter LMM","CCV/Ölabscheider undicht","Ansaugbrücke undicht","Katalysator defekt"],
"high",
["CCV/Ölabscheider sichtprüfen","Ansaugschläuche kontrollieren","LMM-Stecker prüfen","Kraftstofftrimmung mit Diagnose beobachten","Weitere Fehlercodes prüfen (29D0, 29CD)"],
"Zeitnah, da das Steuergerät die Gemischregelung nicht mehr korrekt durchführen kann.",
[{q:"Ist das schlimmer als 29D0?",a:"Ja, 29E0 bedeutet, dass das Steuergerät am Limit der Korrekturmöglichkeit ist."},{q:"Tritt 29E0 oft mit 29D0 auf?",a:"Ja, häufig in Kombination."},{q:"Was sollte ich zuerst prüfen?",a:"CCV/Ölabscheider und Ansaugschläuche – die häufigsten BMW-Ursachen."},{q:"Kann der Motor Schaden nehmen?",a:"Bei dauerhaft falschem Gemisch steigt der Verschleiß."},{q:"Was kostet die Diagnose?",a:"80 bis 150 Euro beim BMW-Spezialisten."},{q:"Wie schnell muss ich handeln?",a:"Innerhalb weniger Tage – besonders wenn der Motor merklich schlecht läuft."}],
["29D0","29CD","2A69","2A70"]);

// ═══════════════════════════════════════════════════════════════
// DDE – Digitale Diesel Elektronik
// ═══════════════════════════════════════════════════════════════

add("4810","DDE","Dieselpartikelfilter, Differenzdruck zu hoch","Der Differenzdruck über dem DPF ist zu hoch – der Filter ist zugesetzt.","Der DPF-Sensor misst den Druckunterschied vor und nach dem Partikelfilter. Ein zu hoher Wert deutet auf einen vollen oder verstopften Filter hin.",
["DPF-Warnleuchte leuchtet","Leistungsverlust","Erhöhter Verbrauch","Regeneration wird angefordert","Motor geht in Notlauf"],
["DPF voll/zugesetzt (Kurzstreckenverkehr)","Regeneration wurde zu oft abgebrochen","Defekter DPF-Differenzdrucksensor","Verstopfte Druckleitungen zum Sensor","DPF-Additiv leer (bei Fahrzeugen mit Additiv)","Defekte Injektoren (zu viel Ruß)","AGR-Ventil verkokt","Turbolader-Problem (Ölverbrauch)"],
"high",
["Fahrstil prüfen – viel Kurzstrecke?","DPF-Regeneration durch längere Autobahnfahrt ermöglichen","Druckleitungen zum DPF-Sensor sichtprüfen","Fehlercode auslesen und DPF-Beladung prüfen","Motoröl-Stand kontrollieren (steigt bei Regeneration)"],
"Sofort, wenn der Motor im Notlauf ist. Eine erzwungene Regeneration mit Diagnose-Software kann helfen.",
[{q:"Was ist eine DPF-Regeneration?",a:"Der Motor erhöht die Abgastemperatur, um den Ruß im Filter zu verbrennen."},{q:"Hilft Autobahnfahren?",a:"Ja, 30 Minuten bei 2.500+ U/min kann eine Regeneration auslösen."},{q:"Was kostet ein neuer DPF?",a:"1.000 bis 3.000 Euro. Reinigung: 300 bis 500 Euro."},{q:"Kann der DPF gereinigt werden?",a:"Ja, spezielle DPF-Reinigungsdienste können den Filter spülen."},{q:"Warum ist Kurzstrecke schlecht?",a:"Der DPF erreicht nicht die nötige Temperatur für die Regeneration."},{q:"Kann falsches Öl den DPF beschädigen?",a:"Ja, nur Low-SAPS Öl (BMW LL-04) verwenden."}],
["4811","4812","4813","480A"]);

add("4811","DDE","Dieselpartikelfilter, Regeneration nicht möglich","Die DPF-Regeneration kann nicht durchgeführt werden.","Das DDE hat versucht, eine Regeneration zu starten, aber die Bedingungen waren nicht erfüllt oder die Regeneration wurde abgebrochen.",
["DPF-Warnleuchte leuchtet","Leistungsreduzierung","Motor im Notlauf möglich","Erhöhter Verbrauch","Warnmeldung im Display"],
["DPF zu stark beladen","Kurzstreckenfahrten unterbrechen Regeneration","Defekter Abgastemperatursensor","Glühkerzen defekt (für Nachglühung)","Defekte Einspritzdüse für Nacheinspritzung","AGR-Problem","Turbolader-Defekt","Software-Problem"],
"high",
["Sofort eine längere Fahrt (Autobahn, 30+ min) unternehmen","Keine weiteren Kurzstrecken fahren","Fehlercode auslesen und DPF-Zustand prüfen","Ölstand kontrollieren","Warnmeldungen im Display beachten"],
"Wenn die Warnleuchte nach Autobahnfahrt nicht erlischt – die Werkstatt kann eine erzwungene Regeneration durchführen.",
[{q:"Was passiert, wenn ich nicht reagiere?",a:"Der DPF wird immer voller, bis der Motor in den Notlauf geht und eine Regeneration unmöglich wird."},{q:"Kann die Werkstatt eine Regeneration erzwingen?",a:"Ja, mit ISTA/Diagnose-Software – solange der DPF nicht komplett zugesetzt ist."},{q:"Wann muss der DPF getauscht werden?",a:"Wenn keine Regeneration mehr möglich ist oder der Filter physisch beschädigt ist."},{q:"Kann ich DPF-Reiniger-Additiv verwenden?",a:"Es gibt Additive, aber deren Wirksamkeit ist umstritten."},{q:"Schadet ständiger Kurzstreckenverkehr?",a:"Ja, Diesel-Fahrzeuge brauchen regelmäßig längere Fahrten für die DPF-Regeneration."},{q:"Was kostet eine erzwungene Regeneration?",a:"50 bis 150 Euro in der Werkstatt."}],
["4810","4812","4813","480A"]);

add("480A","DDE","AGR-Ventil, Ansteuerung","Das AGR-Ventil des Dieselmotors wird nicht korrekt angesteuert.","BMW-Diesel haben häufig Probleme mit verkokten AGR-Ventilen. 480A zeigt ein elektrisches oder mechanisches Problem.",
["Motorkontrollleuchte leuchtet","Leistungsverlust","Ruckeln unter Last","Schwarzer Rauch","Motor geht ggf. in Notlauf"],
["AGR-Ventil verkokt (sehr häufig bei Diesel!)","Defekter AGR-Stellmotor","Verkabelungsproblem","AGR-Kühler verstopft","Ansaugrohr verkokt","Korrodierter Stecker","Defekter AGR-Positionssensor","Steuergerätfehler (selten)"],
"medium",
["AGR-Ventil sichtprüfen (wenn zugänglich)","Auf schwarzen Rauch achten","Steckverbindung am AGR-Ventil prüfen","Fehlercode auslesen und AGR-Position prüfen","Motorraum auf Rußspuren untersuchen"],
"Wenn Leistungsverlust oder Notlauf auftreten. AGR-Reinigung oder -Tausch ist ein häufiger Diesel-Service.",
[{q:"Wie oft verkokt das AGR-Ventil?",a:"Bei BMW-Dieseln (N47, B47) ein häufiges Problem, oft alle 60.000 bis 100.000 km."},{q:"Kann ich das AGR-Ventil reinigen?",a:"Manchmal – Ausbau und manuelle Reinigung. Bei starker Verkokung muss es getauscht werden."},{q:"Was kostet ein neues AGR-Ventil?",a:"200 bis 500 Euro plus Einbau."},{q:"Darf ich das AGR-Ventil stilllegen?",a:"Nein, das ist illegal und führt zum Erlöschen der Betriebserlaubnis."},{q:"Kann ein verstopftes AGR den DPF belasten?",a:"Ja, mehr Ruß durch schlechte Verbrennung belastet den DPF zusätzlich."},{q:"Gibt es vorbeugende Maßnahmen?",a:"Regelmäßige Autobahnfahrten und kurze Ölwechselintervalle helfen."}],
["4810","4811","4812","4813"]);

// ═══════════════════════════════════════════════════════════════
// ACSM / MRS – Airbag/Rückhaltesystem
// ═══════════════════════════════════════════════════════════════

add("93B2","ACSM","Sicherheitsbatterieklemme, Auslösekreis","Der Auslösekreis der Sicherheitsbatterieklemme (SBK) hat ein Problem.","Die SBK trennt bei einem Unfall die Batterie vom Bordnetz. 93B2 zeigt, dass der Auslösekreis nicht korrekt funktioniert.",
["Airbag-Warnleuchte leuchtet","SRS-Warnung im Display","Keine spürbaren Fahrprobleme","Airbag-System möglicherweise eingeschränkt","TÜV-relevant"],
["Defekte Sicherheitsbatterieklemme","Korrodierter Stecker an der Batterie","Verkabelungsproblem","Batterie gewechselt ohne Codierung","Kabelbaum beschädigt","Oxidierte Kontakte","Steuergerätfehler (selten)","Nachrüstung ohne korrekte Codierung"],
"high",
["Batteriepole auf festen Sitz und Korrosion prüfen","SBK-Stecker an der Batterie kontrollieren","Prüfen, ob kürzlich die Batterie gewechselt wurde","Kabel auf sichtbare Schäden prüfen","Fehler mit BMW-Diagnose auslesen – ACSM-Fehler nur mit BMW-Software löschbar"],
"Zeitnah, da das Airbag-System beeinträchtigt sein kann. ACSM-Fehler sind TÜV-relevant.",
[{q:"Ist mein Airbag noch funktionsfähig?",a:"Möglicherweise eingeschränkt – die Airbag-Leuchte zeigt eine Störung im Rückhaltesystem an."},{q:"Kann ein Batteriewechsel den Fehler auslösen?",a:"Ja, die neue Batterie muss bei BMW oft registriert werden."},{q:"Kann ich den Fehler selbst löschen?",a:"ACSM-Fehler können nur mit BMW-Diagnose (ISTA, Rheingold, Bimmerlink) gelöscht werden."},{q:"Ist der Fehler TÜV-relevant?",a:"Ja, eine leuchtende Airbag-Warnleuchte führt zum Nichtbestehen."},{q:"Was ist die Sicherheitsbatterieklemme?",a:"Ein pyrotechnisches Element, das bei einem Unfall die Batterie-Masseverbindung trennt."},{q:"Was kostet eine neue SBK?",a:"50 bis 150 Euro plus Einbau und Codierung."}],
["9381","9382","93A1","93A2"]);

add("9381","ACSM","Fahrer-Airbag, Auslösekreis","Der Auslösekreis des Fahrer-Airbags zeigt eine Störung.","Das ACSM erkennt ein Problem im Schaltkreis des Fahrer-Airbags im Lenkrad.",
["Airbag-Warnleuchte leuchtet","SRS-Warnung im Display","Airbag-System eingeschränkt","TÜV-relevant","Keine Fahrprobleme"],
["Wickelfeder (Schleifring) im Lenkrad defekt","Airbag-Stecker nicht korrekt verbunden","Kabelbruch im Lenkrad","Airbag-Modul defekt","Korrodierter Stecker","Lenkrad-Arbeiten ohne korrekte Sicherung","Steuergerätfehler (selten)","Nachrüst-Lenkrad ohne Codierung"],
"high",
["Prüfen, ob kürzlich am Lenkrad gearbeitet wurde","Airbag-Warnleuchte nicht ignorieren","Fehler mit BMW-Diagnose auslesen","NICHT am Airbag-System selbst arbeiten","Werkstatt aufsuchen"],
"Sofort – der Fahrer-Airbag ist ein sicherheitskritisches System. Niemals selbst am Airbag arbeiten.",
[{q:"Ist mein Airbag noch aktiv?",a:"Möglicherweise nicht – bei leuchtender Warnleuchte kann der Airbag im Ernstfall nicht auslösen."},{q:"Was ist die Wickelfeder?",a:"Ein Spiralkabel im Lenkrad, das die elektrische Verbindung bei Lenkbewegungen herstellt."},{q:"Kann ich den Fehler selbst reparieren?",a:"Nein, Arbeiten am Airbag-System sind gefährlich und gehören in die Werkstatt."},{q:"Was kostet eine Wickelfeder?",a:"80 bis 250 Euro plus Einbau."},{q:"Ist der Fehler TÜV-relevant?",a:"Ja, zwingend – leuchtende Airbag-Leuchte = TÜV nicht bestanden."},{q:"Kann der Fehler nach Lenkrad-Tausch auftreten?",a:"Ja, wenn der Stecker nicht korrekt verbunden oder die Codierung fehlt."}],
["93B2","9382","93A1","93A2"]);

// ═══════════════════════════════════════════════════════════════
// EGS – Elektronische Getriebesteuerung
// ═══════════════════════════════════════════════════════════════

add("5088","EGS","Getriebe, Übersetzungsverhältnis nicht plausibel","Das tatsächliche Übersetzungsverhältnis weicht vom Sollwert ab.","Das EGS erkennt, dass die Getriebe-Ein- und Ausgangsdrehzahlen nicht zum eingelegten Gang passen.",
["Getriebenotlauf","Warnmeldung im Display","Harte Schaltvorgänge","Leistungsreduzierung","Getriebeöl-Warnung möglich"],
["Getriebeölstand zu niedrig","Verschlissene Kupplungslamellen","Defekter Drehmomentwandler","Magnetventil im Getriebe defekt","Getriebeöl verschmutzt oder überaltert","Mechatronik-Einheit defekt","Drehzahlsensor defekt","Software-Problem"],
"high",
["Getriebeölstand und -zustand prüfen (wenn möglich)","Warnmeldungen im Display notieren","Fahrverhalten beobachten: welcher Gang betroffen?","Fehlercode auslesen mit BMW-Diagnose","NICHT weiterfahren bei schwerem Getriebenotlauf"],
"Sofort bei Getriebenotlauf. Weiterfahren kann das Getriebe schwer beschädigen.",
[{q:"Was ist der Getriebenotlauf?",a:"Das Getriebe schaltet in einen Notgang mit stark eingeschränkter Funktion."},{q:"Kann zu wenig Getriebeöl die Ursache sein?",a:"Ja, besonders bei BMW-Automatikgetrieben mit Mechatronik."},{q:"Was kostet eine Getriebe-Reparatur?",a:"Ölwechsel: 200 bis 400 Euro. Mechatronik: 1.500 bis 3.000 Euro. Getriebe-Überholung: 3.000+."},{q:"Wie oft muss das Getriebeöl gewechselt werden?",a:"BMW sagt 'lebenslang', Experten empfehlen alle 60.000 bis 80.000 km."},{q:"Was ist die Mechatronik?",a:"Die elektronisch-hydraulische Steuereinheit im Getriebe."},{q:"Kann ich noch fahren?",a:"Im Notlauf nur zur Werkstatt. Bei harten Schaltstößen ebenfalls zeitnah."}],
["5089","508A","508B","5098"]);

add("5089","EGS","Drehmomentwandler-Schlupf zu hoch","Der Drehmomentwandler hat zu viel Schlupf.","Die Wandlerüberbrückung greift nicht korrekt – zu viel Drehzahldifferenz zwischen Motor und Getriebe.",
["Erhöhter Verbrauch","Getriebeöl wird heiß","Schleifgeräusche möglich","Vibrationen","Leistungsverlust"],
["Wandler-Überbrückungskupplung verschlissen","Getriebeöl verschmutzt","Magnetventil für Wandlerkupplung defekt","Zu niedriger Getriebeöldruck","Mechatronik-Problem","Wandler-Turbinenrad verschlissen","Drehmomentwandler-Dichtung undicht","Steuergerätfehler"],
"medium",
["Getriebeölstand prüfen","Auf ungewöhnliche Vibrationen achten","Getriebeöltemperatur beobachten (mit Diagnose)","Fehlercode auslesen","Fahrverhalten dokumentieren"],
"Wenn Vibrationen oder Wärme-Warnungen auftreten.",
[{q:"Was ist Wandlerschlupf?",a:"Die Drehzahldifferenz zwischen Pumprad (Motor) und Turbinenrad (Getriebe) im Wandler."},{q:"Ist das reparabel?",a:"Manchmal reicht ein Getriebeöl-Wechsel. Sonst muss der Wandler getauscht werden."},{q:"Was kostet ein neuer Wandler?",a:"800 bis 2.000 Euro plus Ausbau des Getriebes."},{q:"Kann ein Ölwechsel helfen?",a:"Ja, verschmutztes Öl beeinträchtigt die Wandlerkupplung."},{q:"Ist Weiterfahren möglich?",a:"Kurzfristig ja, aber das Getriebe wird stärker belastet."},{q:"Wie erkenne ich das Problem?",a:"Motor dreht höher als erwartet, ohne dass das Auto entsprechend beschleunigt."}],
["5088","508A","508B","5098"]);

// ═══════════════════════════════════════════════════════════════
// DSC – Dynamische Stabilitätskontrolle
// ═══════════════════════════════════════════════════════════════

add("5E20","DSC","Raddrehzahlsensor vorne links, Signal","Der Raddrehzahlsensor vorne links liefert kein oder ein fehlerhaftes Signal.","Der DSC braucht die Drehzahlen aller vier Räder. Fällt ein Sensor aus, werden DSC und ABS deaktiviert.",
["DSC-Warnleuchte leuchtet","ABS-Warnleuchte leuchtet","DSC/ABS deaktiviert","Traktionskontrolle aus","Tacho zeigt ggf. falsch"],
["Raddrehzahlsensor defekt","Sensorring (Encoder) beschädigt","Kabelbruch am Sensor","Radlager defekt (integrierter Encoder)","Korrodierter Stecker","Sensor verschmutzt","Kabelbaum am Radkasten beschädigt","ABS-Steuergerät defekt (selten)"],
"high",
["Raddrehzahlsensor vorne links lokalisieren","Sensor und Kabel auf sichtbare Schäden prüfen","Stecker auf Korrosion kontrollieren","Sensorring am Antriebswellen-Gelenk auf Beschädigung prüfen","Fehlercode auslesen und Sensorsignale vergleichen"],
"Zeitnah, da ABS und DSC nicht funktionieren. Besonders bei schlechtem Wetter gefährlich.",
[{q:"Kann ich ohne ABS/DSC fahren?",a:"Technisch ja, aber bei Notbremsungen und auf glattem Untergrund fehlt die Unterstützung."},{q:"Was kostet ein neuer Sensor?",a:"30 bis 100 Euro plus Einbau."},{q:"Kann das Radlager schuld sein?",a:"Ja, bei integrierten Encodern ist ein defektes Lager eine häufige Ursache."},{q:"Wie erkenne ich den Encoder?",a:"Ein Magnetring auf der Antriebswelle oder im Radlager – sichtbar bei ausgebautem Sensor."},{q:"Ist der Fehler TÜV-relevant?",a:"Ja, DSC/ABS-Fehler führen zum Nichtbestehen."},{q:"Betrifft das nur vorne links?",a:"Es gibt einen Sensor pro Rad – hier ist spezifisch vorne links betroffen."}],
["5E21","5E22","5E23","5E10"]);

add("5E21","DSC","Raddrehzahlsensor vorne rechts, Signal","Der Raddrehzahlsensor vorne rechts liefert kein oder fehlerhaftes Signal.","Wie 5E20, aber für das Rad vorne rechts.",
["DSC-Warnleuchte leuchtet","ABS-Warnleuchte leuchtet","DSC/ABS deaktiviert","Traktionskontrolle aus","Tacho zeigt ggf. falsch"],
["Raddrehzahlsensor defekt","Sensorring beschädigt","Kabelbruch","Radlager defekt","Korrodierter Stecker","Verschmutzung","Kabelbaum beschädigt","ABS-Steuergerät (selten)"],
"high",
["Sensor vorne rechts und Kabel prüfen","Stecker kontrollieren","Sensorring prüfen","Radlager auf Spiel prüfen","Fehlercode auslesen"],
"Zeitnah, da ABS und DSC deaktiviert sind.",
[{q:"Kann der Sensor vom Steinschlag beschädigt werden?",a:"Ja, der Sensor sitzt exponiert am Radträger."},{q:"Kann Rost den Sensor beschädigen?",a:"Ja, besonders der Encoder kann korrodieren."},{q:"Was kostet die Reparatur?",a:"Sensor: 30 bis 100 Euro. Bei Radlager: 200 bis 500 Euro."},{q:"Muss ich alle 4 Sensoren tauschen?",a:"Nein, nur den betroffenen."},{q:"Kann ich den Sensor selbst wechseln?",a:"Bei guter Zugänglichkeit ja – manchmal sitzt er fest und muss vorsichtig gelöst werden."},{q:"Ist ABS bei Regen wichtig?",a:"Ja, ABS verhindert das Blockieren der Räder bei Vollbremsungen."}],
["5E20","5E22","5E23","5E10"]);

add("5E22","DSC","Raddrehzahlsensor hinten links, Signal","Der Raddrehzahlsensor hinten links liefert kein oder fehlerhaftes Signal.","Wie 5E20, für hinten links.",
["DSC-Warnleuchte leuchtet","ABS-Warnleuchte leuchtet","DSC/ABS deaktiviert","Traktionskontrolle aus","Stabilitätskontrolle fehlt"],
["Raddrehzahlsensor defekt","Sensorring beschädigt","Kabelbruch","Radlager defekt","Korrodierter Stecker","Verschmutzung","Kabelbaum beschädigt","ABS-Steuergerät (selten)"],
"high",
["Sensor hinten links und Kabel prüfen","Stecker kontrollieren","Sensorring prüfen","Radlager auf Spiel prüfen","Fehlercode auslesen"],
"Zeitnah, da ABS und DSC deaktiviert sind.",
[{q:"Ist der hintere Sensor anders als vorne?",a:"Oft baugleich, aber Teilenummer prüfen."},{q:"Kann ein neues Radlager nötig sein?",a:"Ja, wenn der Encoder im Lager integriert ist."},{q:"Wie oft gehen Sensoren kaputt?",a:"Sie können durch Verschleiß, Korrosion oder mechanische Beschädigung ausfallen."},{q:"Was passiert ohne DSC im Winter?",a:"Das Fahrzeug ist bei Glätte deutlich schwerer zu kontrollieren."},{q:"Muss der Fehler für TÜV behoben werden?",a:"Ja, zwingend."},{q:"Kann ich ABS manuell aktivieren?",a:"Nein, bei defektem Sensor wird ABS automatisch deaktiviert."}],
["5E20","5E21","5E23","5E10"]);

add("5E23","DSC","Raddrehzahlsensor hinten rechts, Signal","Der Raddrehzahlsensor hinten rechts liefert kein oder fehlerhaftes Signal.","Wie 5E20, für hinten rechts.",
["DSC-Warnleuchte leuchtet","ABS-Warnleuchte leuchtet","DSC/ABS deaktiviert","Traktionskontrolle aus","Stabilitätskontrolle fehlt"],
["Raddrehzahlsensor defekt","Sensorring beschädigt","Kabelbruch","Radlager defekt","Korrodierter Stecker","Verschmutzung","Kabelbaum beschädigt","ABS-Steuergerät (selten)"],
"high",
["Sensor hinten rechts und Kabel prüfen","Stecker kontrollieren","Sensorring prüfen","Radlager auf Spiel prüfen","Fehlercode auslesen"],
"Zeitnah, da ABS und DSC deaktiviert sind.",
[{q:"Kann ich den Sensor an der Hinterachse erreichen?",a:"Meist ja – er sitzt am Radträger und ist von unten zugänglich."},{q:"Brauche ich Spezialwerkzeug?",a:"Manchmal einen Torx oder Innensechskant – kein Spezialwerkzeug."},{q:"Kann ein ABS-Ring brechen?",a:"Ja, besonders die Kunststoff-Varianten bei neueren Modellen."},{q:"Sind Aftermarket-Sensoren ok?",a:"Qualitätsmarken wie Bosch oder Continental funktionieren gut."},{q:"Was kostet die Reparatur insgesamt?",a:"Sensor: 30 bis 100 Euro. Mit Radlager: 200 bis 500 Euro."},{q:"Wie schnell muss ich handeln?",a:"Zeitnah – ohne ABS/DSC steigt das Unfallrisiko."}],
["5E20","5E21","5E22","5E10"]);

add("5E10","DSC","DSC-Steuergerät, interne Fehlfunktion","Das DSC-Steuergerät hat einen internen Fehler erkannt.","Ein internes Problem im DSC/ABS-Steuergerät – kann Hardware oder Software betreffen.",
["DSC-Warnleuchte leuchtet","ABS-Warnleuchte leuchtet","Alle Stabilitätsfunktionen deaktiviert","Warnmeldung im Display","Bremskraftverstärkung ggf. eingeschränkt"],
["Defektes DSC-Steuergerät","Spannungsproblem (schwache Batterie)","Wasserschaden am Steuergerät","Korrodierte Anschlüsse","Software-Fehler","Defekte ABS-Pumpe","Interne Elektronik-Defekt","Überspannungsschaden"],
"high",
["Batteriespannung prüfen","DSC-Steuergerät auf Feuchtigkeit prüfen","Stecker am Steuergerät kontrollieren","Fehlercode auslesen – ist es ein einmaliger oder dauerhafter Fehler?","Fehler löschen und prüfen, ob er wiederkommt"],
"Sofort, da alle Stabilitätsfunktionen betroffen sind. Ein DSC-Steuergerät-Defekt ist eine aufwändige Reparatur.",
[{q:"Kann eine schwache Batterie den Fehler auslösen?",a:"Ja, Spannungseinbrüche können temporäre Steuergerät-Fehler verursachen."},{q:"Was kostet ein neues DSC-Steuergerät?",a:"1.000 bis 2.500 Euro – es gibt auch Instandsetzungs-Dienste (300 bis 600 Euro)."},{q:"Kann das Steuergerät repariert werden?",a:"Ja, spezialisierte Firmen bieten Platinen-Reparatur an."},{q:"Ist ein Software-Update möglich?",a:"Manchmal ja, beim BMW-Händler."},{q:"Ist der Fehler TÜV-relevant?",a:"Ja, unbedingt."},{q:"Kann Wasser ins Steuergerät gelangen?",a:"Ja, besonders bei E90/E60 ist das Steuergerät anfällig für Wassereintritt."}],
["5E20","5E21","5E22","5E23"]);

// ═══════════════════════════════════════════════════════════════
// FRM – Fussraummodul (Lighting/Body)
// ═══════════════════════════════════════════════════════════════

add("A0B2","FRM","Abblendlicht links, Kurzschluss oder offener Stromkreis","Das Abblendlicht links hat ein elektrisches Problem.","Das FRM steuert die Beleuchtung. A0B2 zeigt, dass der Stromkreis des linken Abblendlichts gestört ist.",
["Abblendlicht links funktioniert nicht","Warnmeldung im Display","Lichtwarnleuchte leuchtet","TÜV-relevant","Sicherheitsrisiko bei Nacht"],
["Glühlampe durchgebrannt","Sicherung defekt","Kabelbruch zum Scheinwerfer","Korrodierter Lampensockel","Stecker am Scheinwerfer korrodiert","FRM-Ausgang defekt","Xenon-Vorschaltgerät defekt (bei Xenon)","Massefehler am Scheinwerfer"],
"high",
["Glühlampe prüfen – ist sie durchgebrannt?","Sicherung für Abblendlicht kontrollieren","Scheinwerfer-Stecker auf Korrosion prüfen","Lampensockel auf festen Sitz prüfen","Fehlercode auslesen"],
"Sofort, wenn das Abblendlicht nicht funktioniert – Sicherheitsrisiko und Bußgeld bei Nachtfahrt.",
[{q:"Ist es nur die Glühlampe?",a:"Häufig ja – das ist die einfachste und günstigste Ursache."},{q:"Kann das FRM defekt sein?",a:"Ja, das FRM (Fußraummodul) ist bei E90/E60/E87 ein bekanntes Problemteil."},{q:"Was kostet ein FRM?",a:"Neu: 400 bis 800 Euro. Reparatur: 150 bis 300 Euro."},{q:"Kann das FRM repariert werden?",a:"Ja, spezialisierte Firmen bieten FRM-Instandsetzung an."},{q:"Ist der Fehler TÜV-relevant?",a:"Ja, nicht funktionierendes Abblendlicht führt zum Nichtbestehen."},{q:"Kann Feuchtigkeit die Ursache sein?",a:"Ja, Wasser im Scheinwerfer korrodiert Kontakte."}],
["A0B3","A0B4","A0B5","A0A0"]);

add("A0B3","FRM","Abblendlicht rechts, Kurzschluss oder offener Stromkreis","Das Abblendlicht rechts hat ein elektrisches Problem.","Wie A0B2, aber für die rechte Seite.",
["Abblendlicht rechts funktioniert nicht","Warnmeldung im Display","Lichtwarnleuchte","TÜV-relevant","Sicherheitsrisiko"],
["Glühlampe durchgebrannt","Sicherung defekt","Kabelbruch","Korrodierter Sockel","Stecker korrodiert","FRM-Ausgang defekt","Xenon-Vorschaltgerät defekt","Massefehler"],
"high",
["Glühlampe prüfen","Sicherung kontrollieren","Stecker am Scheinwerfer prüfen","Lampensockel kontrollieren","Fehlercode auslesen"],
"Sofort, wenn das Licht nicht funktioniert.",
[{q:"Kann ich die Lampe selbst wechseln?",a:"Bei den meisten BMW-Modellen ja – Anleitung im Bordbuch."},{q:"Welche Lampe brauche ich?",a:"Das steht im Bordbuch oder auf der alten Lampe (H7, H1, D1S etc.)."},{q:"Gehen bei BMW oft Lampen kaputt?",a:"Nicht häufiger als bei anderen Marken."},{q:"Kann ich LED-Lampen nachrüsten?",a:"Nur mit E-Prüfzeichen und korrekter Zulassung."},{q:"Was, wenn die Sicherung immer wieder durchbrennt?",a:"Dann liegt ein Kurzschluss vor – Werkstatt aufsuchen."},{q:"Ist der Fehler nach Lampenwechsel weg?",a:"In der Regel ja. Wenn nicht, Stecker und FRM prüfen."}],
["A0B2","A0B4","A0B5","A0A0"]);

// ═══════════════════════════════════════════════════════════════
// CAS – Car Access System
// ═══════════════════════════════════════════════════════════════

add("A251","CAS","EWS-Abgleich, Schlüssel nicht angelernt","Ein Schlüssel ist nicht korrekt im CAS angelernt.","Das Car Access System erkennt den Schlüssel nicht als gültig. Der Motor startet nicht.",
["Motor startet nicht","EWS-Symbol im Display","Lenkradschloss aktiv","Startfreigabe fehlt","Schlüssel wird nicht erkannt"],
["Schlüsselbatterie leer","Schlüssel nicht angelernt/codiert","CAS-Modul defekt","Schlüssel-Transponder defekt","Antenne im Lenkrad defekt","Kodierung nach Batteriewechsel verloren","Schlüssel mechanisch beschädigt","CAS-Spannungsversorgung gestört"],
"high",
["Schlüsselbatterie wechseln","Ersatzschlüssel probieren","Batteriepole auf festen Sitz prüfen","Schlüssel direkt an die Lenksäule halten","BMW-Diagnose für CAS-Abgleich nötig"],
"Sofort, wenn der Motor nicht startet. Ein CAS-Abgleich erfordert BMW-Diagnose-Software.",
[{q:"Kann eine leere Schlüsselbatterie die Ursache sein?",a:"Ja, das ist die häufigste und einfachste Ursache."},{q:"Welche Batterie braucht der BMW-Schlüssel?",a:"Meist CR2032 oder CR2450 – steht im Bordbuch."},{q:"Muss der Schlüssel nach Batteriewechsel neu angelernt werden?",a:"Normalerweise nicht. Wenn doch, braucht es BMW-Diagnose."},{q:"Was kostet ein neuer BMW-Schlüssel?",a:"200 bis 400 Euro beim Händler inklusive Codierung."},{q:"Kann ich den CAS selbst reparieren?",a:"Nein, CAS-Arbeiten erfordern BMW-Diagnose und sind diebstahlrelevant."},{q:"Funktioniert der Notstart ohne Schlüsselerkennung?",a:"Bei manchen Modellen kann man den Schlüssel direkt an die Lenksäule halten."}],
["A252","A253","A254","A255"]);

// ═══════════════════════════════════════════════════════════════
// KOMBI – Kombiinstrument
// ═══════════════════════════════════════════════════════════════

add("9CA1","KOMBI","Verbrauchsanzeige, Plausibilitätsfehler","Die Verbrauchsanzeige im Kombiinstrument zeigt unplausible Werte.","Das Kombiinstrument empfängt widersprüchliche Daten für die Verbrauchsberechnung.",
["Verbrauchsanzeige zeigt falsch","Reichweitenanzeige ungenau","Keine Fahrprobleme","Nur Anzeigefehler","Kein sicherheitsrelevantes Problem"],
["Tankgeber defekt","CAN-Bus Kommunikationsfehler","Kombiinstrument-Software","Defekter Kraftstoffstandsensor","Verkabelungsproblem","Steuergerät sendet falsche Daten","Kombiinstrument defekt","Software-Update nötig"],
"low",
["Tankstand beobachten – stimmt die Tankanzeige?","Fehlercode auslesen","Prüfen, ob weitere Fehlercodes im KOMBI gespeichert sind","Verbrauch manuell berechnen (Tankfüllung/Kilometer)","Auf CAN-Bus-Fehler prüfen"],
"Wenn die Tankanzeige dauerhaft falsch anzeigt. Ein Software-Update kann helfen.",
[{q:"Ist der Fehler gefährlich?",a:"Nein, es ist nur ein Anzeigeproblem."},{q:"Kann ein Software-Update helfen?",a:"Ja, beim BMW-Händler."},{q:"Kann der Tankgeber defekt sein?",a:"Ja, das ist eine mögliche Ursache."},{q:"Was kostet ein neuer Tankgeber?",a:"100 bis 300 Euro plus Einbau."},{q:"Beeinflusst der Fehler den TÜV?",a:"Nein, solange keine Warnleuchten aktiv sind."},{q:"Wie berechne ich den Verbrauch manuell?",a:"Vollgetankt, Kilometerstand notieren, beim nächsten Tanken: Liter / gefahrene km × 100."}],
["9CA2","9CA3","9CB0","9CB1"]);

// ═══════════════════════════════════════════════════════════════
// Additional common codes across systems
// ═══════════════════════════════════════════════════════════════

const genericBMW = [
  ["9382","ACSM","Beifahrer-Airbag, Auslösekreis","Der Auslösekreis des Beifahrer-Airbags zeigt eine Störung.",["93B2","9381","93A1","93A2"]],
  ["93A1","ACSM","Seitenairbag links, Auslösekreis","Störung im Seitenairbag links.",["93B2","9381","9382","93A2"]],
  ["93A2","ACSM","Seitenairbag rechts, Auslösekreis","Störung im Seitenairbag rechts.",["93B2","9381","9382","93A1"]],
  ["93C5","ACSM","Gurtstraffer Fahrer, Auslösekreis","Störung im Gurtstraffer des Fahrers.",["93B2","9381","9382","93A1"]],
  ["508A","EGS","Getriebe, Schaltvorgang fehlerhaft","Ein Schaltvorgang konnte nicht korrekt durchgeführt werden.",["5088","5089","508B","5098"]],
  ["508B","EGS","Getriebeöl-Temperatur zu hoch","Die Temperatur des Getriebeöls überschreitet den zulässigen Bereich.",["5088","5089","508A","5098"]],
  ["5098","EGS","Wandlerüberbrückung, Fehlfunktion","Die Wandlerüberbrückung arbeitet nicht korrekt.",["5088","5089","508A","508B"]],
  ["4812","DDE","DPF Differenzdrucksensor, Signal nicht plausibel","Der Differenzdrucksensor liefert unplausible Werte.",["4810","4811","4813","480A"]],
  ["4813","DDE","Abgastemperatursensor vor DPF, Signal nicht plausibel","Der Temperatursensor vor dem DPF liefert falsche Werte.",["4810","4811","4812","480A"]],
  ["2C01","DME","Zündaussetzer Zylinder 1","Zündaussetzer in Zylinder 1 erkannt.",["2C02","2C03","2C04","2C00"]],
  ["2C02","DME","Zündaussetzer Zylinder 2","Zündaussetzer in Zylinder 2 erkannt.",["2C01","2C03","2C04","2C00"]],
  ["2C03","DME","Zündaussetzer Zylinder 3","Zündaussetzer in Zylinder 3 erkannt.",["2C01","2C02","2C04","2C00"]],
  ["2C04","DME","Zündaussetzer Zylinder 4","Zündaussetzer in Zylinder 4 erkannt.",["2C01","2C02","2C03","2C00"]],
  ["2C00","DME","Zündaussetzer, mehrere Zylinder","Zündaussetzer in mehreren Zylindern erkannt.",["2C01","2C02","2C03","2C04"]],
  ["2C05","DME","Zündaussetzer Zylinder 5","Zündaussetzer in Zylinder 5 erkannt.",["2C00","2C01","2C02","2C06"]],
  ["2C06","DME","Zündaussetzer Zylinder 6","Zündaussetzer in Zylinder 6 erkannt.",["2C00","2C01","2C05","2C04"]],
  ["A0B4","FRM","Rücklicht links, Fehlfunktion","Rücklicht links hat ein elektrisches Problem.",["A0B2","A0B3","A0B5","A0A0"]],
  ["A0B5","FRM","Rücklicht rechts, Fehlfunktion","Rücklicht rechts hat ein elektrisches Problem.",["A0B2","A0B3","A0B4","A0A0"]],
  ["A0A0","FRM","FRM interne Fehlfunktion","Das Fußraummodul hat einen internen Fehler.",["A0B2","A0B3","A0B4","A0B5"]],
  ["2AAF","DME","Hochdruck-Kraftstoffpumpe, Druck zu niedrig","Die Hochdruckpumpe erreicht nicht den geforderten Raildruck.",["29D0","29CD","2A7A","2A70"]],
  ["2FBE","DME","Ventiltronic, Stellmotor Fehlfunktion","Der Stellmotor der Valvetronic arbeitet nicht korrekt.",["2FBF","2FC0","2A69","2A70"]],
  ["2FBF","DME","Ventiltronic, Exzenterwelle Position","Die Position der Valvetronic-Exzenterwelle weicht ab.",["2FBE","2FC0","2A69","2A70"]],
  ["2FC0","DME","Ventiltronic, Referenzierung fehlgeschlagen","Die Valvetronic konnte nicht referenziert werden.",["2FBE","2FBF","2A69","2A70"]],
  ["290900","DME","Luftsystem, Luft- zu AGR-Massenstrom Plausibilität","Gemessene Luftmasse im Vergleich zu berechneter Luftmasse nicht plausibel.",["29D0","29CD","480A","2A7A"]],
  ["A252","CAS","Zweiter Schlüssel nicht angelernt","Der Ersatzschlüssel ist nicht im CAS registriert.",["A251","A253","A254","A255"]],
  ["A253","CAS","Lenkradschloss, Fehlfunktion","Das elektronische Lenkradschloss funktioniert nicht korrekt.",["A251","A252","A254","A255"]],
  ["A254","CAS","Startfreigabe, Timeout","Die Startfreigabe konnte nicht rechtzeitig erteilt werden.",["A251","A252","A253","A255"]],
  ["A255","CAS","CAS Kommunikation, Fehler","Das CAS kann nicht mit anderen Steuergeräten kommunizieren.",["A251","A252","A253","A254"]],
  ["9CA2","KOMBI","Kühlmitteltemperaturanzeige, Fehler","Die Temperaturanzeige im Kombiinstrument zeigt falsch.",["9CA1","9CA3","9CB0","9CB1"]],
  ["9CA3","KOMBI","Drehzahlmesser, Fehler","Der Drehzahlmesser zeigt falsche Werte.",["9CA1","9CA2","9CB0","9CB1"]],
  ["9CB0","KOMBI","CAN-Bus Empfang, Fehler","Das Kombiinstrument empfängt keine CAN-Daten.",["9CA1","9CA2","9CA3","9CB1"]],
  ["9CB1","KOMBI","Kombiinstrument, interne Fehlfunktion","Das Kombiinstrument hat einen internen Fehler.",["9CA1","9CA2","9CA3","9CB0"]],
];

// Generic template for the additional codes
const genSymp = ["Warnleuchte im Display","System ggf. eingeschränkt","Fehlermeldung gespeichert","Ggf. Notlauf oder Funktionsausfall","TÜV möglicherweise relevant"];
const genCauses = ["Defekter Sensor oder Aktuator","Korrodierter Steckverbinder","Kabelbruch oder Kurzschluss","Verschleiß durch Alterung","Feuchtigkeit oder Wassereintritt","Defekte Sicherung oder Relais","Steuergerätfehler","Software-Problem"];
const genChecks = ["Relevante Steckverbindungen prüfen","Kabel auf sichtbare Schäden kontrollieren","Sicherungen prüfen","Fehlercode mit BMW-Diagnose auslesen","Fehler löschen und beobachten, ob er wiederkommt"];
const genShop = "Wenn der Fehler nach Sichtprüfung bestehen bleibt oder eine Warnleuchte dauerhaft leuchtet.";

for (const g of genericBMW) {
  const existing = codes.find(c => c.code === g[0]);
  if (existing) continue;
  add(g[0], g[1], g[2], g[3], g[3] + " Das Steuergerät hat eine Abweichung erkannt.",
    [...genSymp], [...genCauses],
    g[1] === "ACSM" || g[1] === "DSC" ? "high" : "medium",
    [...genChecks], genShop,
    [{q:`Ist ${g[0]} gefährlich?`,a:"Abhängig vom System. ACSM/DSC-Fehler sind sicherheitsrelevant."},{q:"Kann ich weiterfahren?",a:"Bei Sicherheitssystemen (Airbag, ABS) zeitnah in die Werkstatt."},{q:"Was kostet die Reparatur?",a:"Abhängig von der Ursache – von Steckerreinigung bis Steuergerätetausch."},{q:"Brauche ich BMW-Diagnose?",a:"Ja, BMW-interne Codes können nur mit BMW-Software ausgelesen und gelöscht werden."},{q:"Ist der Fehler TÜV-relevant?",a:"ACSM und DSC-Fehler ja. Kombi- und FRM-Fehler nur bei aktiven Warnleuchten."},{q:"Kann ein freier Werkstatt das reparieren?",a:"Ja, wenn sie BMW-Diagnose-Software (ISTA, Rheingold) haben."}],
    g[4]);
}

// Sort and validate
codes.sort((a, b) => a.code.localeCompare(b.code));
const codeSet = new Set(codes.map(c => c.code));
for (const c of codes) {
  c.related = (c.related || []).filter(r => codeSet.has(r) && r !== c.code).slice(0, 5);
}

console.log(`Generated ${codes.length} BMW codes`);
fs.mkdirSync(path.join(__dirname, "src"), { recursive: true });
fs.writeFileSync(path.join(__dirname, "src", "bmw-codes.json"), JSON.stringify(codes, null, 2), "utf-8");
console.log("Wrote src/bmw-codes.json");
