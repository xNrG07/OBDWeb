#!/usr/bin/env node
// generate-codes.js – Run once: node generate-codes.js
// Creates src/codes.json with 150 OBD-II codes

const fs = require("fs");
const path = require("path");

const codes = [];

function add(code, title, shortMeaning, meaningLong, symptoms, causes, urgency, firstChecks, whenToShop, faqs, category, related) {
  codes.push({ code, title, shortMeaning, meaningLong, symptoms, causes, urgency, firstChecks, whenToShop, faqs, category, related });
}

// ═══════════════════════════════════════════════════════════════
// CATALYST (cat)
// ═══════════════════════════════════════════════════════════════
add("P0420","Katalysator Wirkungsgrad unter Schwellenwert (Bank 1)","Der Katalysator auf Bank 1 arbeitet nicht effizient genug.","Die Motorsteuerung vergleicht die Signale der Lambda-Sonden vor und nach dem Katalysator. Wenn beide Sonden nahezu identische Werte liefern, deutet das darauf hin, dass der Katalysator die Abgase nicht mehr ausreichend reinigt. Der Fehler kann durch einen gealterten Kat, fehlerhafte Lambda-Sonden oder Abgaslecks ausgelöst werden.",
["Motorkontrollleuchte (MIL) leuchtet","Leicht erhöhter Kraftstoffverbrauch","Leichter Leistungsverlust möglich","Schwefelgeruch aus dem Auspuff","Abgasuntersuchung (AU) wird nicht bestanden"],
["Gealterter oder beschädigter Katalysator","Defekte hintere Lambda-Sonde (nach Kat)","Defekte vordere Lambda-Sonde (vor Kat)","Abgasleck vor dem Katalysator","Zündaussetzer beschädigen den Kat langfristig","Falsche Kraftstoffgemisch-Regelung","Ölverbrennung durch verschlissene Kolbenringe","Kühlmittel gelangt in den Brennraum (Zylinderkopfdichtung)"],
"medium",
["Motorkontrollleuchte notieren und Fehlercode auslesen","Sichtprüfung der Auspuffanlage auf Lecks oder Beschädigungen","Prüfen, ob andere Fehlercodes gleichzeitig gespeichert sind","Lambda-Sonden-Stecker auf festen Sitz prüfen","Auf ungewöhnliche Abgasgeräusche achten"],
"Wenn die AU ansteht oder der Fehler nach dem Löschen wiederholt auftritt, sollte eine Werkstatt die Lambda-Sonden-Signale im Live-Datenstrom prüfen und den Katalysator bewerten.",
[{q:"Kann ich mit P0420 weiterfahren?",a:"In der Regel ja, da es meist kein akutes Sicherheitsrisiko darstellt. Die Abgasreinigung ist jedoch eingeschränkt."},{q:"Wie teuer ist ein neuer Katalysator?",a:"Je nach Fahrzeug zwischen 300 und 2.000 Euro inklusive Einbau."},{q:"Kann eine defekte Lambda-Sonde den Fehler auslösen?",a:"Ja, eine fehlerhafte Lambda-Sonde kann falsche Werte liefern und den Code setzen, obwohl der Kat in Ordnung ist."},{q:"Geht die Motorkontrollleuchte von selbst aus?",a:"Wenn die Ursache behoben ist, erlischt die Leuchte nach mehreren fehlerfreien Fahrzyklen oder durch manuelles Löschen."},{q:"Beeinflusst P0420 die Hauptuntersuchung (TÜV)?",a:"Ja, ein aktiver Fehlercode führt in der Regel zum Nichtbestehen der AU."},{q:"Kann billiger Kraftstoff den Fehler verursachen?",a:"Minderwertiger Kraftstoff kann langfristig den Kat schädigen, ist aber selten die alleinige Ursache."}],
"catalyst",["P0421","P0430","P0171","P0300","P0141"]);

add("P0421","Katalysator Wirkungsgrad – Aufwärmphase (Bank 1)","Der Kat erreicht in der Aufwärmphase nicht die erwartete Effizienz.","Dieser Code ähnelt P0420, bezieht sich aber speziell auf die Phase nach dem Kaltstart. Der Kat muss eine Mindesttemperatur erreichen, um effizient zu arbeiten.",
["Motorkontrollleuchte leuchtet","Erhöhte Emissionen beim Kaltstart","Leichter Leistungsverlust in der Warmlaufphase","Schwefelgeruch möglich","AU wird nicht bestanden"],
["Gealterter Katalysator","Thermostat defekt – Motor wird nicht warm genug","Lambda-Sonde liefert fehlerhafte Werte","Abgasleck vor dem Kat","Zündaussetzer beim Kaltstart","Falsche Motortemperatur-Signale","Kraftstoffsystem-Probleme","Beschädigte Kat-Keramik"],
"medium",
["Kühlmitteltemperatur beobachten – erreicht der Motor Betriebstemperatur?","Auspuffanlage auf sichtbare Schäden prüfen","Steckverbindungen der Lambda-Sonden kontrollieren","Weitere gespeicherte Fehlercodes prüfen","Auf Kaltstart-Probleme achten"],
"Wenn der Motor auffällig lange braucht, um warm zu werden, oder der Fehler wiederholt auftritt.",
[{q:"Was unterscheidet P0421 von P0420?",a:"P0421 bezieht sich auf die Aufwärmphase, P0420 auf den allgemeinen Betrieb."},{q:"Kann ein defekter Thermostat die Ursache sein?",a:"Ja, wenn der Motor nicht warm genug wird, arbeitet der Kat ineffizient."},{q:"Ist der Fehler dringend?",a:"Nicht akut gefährlich, aber die Emissionen sind erhöht."},{q:"Kann ich den Fehler selbst beheben?",a:"Die Diagnose erfordert meist Messtechnik – eine Werkstatt ist empfehlenswert."},{q:"Wie lange hält ein Katalysator?",a:"Typischerweise 100.000 bis 200.000 km, abhängig von Fahrweise und Wartung."},{q:"Beeinflusst der Fehler den Kraftstoffverbrauch?",a:"Indirekt ja, da das Motorsteuergerät die Gemischregelung anpassen kann."}],
"catalyst",["P0420","P0430","P0128","P0125","P0171"]);

add("P0430","Katalysator Wirkungsgrad unter Schwellenwert (Bank 2)","Der Katalysator auf Bank 2 arbeitet nicht effizient genug.","Identisch mit P0420, aber für Bank 2 (bei V-Motoren die gegenüberliegende Zylinderbank). Die Motorsteuerung erkennt, dass der Kat auf Bank 2 die Abgase nicht ausreichend reinigt.",
["Motorkontrollleuchte leuchtet","Leicht erhöhter Kraftstoffverbrauch","Möglicher Leistungsverlust","Schwefelgeruch","AU wird nicht bestanden"],
["Gealterter Katalysator Bank 2","Defekte Lambda-Sonde Bank 2","Abgasleck auf Bank-2-Seite","Zündaussetzer auf Bank-2-Zylindern","Ölverbrauch auf Bank 2","Kühlmittelverlust in Brennraum Bank 2","Falsche Gemischregelung Bank 2","Beschädigte Auspuffkrümmer-Dichtung"],
"medium",
["Auspuffanlage Bank-2-Seite auf Lecks sichtprüfen","Lambda-Sonden-Stecker Bank 2 kontrollieren","Weitere Fehlercodes prüfen, insbesondere Bank-2-bezogene","Auf ungewöhnliche Abgasgeräusche achten","Ölstand und Kühlmittelstand prüfen"],
"Wenn der Fehler wiederholt auftritt oder die AU ansteht.",
[{q:"Was bedeutet Bank 2?",a:"Bei V-Motoren ist Bank 2 die Zylinderreihe, in der sich Zylinder 2 befindet."},{q:"Kann P0430 zusammen mit P0420 auftreten?",a:"Ja, bei V-Motoren können beide Bänke betroffen sein."},{q:"Muss ich beide Kats tauschen?",a:"Nicht unbedingt – nur den betroffenen Kat auf Bank 2, falls er defekt ist."},{q:"Ist die Reparatur teuer?",a:"Ähnlich wie bei P0420: 300 bis 2.000 Euro je nach Fahrzeug und Kat-Typ."},{q:"Kann ich mit dem Fehler TÜV machen?",a:"Nein, ein aktiver Fehlercode führt in der Regel zum Nichtbestehen."},{q:"Was ist, wenn nur die Lambda-Sonde defekt ist?",a:"Dann ist der Tausch der Sonde deutlich günstiger (80 bis 250 Euro)."}],
"catalyst",["P0420","P0421","P0172","P0305","P0155"]);

// ═══════════════════════════════════════════════════════════════
// FUEL SYSTEM (fuel)
// ═══════════════════════════════════════════════════════════════
add("P0171","Gemisch zu mager – Bank 1","Zu viel Luft oder zu wenig Kraftstoff auf Bank 1.","Die Langzeit-Kraftstofftrimmung liegt dauerhaft über dem Normbereich. Der Motor versucht gegenzuregeln, schafft es aber nicht – es gelangt zu viel Luft oder zu wenig Kraftstoff in die Zylinder.",
["Motorkontrollleuchte leuchtet","Unruhiger Leerlauf","Ruckeln beim Beschleunigen","Erhöhter Kraftstoffverbrauch","Motorstottern oder -aussetzer"],
["Falschluft (undichte Ansaugschläuche, Dichtungen)","Defekter Luftmassenmesser (LMM)","Verstopfter Kraftstofffilter","Schwache Kraftstoffpumpe","Undichte oder verstopfte Einspritzdüsen","Defekte Lambda-Sonde Bank 1","Undichtes Saugrohr oder Ansaugbrücke","Defektes PCV-Ventil (Kurbelgehäuseentlüftung)"],
"medium",
["Ansaugschläuche und Verbindungen auf Risse oder lose Schellen sichtprüfen","Luftfilter prüfen – ist er stark verschmutzt?","Steckverbindung am Luftmassenmesser kontrollieren","Auf Zischgeräusche im Motorraum achten (Falschluft)","Kraftstofftankdeckel fest verschlossen?"],
"Wenn der Motor merklich unruhig läuft oder der Fehler nach Löschen sofort wiederkommt.",
[{q:"Was bedeutet 'mager' beim Kraftstoffgemisch?",a:"Zu viel Luft im Verhältnis zum Kraftstoff – das Gemisch verbrennt weniger effizient."},{q:"Kann Falschluft den Motor beschädigen?",a:"Langfristig ja, da magere Verbrennung zu erhöhten Temperaturen und Klopfen führen kann."},{q:"Ist P0171 gefährlich?",a:"Nicht sofort, aber das Fahrzeug sollte zeitnah geprüft werden."},{q:"Wie finde ich ein Falschluft-Leck?",a:"Werkstätten nutzen Rauchmaschinen. Optisch kann man Schläuche und Dichtungen prüfen."},{q:"Kann ein verschmutzter LMM den Fehler auslösen?",a:"Ja, ein verschmutzter Luftmassenmesser misst falsch und verursacht Gemischprobleme."},{q:"Tritt P0171 oft zusammen mit P0174 auf?",a:"Ja, P0174 ist das Pendant für Bank 2 – bei Reihen-Motoren tritt oft nur P0171 auf."}],
"fuel",["P0174","P0170","P0300","P0101","P0420"]);

add("P0172","Gemisch zu fett – Bank 1","Zu viel Kraftstoff oder zu wenig Luft auf Bank 1.","Die Langzeit-Kraftstofftrimmung liegt dauerhaft im negativen Bereich – es wird mehr Kraftstoff eingespritzt als nötig.",
["Motorkontrollleuchte leuchtet","Schwarzer Rauch aus dem Auspuff","Erhöhter Kraftstoffverbrauch","Benzingeruch","Zündkerzen verrußt"],
["Defekter Luftmassenmesser","Undichte Einspritzdüsen (tropfen nach)","Defekter Kraftstoffdruckregler","Verstopfter Luftfilter","Defekte Lambda-Sonde","Fehlerhafter Kühlmitteltemperatursensor","Hoher Kraftstoffdruck","Defektes EVAP-Spülventil (ständig offen)"],
"medium",
["Luftfilter auf starke Verschmutzung prüfen","Auf Benzingeruch am Auspuff achten","Ölstand prüfen – riecht das Öl nach Benzin?","LMM-Steckverbindung kontrollieren","Zündkerzen optisch prüfen (verrußt?)"],
"Wenn schwarzer Rauch sichtbar ist oder starker Benzingeruch auftritt.",
[{q:"Was bedeutet 'fett' beim Gemisch?",a:"Zu viel Kraftstoff im Verhältnis zur Luft."},{q:"Kann ein fettes Gemisch den Motor schädigen?",a:"Ja, es kann den Kat beschädigen und den Ölfilm verdünnen."},{q:"Warum riecht es nach Benzin?",a:"Unverbrannter Kraftstoff gelangt in den Auspuff."},{q:"Ist sofortiges Handeln nötig?",a:"Starker Benzingeruch oder schwarzer Rauch sollten zeitnah untersucht werden."},{q:"Kann ich den Luftfilter selbst wechseln?",a:"Ja, das ist bei den meisten Fahrzeugen einfach und ein guter erster Schritt."},{q:"Hängt P0172 mit P0175 zusammen?",a:"Ja, P0175 ist der gleiche Fehler für Bank 2."}],
"fuel",["P0175","P0171","P0101","P0300","P0420"]);

add("P0174","Gemisch zu mager – Bank 2","Zu viel Luft oder zu wenig Kraftstoff auf Bank 2.","Wie P0171, aber für Bank 2. Bei V-Motoren kann der Fehler auf eine Bank beschränkt sein, was die Diagnose eingrenzt.",
["Motorkontrollleuchte leuchtet","Unruhiger Leerlauf","Beschleunigungsprobleme","Erhöhter Verbrauch","Leistungsverlust"],
["Falschluft auf Bank-2-Seite","Defekter LMM","Schwache Kraftstoffpumpe","Verstopfte Einspritzdüsen Bank 2","Defekte Lambda-Sonde Bank 2","Undichte Ansaugkrümmerdichtung","Defektes PCV-System","Kraftstofffilter verstopft"],
"medium",
["Ansaugschläuche Bank-2-Seite prüfen","LMM-Stecker kontrollieren","Auf Nebenluftgeräusche achten","Weitere Fehlercodes auslesen","Kraftstofftankdeckel prüfen"],
"Wenn Motor unruhig läuft oder der Fehler zusammen mit P0171 auftritt.",
[{q:"Warum tritt P0174 nur auf Bank 2 auf?",a:"Das deutet auf ein lokales Problem auf der Bank-2-Seite hin, z.B. ein Ansaugleck."},{q:"Kann P0174 zusammen mit P0171 auftreten?",a:"Ja, dann liegt das Problem vermutlich an einer gemeinsamen Komponente."},{q:"Ist die Reparatur teuer?",a:"Von günstig (Schlauch tauschen) bis aufwändig (Einspritzdüsen)."},{q:"Kann ich den Fehler ignorieren?",a:"Nicht empfehlenswert, da mageres Gemisch den Motor langfristig schädigen kann."},{q:"Was ist eine Langzeit-Kraftstofftrimmung?",a:"Ein Korrekturwert, den das Steuergerät nutzt, um das Gemisch anzupassen."},{q:"Betrifft P0174 nur V-Motoren?",a:"Hauptsächlich, da Reihenmotoren nur eine Bank haben."}],
"fuel",["P0171","P0175","P0170","P0101","P0300"]);

add("P0175","Gemisch zu fett – Bank 2","Zu viel Kraftstoff oder zu wenig Luft auf Bank 2.","Wie P0172, aber für Bank 2.",
["Motorkontrollleuchte leuchtet","Schwarzer Rauch","Erhöhter Verbrauch","Benzingeruch","Schlechte Abgaswerte"],
["Defekter LMM","Undichte Einspritzdüsen Bank 2","Defekter Kraftstoffdruckregler","Verstopfter Luftfilter","Defekte Lambda-Sonde Bank 2","Fehlerhafter Kühlmittelsensor","EVAP-Ventil defekt","Hoher Systemdruck"],
"medium",
["Luftfilter prüfen","Benzingeruch kontrollieren","Ölstand und -zustand prüfen","Steckverbindungen prüfen","Zündkerzen Bank 2 prüfen"],
"Bei sichtbarem schwarzen Rauch oder starkem Benzingeruch.",
[{q:"Was ist der Unterschied zu P0172?",a:"P0175 betrifft Bank 2, P0172 Bank 1."},{q:"Kann ein verstopfter Luftfilter die Ursache sein?",a:"Ja, ein stark verschmutzter Filter reduziert die Luftzufuhr."},{q:"Schadet fettes Gemisch dem Kat?",a:"Ja, unverbrannter Kraftstoff kann den Katalysator überhitzen."},{q:"Wie erkenne ich fettes Gemisch?",a:"Schwarzer Rauch, Benzingeruch und verrußte Zündkerzen sind typisch."},{q:"Kann ich weiterfahren?",a:"Kurzfristig ja, aber eine baldige Diagnose ist wichtig."},{q:"Was kostet die Reparatur?",a:"Abhängig von der Ursache: 50 Euro (Luftfilter) bis 500+ Euro (Einspritzdüsen)."}],
"fuel",["P0172","P0174","P0171","P0101","P0430"]);

add("P0170","Kraftstofftrimmung Fehlfunktion – Bank 1","Die Kraftstofftrimmung auf Bank 1 liegt außerhalb des normalen Bereichs.","Das Steuergerät hat erkannt, dass die Kurzzeit- oder Langzeit-Kraftstofftrimmung dauerhaft abnormale Werte zeigt.",
["Motorkontrollleuchte leuchtet","Schwankender Leerlauf","Ungleichmäßige Beschleunigung","Erhöhter Verbrauch","Mögliche Abgasprobleme"],
["Falschluft im Ansaugtrakt","Defekter LMM","Defekte Lambda-Sonde","Kraftstoffdruckprobleme","Verstopfte Einspritzdüsen","Undichte Saugrohrdichtung","Defektes PCV-Ventil","Fehlerhafter MAP-Sensor"],
"medium",
["Ansaugschläuche sichtprüfen","LMM-Stecker kontrollieren","Auf Nebenluftgeräusche hören","Weitere Fehlercodes auslesen","Luftfilter prüfen"],
"Wenn der Leerlauf deutlich unruhig ist oder weitere Fehlercodes gesetzt sind.",
[{q:"Was ist die Kraftstofftrimmung?",a:"Ein Korrekturwert, mit dem das Steuergerät das Gemisch anpasst."},{q:"Ist P0170 dasselbe wie P0171?",a:"Nein, P0170 zeigt eine allgemeine Fehlfunktion, P0171 speziell ein mageres Gemisch."},{q:"Kann ich den Fehler selbst beheben?",a:"Eine Sichtprüfung ist möglich, die genaue Diagnose erfordert Messtechnik."},{q:"Wie dringend ist der Fehler?",a:"Mittlere Dringlichkeit – zeitnahe Werkstattdiagnose empfohlen."},{q:"Tritt P0170 oft mit anderen Codes auf?",a:"Ja, häufig zusammen mit P0171, P0172, P0174 oder P0175."},{q:"Was kostet die Diagnose?",a:"Eine OBD-Diagnose kostet typischerweise 30 bis 80 Euro in der Werkstatt."}],
"fuel",["P0171","P0172","P0174","P0175","P0101"]);

// ═══════════════════════════════════════════════════════════════
// MISFIRE
// ═══════════════════════════════════════════════════════════════
add("P0300","Zufällige/multiple Zündaussetzer erkannt","Zündaussetzer in mehreren Zylindern festgestellt.","Das Steuergerät erkennt über die Kurbelwellendrehzahl Unregelmäßigkeiten in der Verbrennung. Bei P0300 treten die Aussetzer zufällig verteilt auf, nicht in einem einzelnen Zylinder.",
["Motorkontrollleuchte blinkt oder leuchtet","Motor ruckelt und vibriert","Deutlicher Leistungsverlust","Unruhiger Leerlauf bis Absterben","Erhöhter Kraftstoffverbrauch"],
["Verschlissene Zündkerzen","Defekte Zündspulen","Falschluft im Ansaugtrakt","Niedriger Kraftstoffdruck","Verstopfte Einspritzdüsen","Defekter Zündverteiler (ältere Fahrzeuge)","Kompressionsverlust (Ventile, Kopfdichtung)","Fehlerhafte Motorsteuerung oder Kabelbaum"],
"high",
["Prüfen, wann Zündkerzen zuletzt gewechselt wurden","Zündkerzenstecker auf festen Sitz prüfen","Auf sichtbare Risse an Zündkabeln achten","Luftfilter kontrollieren","Weitere zylinderspecifische Fehlercodes prüfen (P0301–P0312)"],
"Sofort, wenn die Motorkontrollleuchte blinkt – das zeigt schwere Aussetzer, die den Kat beschädigen können.",
[{q:"Ist eine blinkende Motorkontrollleuchte gefährlich?",a:"Ja, Blinken zeigt schwere Aussetzer an. Sofort Geschwindigkeit reduzieren und Werkstatt aufsuchen."},{q:"Können verschlissene Zündkerzen die Ursache sein?",a:"Ja, das ist eine der häufigsten Ursachen."},{q:"Was kostet ein Zündkerzenwechsel?",a:"Material: 20 bis 80 Euro. Werkstattkosten: 50 bis 200 Euro je nach Zugänglichkeit."},{q:"Warum treten die Aussetzer in mehreren Zylindern auf?",a:"Das deutet auf eine gemeinsame Ursache wie Kraftstoffdruck oder Falschluft hin."},{q:"Kann ich mit P0300 weiterfahren?",a:"Bei leuchtender MIL vorsichtig, bei blinkender MIL sofort Werkstatt."},{q:"Schädigen Zündaussetzer den Motor?",a:"Ja, unverbrannter Kraftstoff kann den Kat zerstören."}],
"misfire",["P0301","P0302","P0303","P0304","P0171"]);

// Cylinder-specific misfires P0301-P0308
for (let i = 1; i <= 8; i++) {
  const rel = ["P0300"];
  for (let j = 1; j <= 5; j++) if (j !== i) { rel.push(`P030${j}`); if (rel.length >= 5) break; }
  add(`P030${i}`,`Zündaussetzer Zylinder ${i}`,`In Zylinder ${i} wurden Zündaussetzer erkannt.`,
    `Das Motorsteuergerät hat festgestellt, dass Zylinder ${i} nicht zuverlässig zündet. Die Aussetzer werden über Drehzahlschwankungen der Kurbelwelle erkannt. Im Gegensatz zu P0300 ist hier der betroffene Zylinder klar identifiziert.`,
    ["Motorkontrollleuchte leuchtet oder blinkt","Motor ruckelt, besonders im Leerlauf","Leistungsverlust","Vibrationen im Fahrzeug spürbar","Erhöhter Kraftstoffverbrauch"],
    [`Verschlissene Zündkerze in Zylinder ${i}`,`Defekte Zündspule des Zylinders ${i}`,"Defekte oder verstopfte Einspritzdüse","Kompressionsverlust im Zylinder","Defektes Zündkabel (ältere Fahrzeuge)","Ventilproblem (Ventilspiel, verbranntes Ventil)","Undichte Zylinderkopfdichtung","Fehlerhafte Verkabelung"],
    "high",
    ["Zündkerze des betreffenden Zylinders optisch prüfen","Zündspulenstecker auf festen Sitz prüfen","Zündspule testweise mit funktionierendem Zylinder tauschen","Einspritzdüsen-Stecker kontrollieren","Auf ölige oder nasse Stellen am Zylinderkopf achten"],
    "Wenn die Motorkontrollleuchte blinkt oder der Fehler nach Zündkerzenwechsel bestehen bleibt.",
    [{q:`Kann ich nur die Zündkerze von Zylinder ${i} tauschen?`,a:"Ja, aber es ist empfehlenswert, alle Zündkerzen gleichzeitig zu erneuern."},{q:`Wie finde ich Zylinder ${i}?`,a:"Die Zylindernummerierung steht im Werkstatthandbuch und variiert je nach Motortyp."},{q:"Kann eine defekte Zündspule die alleinige Ursache sein?",a:"Ja, das ist eine der häufigsten Ursachen. Testweise mit einem anderen Zylinder tauschen."},{q:"Was kostet eine neue Zündspule?",a:"Zwischen 30 und 120 Euro je nach Fahrzeug, plus Einbau."},{q:"Schädigt ein Zündaussetzer den Motor?",a:"Ja, unverbrannter Kraftstoff gelangt in den Kat und kann ihn zerstören."},{q:"Muss ich sofort in die Werkstatt?",a:"Bei blinkender MIL sofort, bei dauerhaft leuchtender zeitnah."}],
    "misfire", rel);
}

// ═══════════════════════════════════════════════════════════════
// EVAP
// ═══════════════════════════════════════════════════════════════
add("P0440","EVAP-System Fehlfunktion","Das Kraftstoffverdunstungssystem meldet eine allgemeine Fehlfunktion.","Das EVAP-System fängt Kraftstoffdämpfe aus dem Tank auf und führt sie dem Motor zu. P0440 zeigt, dass das System nicht korrekt arbeitet.",
["Motorkontrollleuchte leuchtet","Kraftstoffgeruch möglich","Keine spürbaren Fahrprobleme","Tankdeckel-Warnung möglich","AU-Probleme"],
["Tankdeckel nicht richtig verschlossen oder defekt","Leck in einer EVAP-Leitung","Defektes Spülventil (Purge Valve)","Defektes Entlüftungsventil (Vent Valve)","Beschädigter Aktivkohlefilter","Undichter Kraftstofftank","Rissige oder poröse Schläuche","Defekter Tankdrucksensor"],
"low",
["Tankdeckel abnehmen, Dichtung prüfen und fest aufsetzen","EVAP-Leitungen unter dem Fahrzeug sichtprüfen","Auf Kraftstoffgeruch achten","Fehlercode löschen und beobachten","Tankdeckel-Dichtung auf Risse prüfen"],
"Wenn der Fehler nach erneutem Festziehen des Tankdeckels wiederholt auftritt.",
[{q:"Kann ein loser Tankdeckel P0440 auslösen?",a:"Ja, das ist die häufigste und einfachste Ursache."},{q:"Ist P0440 gefährlich?",a:"Nein, es ist ein Emissionsfehler ohne direktes Sicherheitsrisiko."},{q:"Was kostet ein neuer Tankdeckel?",a:"Zwischen 10 und 40 Euro."},{q:"Was macht das EVAP-System?",a:"Es verhindert, dass Kraftstoffdämpfe in die Atmosphäre gelangen."},{q:"Kann ich mit P0440 weiterfahren?",a:"Ja, es gibt keine Einschränkungen beim Fahren."},{q:"Beeinflusst P0440 den TÜV?",a:"Ja, ein aktiver Fehlercode kann zum Nichtbestehen der AU führen."}],
"evap",["P0441","P0442","P0443","P0446","P0455"]);

add("P0441","EVAP-System – Spülstrom nicht korrekt","Der Spülstrom des EVAP-Systems entspricht nicht dem erwarteten Wert.","Das Steuergerät überwacht den Fluss der Kraftstoffdämpfe vom Aktivkohlefilter zum Ansaugtrakt. P0441 wird gesetzt, wenn dieser abweicht.",
["Motorkontrollleuchte leuchtet","Keine spürbaren Fahrprobleme","Leichter Kraftstoffgeruch möglich","AU-Probleme","Tankdeckel-Warnung möglich"],
["Defektes Spülventil","Blockierte EVAP-Leitungen","Defekter Tankdeckel","Leck im EVAP-System","Beschädigter Aktivkohlefilter","Verstopfte Spülleitungen","Defekter Tankdrucksensor","Verkabelungsproblem am Spülventil"],
"low",
["Tankdeckel fest verschließen","EVAP-Schläuche auf Knicke oder Risse sichtprüfen","Auf Kraftstoffgeruch achten","Fehlercode löschen und beobachten","Spülventil-Stecker auf festen Sitz prüfen"],
"Wenn der Fehler wiederholt auftritt – eine Werkstatt kann eine EVAP-Dichtheitsprüfung durchführen.",
[{q:"Merke ich P0441 beim Fahren?",a:"In der Regel nicht – es ist ein Emissionsfehler."},{q:"Was ist das Spülventil?",a:"Ein Ventil, das Kraftstoffdämpfe kontrolliert vom Aktivkohlefilter zum Motor leitet."},{q:"Kann ich den Fehler selbst beheben?",a:"Tankdeckel prüfen ist einfach. Weitere Diagnose erfordert Werkstatttechnik."},{q:"Ist die Reparatur teuer?",a:"Ein Spülventil kostet 30 bis 80 Euro, der Einbau ist meist unkompliziert."},{q:"Kann verstopfte Aktivkohle den Fehler auslösen?",a:"Ja, ein gesättigter Filter kann den Spülstrom beeinträchtigen."},{q:"Tritt P0441 saisonal auf?",a:"Temperaturwechsel können EVAP-Probleme begünstigen."}],
"evap",["P0440","P0442","P0443","P0446","P0455"]);

add("P0442","EVAP-System – kleine Leckage erkannt","Ein kleines Leck im Kraftstoffdampfsystem wurde festgestellt.","Das Steuergerät testet das EVAP-System auf Dichtheit. P0442 zeigt ein kleines Leck an. Häufigste Ursache: defekter Tankdeckel.",
["Motorkontrollleuchte leuchtet","Leichter Kraftstoffgeruch möglich","Keine Fahrprobleme","AU-Probleme","Tankdeckel-Warnung"],
["Undichter oder defekter Tankdeckel","Kleine Risse in EVAP-Schläuchen","Undichtes Spülventil","Undichtes Entlüftungsventil","Korrodierte Anschlüsse","Haarriss im Kraftstofftank","Poröse Gummidichtung am Tankdeckel","Defekter Tankdrucksensor"],
"low",
["Tankdeckel austauschen oder Dichtung prüfen","EVAP-Leitungen sichtprüfen","Auf Kraftstoffgeruch unter dem Fahrzeug achten","Fehlercode löschen und mehrere Fahrzyklen abwarten","Tankdeckel-Klick beim Verschließen kontrollieren"],
"Wenn ein neuer Tankdeckel das Problem nicht löst – Rauchprüfung kann das Leck finden.",
[{q:"Ist ein kleines Leck schlimm?",a:"Kein Sicherheitsrisiko, aber Kraftstoffdämpfe gelangen unkontrolliert in die Umwelt."},{q:"Reicht ein neuer Tankdeckel?",a:"In vielen Fällen ja – der günstigste und häufigste Fix."},{q:"Was kostet eine EVAP-Rauchprüfung?",a:"Typischerweise 50 bis 100 Euro in der Werkstatt."},{q:"Unterschied zwischen P0442 und P0455?",a:"P0442 ist ein kleines Leck, P0455 ein großes."},{q:"Kann Hitze EVAP-Schläuche beschädigen?",a:"Ja, Wärme und Alterung machen Gummischläuche porös."},{q:"Verschwindet der Fehler von selbst?",a:"Selten – das Leck muss behoben werden."}],
"evap",["P0440","P0441","P0455","P0443","P0446"]);

add("P0443","EVAP-Spülventil Steuerkreis Fehlfunktion","Der elektrische Steuerkreis des Spülventils funktioniert nicht korrekt.","Das Steuergerät kann das Spülventil nicht ansteuern – defektes Ventil, Verkabelung oder Steuergerät.",
["Motorkontrollleuchte leuchtet","Keine spürbaren Fahrprobleme","Möglicher Kraftstoffgeruch","AU-Probleme","Leicht erhöhter Verbrauch möglich"],
["Defektes Spülventil","Unterbrochene Verkabelung","Korrodierter Stecker","Sicherung durchgebrannt","Kurzschluss im Kabelbaum","Defektes Steuergerät (selten)","Oxidierte Kontakte","Falsches Ventil eingebaut"],
"low",
["Spülventil-Stecker prüfen und reinigen","Sicherungen kontrollieren","Kabelbaum sichtprüfen","Fehlercode löschen und beobachten","Auf korrodierte Kontakte achten"],
"Wenn der Fehler nach Steckerprüfung bestehen bleibt.",
[{q:"Was macht das Spülventil?",a:"Es öffnet und schließt, um Kraftstoffdämpfe kontrolliert dem Motor zuzuführen."},{q:"Kann ein korrodierter Stecker die Ursache sein?",a:"Ja, besonders bei älteren Fahrzeugen oder nach Wasserkontakt."},{q:"Was kostet ein neues Spülventil?",a:"30 bis 100 Euro für das Teil."},{q:"Ist P0443 dringend?",a:"Nein, aber für die AU sollte es behoben werden."},{q:"Kann ich das Ventil selbst wechseln?",a:"Bei guter Zugänglichkeit ist es ein einfacher Tausch."},{q:"Wo sitzt das Spülventil?",a:"Meist im Motorraum nahe dem Ansaugtrakt."}],
"evap",["P0440","P0441","P0442","P0446","P0455"]);

add("P0446","EVAP-Entlüftungsventil Steuerkreis Fehlfunktion","Der Steuerkreis des EVAP-Entlüftungsventils arbeitet nicht korrekt.","Das Vent Valve regelt den Lufteinlass ins EVAP-System. P0446 zeigt ein Problem mit dessen Ansteuerung.",
["Motorkontrollleuchte leuchtet","Schwierigkeiten beim Tanken möglich","Kraftstoffgeruch","Keine Fahrprobleme","AU-Probleme"],
["Defektes Entlüftungsventil","Verstopftes Ventil (Schmutz, Insekten)","Verkabelungsproblem","Korrodierter Stecker","Blockierter Aktivkohlefilter","Defekte Sicherung","Defektes Steuergerät (selten)","Beschädigte Unterdruckleitung"],
"low",
["Entlüftungsventil lokalisieren und Stecker prüfen","Ventilöffnung auf Verstopfung prüfen","Sicherungen kontrollieren","Fehlercode löschen und beobachten","Aktivkohlefilter sichtprüfen"],
"Wenn das Tanken problematisch wird oder der Fehler persistent ist.",
[{q:"Was ist das Entlüftungsventil?",a:"Es lässt bei Bedarf Frischluft in das EVAP-System einströmen."},{q:"Warum Probleme beim Tanken?",a:"Ein blockiertes Ventil kann Überdruck im Tank verursachen."},{q:"Wo sitzt das Ventil?",a:"Meist nahe dem Aktivkohlefilter, oft unter dem Fahrzeug."},{q:"Ist die Reparatur teuer?",a:"Das Ventil kostet 20 bis 80 Euro."},{q:"Können Insekten das Ventil verstopfen?",a:"Ja, besonders wenn das Fahrzeug im Freien steht."},{q:"Beeinflusst P0446 die Motorleistung?",a:"Nein, es ist ein reiner Emissionsfehler."}],
"evap",["P0440","P0441","P0442","P0443","P0455"]);

add("P0455","EVAP-System – große Leckage erkannt","Ein großes Leck im EVAP-System wurde festgestellt.","Im Gegensatz zu P0442 (klein) zeigt P0455 ein deutliches Leck an. Häufigste Ursache: fehlender oder defekter Tankdeckel.",
["Motorkontrollleuchte leuchtet","Deutlicher Kraftstoffgeruch","Keine Fahrprobleme","AU wird nicht bestanden","Tankdeckel-Warnung"],
["Tankdeckel fehlt oder ist nicht verschlossen","Stark defekter Tankdeckel","Großer Riss in EVAP-Leitung","Abgefallener EVAP-Schlauch","Defektes Spülventil (klemmt offen)","Beschädigter Aktivkohlefilter","Riss im Kraftstofftank","Gelöste Schlauchverbindung"],
"low",
["Tankdeckel prüfen – ist er vorhanden und fest?","EVAP-Schläuche unter dem Fahrzeug sichtprüfen","Auf starken Kraftstoffgeruch achten","Fehlercode löschen und beobachten","Kraftstofftank sichtprüfen"],
"Wenn der Tankdeckel in Ordnung ist und der Fehler bestehen bleibt.",
[{q:"Ist es einfach der Tankdeckel?",a:"Sehr häufig ja – erst prüfen und ggf. ersetzen."},{q:"Ist das Leck gefährlich?",a:"Kraftstoffdämpfe sind entzündlich – bei starkem Geruch Vorsicht."},{q:"Was kostet die Reparatur?",a:"Tankdeckel: 10 bis 40 Euro. Schlauch: 20 bis 80 Euro."},{q:"Kann ich den Fehler selbst finden?",a:"Den Tankdeckel ja. Für versteckte Lecks braucht die Werkstatt eine Rauchmaschine."},{q:"Unterschied zu P0442?",a:"P0455 ist ein großes Leck, P0442 ein kleines."},{q:"Warum rieche ich Benzin?",a:"Kraftstoffdämpfe entweichen durch das Leck."}],
"evap",["P0440","P0441","P0442","P0443","P0446"]);

add("P0456","EVAP-System – sehr kleine Leckage erkannt","Ein sehr kleines Leck im EVAP-System wurde erkannt.","Kleiner als P0442. Oft schwer zu finden.",
["Motorkontrollleuchte leuchtet","Keine Fahrprobleme","Kein spürbarer Geruch","AU-Probleme","Intermittierender Fehler möglich"],
["Poröse Tankdeckeldichtung","Mikrorisse in EVAP-Schläuchen","Leicht undichtes Spülventil","Alterungsbedingte Porosität","Korrodierte Verbindungen","Temperaturschwankungen","Defekter Tankdrucksensor","Haarriss am Einfüllstutzen"],
"low",
["Tankdeckel prüfen und ggf. ersetzen","EVAP-Schläuche auf Alterung prüfen","Fehlercode löschen und Wochen beobachten","Tankdeckeldichtung auf Verhärtung prüfen","Auf saisonales Auftreten achten"],
"Wenn der Fehler hartnäckig wiederkehrt.",
[{q:"Warum ist das Leck so schwer zu finden?",a:"Bei sehr kleinen Lecks versagt oft auch die Rauchprüfung."},{q:"Kann Kälte den Fehler auslösen?",a:"Ja, Materialien ziehen sich zusammen und können winzige Lecks verursachen."},{q:"Ist P0456 dringend?",a:"Nein, es ist der am wenigsten kritische EVAP-Fehler."},{q:"Kann ein neuer Tankdeckel helfen?",a:"Oft ja – der einfachste und günstigste Versuch."},{q:"Unterschied P0456 und P0442?",a:"P0456 zeigt ein noch kleineres Leck an."},{q:"Muss ich den Fehler für TÜV beheben?",a:"Ja, auch kleine EVAP-Fehler beeinflussen die AU."}],
"evap",["P0440","P0442","P0455","P0441","P0443"]);

// ═══════════════════════════════════════════════════════════════
// SENSORS
// ═══════════════════════════════════════════════════════════════
const sensorCodes = [
  ["P0010","Variable Nockenwellenverstellung (Einlass) Bank 1 – Steuerkreis","Der Steuerkreis der variablen Nockenwellenverstellung auf Bank 1 funktioniert nicht.","Das Magnetventil für die Nockenwellenverstellung (VVT) wird vom Steuergerät angesteuert. P0010 zeigt ein elektrisches Problem in diesem Steuerkreis.","sensor",["P0011","P0012","P0020","P0171","P0300"]],
  ["P0011","Nockenwellenverstellung (Einlass) Bank 1 – zu weit vorgestellt","Die Einlass-Nockenwelle auf Bank 1 ist weiter vorgestellt als vom Steuergerät gewünscht.","Die Nockenwellenverstellung passt die Ventilsteuerzeiten an. P0011 bedeutet, dass die Ist-Position von der Soll-Position abweicht.","sensor",["P0010","P0012","P0020","P0171","P0300"]],
  ["P0012","Nockenwellenverstellung (Einlass) Bank 1 – zu weit zurückgestellt","Die Einlass-Nockenwelle auf Bank 1 ist weiter zurückgestellt als gewünscht.","Die Nockenwellenposition hinkt der Sollvorgabe hinterher.","sensor",["P0010","P0011","P0020","P0171","P0300"]],
  ["P0020","Nockenwellenverstellung (Einlass) Bank 2 – Steuerkreis","Der Steuerkreis der Nockenwellenverstellung auf Bank 2 funktioniert nicht.","Wie P0010, aber für Bank 2.","sensor",["P0010","P0011","P0021","P0022","P0174"]],
  ["P0021","Nockenwellenverstellung (Einlass) Bank 2 – zu weit vorgestellt","Die Einlass-Nockenwelle auf Bank 2 ist zu weit vorgestellt.","Wie P0011, aber für Bank 2.","sensor",["P0020","P0022","P0010","P0011","P0174"]],
  ["P0022","Nockenwellenverstellung (Einlass) Bank 2 – zu weit zurückgestellt","Die Einlass-Nockenwelle auf Bank 2 ist zu weit zurückgestellt.","Wie P0012, aber für Bank 2.","sensor",["P0020","P0021","P0010","P0012","P0174"]],
  ["P0101","Luftmassenmesser (LMM) – Signal außerhalb des Bereichs","Der LMM liefert Werte außerhalb des erwarteten Bereichs.","Der LMM misst die angesaugte Luftmasse. Wenn die Werte nicht zur Drosselklappenstellung und Drehzahl passen, wird P0101 gesetzt.","sensor",["P0100","P0102","P0103","P0171","P0174"]],
  ["P0100","Luftmassenmesser (LMM) – Schaltkreis Fehlfunktion","Der elektrische Schaltkreis des LMM funktioniert nicht.","Kein gültiges Signal vom LMM.","sensor",["P0101","P0102","P0103","P0171","P0174"]],
  ["P0102","Luftmassenmesser – Signal zu niedrig","Das LMM-Signal ist zu niedrig.","Der gemessene Luftstrom ist zu gering für die Betriebssituation.","sensor",["P0100","P0101","P0103","P0171","P0172"]],
  ["P0103","Luftmassenmesser – Signal zu hoch","Das LMM-Signal ist zu hoch.","Der gemessene Luftstrom ist zu hoch für die Betriebssituation.","sensor",["P0100","P0101","P0102","P0171","P0175"]],
  ["P0110","Ansauglufttemperatursensor (IAT) – Schaltkreis Fehlfunktion","Der IAT-Sensor liefert kein gültiges Signal.","Der IAT misst die Temperatur der angesaugten Luft für die Gemischkorrektur.","sensor",["P0111","P0112","P0113","P0101","P0171"]],
  ["P0115","Kühlmitteltemperatursensor (ECT) – Schaltkreis Fehlfunktion","Der ECT-Sensor liefert kein gültiges Signal.","Ohne gültiges ECT-Signal kann die Gemischregelung, Lüftersteuerung und weitere temperaturabhängige Funktionen nicht korrekt arbeiten.","sensor",["P0116","P0117","P0118","P0125","P0128"]],
  ["P0116","Kühlmitteltemperatursensor – Signal nicht plausibel","Die ECT-Werte passen nicht zur Betriebssituation.","Das Steuergerät vergleicht ECT-Werte mit anderen Parametern und erkennt Unstimmigkeiten.","sensor",["P0115","P0117","P0118","P0125","P0128"]],
  ["P0117","Kühlmitteltemperatursensor – Signal zu niedrig","ECT meldet unrealistisch niedrige Temperatur.","Oft ein Kurzschluss in der Sensorleitung.","sensor",["P0115","P0116","P0118","P0125","P0128"]],
  ["P0118","Kühlmitteltemperatursensor – Signal zu hoch","ECT meldet unrealistisch hohe Temperatur.","Oft ein Kabelbruch oder loser Stecker.","sensor",["P0115","P0116","P0117","P0125","P0128"]],
  ["P0125","Kühlmitteltemperatur unzureichend für Gemischregelung","Motor erreicht nicht schnell genug die Mindesttemperatur.","Das Steuergerät wartet auf eine Mindesttemperatur für die Lambda-Regelung.","sensor",["P0128","P0115","P0116","P0117","P0421"]],
  ["P0128","Kühlmitteltemperatur unter Thermostat-Regulierbereich","Kühlmitteltemperatur bleibt dauerhaft zu niedrig.","Der Motor erreicht auch nach ausreichender Fahrzeit nicht die Soll-Betriebstemperatur.","sensor",["P0125","P0115","P0116","P0117","P0421"]],
  ["P0130","Lambda-Sonde Bank 1 Sensor 1 – Schaltkreis Fehlfunktion","Die vordere Lambda-Sonde Bank 1 liefert kein gültiges Signal.","Die Sonde vor dem Kat ist essenziell für die Gemischregelung.","sensor",["P0131","P0132","P0133","P0134","P0171"]],
  ["P0131","Lambda-Sonde Bank 1 Sensor 1 – Spannung zu niedrig","Die Sonde zeigt dauerhaft niedrige Spannung (mageres Signal).","Konstant niedrige Spannung deutet auf dauerhaft mageres Signal hin.","sensor",["P0130","P0132","P0133","P0134","P0171"]],
  ["P0132","Lambda-Sonde Bank 1 Sensor 1 – Spannung zu hoch","Die Sonde zeigt dauerhaft hohe Spannung (fettes Signal).","Konstant hohe Spannung deutet auf dauerhaft fettes Signal hin.","sensor",["P0130","P0131","P0133","P0134","P0172"]],
  ["P0133","Lambda-Sonde Bank 1 Sensor 1 – langsame Reaktion","Die Sonde reagiert zu langsam auf Gemischänderungen.","Eine träge Sonde verschlechtert die Gemischregelung.","sensor",["P0130","P0131","P0132","P0134","P0420"]],
  ["P0134","Lambda-Sonde Bank 1 Sensor 1 – keine Aktivität","Die Sonde zeigt keine Spannungsänderungen.","Die Sonde ist quasi inaktiv – kein Wechsel zwischen mager und fett.","sensor",["P0130","P0131","P0132","P0133","P0135"]],
  ["P0135","Lambda-Sonde Bank 1 Sensor 1 – Heizkreis Fehlfunktion","Die Heizung der vorderen Lambda-Sonde Bank 1 funktioniert nicht.","Lambda-Sonden müssen ca. 300°C erreichen. Die Heizung beschleunigt das.","sensor",["P0130","P0134","P0141","P0155","P0171"]],
  ["P0141","Lambda-Sonde Bank 1 Sensor 2 – Heizkreis Fehlfunktion","Die Heizung der hinteren Lambda-Sonde Bank 1 funktioniert nicht.","Die hintere Sonde überwacht den Katalysator.","sensor",["P0135","P0130","P0420","P0155","P0161"]],
  ["P0155","Lambda-Sonde Bank 2 Sensor 1 – Heizkreis Fehlfunktion","Die Heizung der vorderen Lambda-Sonde Bank 2 funktioniert nicht.","Wie P0135, aber für Bank 2.","sensor",["P0135","P0141","P0161","P0130","P0430"]],
  ["P0161","Lambda-Sonde Bank 2 Sensor 2 – Heizkreis Fehlfunktion","Die Heizung der hinteren Lambda-Sonde Bank 2 funktioniert nicht.","Wie P0141, aber für Bank 2.","sensor",["P0141","P0155","P0135","P0430","P0130"]],
  ["P0121","Drosselklappensensor (TPS) – Signal nicht plausibel","Der TPS liefert unplausible Werte.","Die Werte passen nicht zum Betriebszustand oder ändern sich sprunghaft.","throttle",["P0122","P0123","P0505","P0506","P0507"]],
  ["P0122","Drosselklappensensor – Signal zu niedrig","TPS-Signal unter dem erwarteten Bereich.","Der Sensor meldet eine zu geringe Drosselklappenöffnung.","throttle",["P0121","P0123","P0505","P0506","P0507"]],
  ["P0123","Drosselklappensensor – Signal zu hoch","TPS-Signal über dem erwarteten Bereich.","Der Sensor meldet eine zu große Drosselklappenöffnung.","throttle",["P0121","P0122","P0505","P0506","P0507"]],
];

// Generic generator for the sensor-style codes above
const sensorSymptoms = ["Motorkontrollleuchte leuchtet","Leistungsverlust möglich","Erhöhter Kraftstoffverbrauch","Unruhiger Leerlauf","Motor geht ggf. in Notlauf"];
const sensorCauses = ["Defekter Sensor","Korrodierter Steckverbinder","Kabelbruch oder Kurzschluss","Oxidierte Kontaktpins","Feuchtigkeit im Stecker","Defekte Sicherung","Falsches Ersatzteil verbaut","Fehlerhafte Masseverbindung"];
const sensorChecks = ["Steckverbindung des Sensors auf festen Sitz prüfen","Kabel auf sichtbare Schäden kontrollieren","Stecker auf Korrosion oder Feuchtigkeit untersuchen","Sicherungen im Sicherungskasten prüfen","Fehlercode löschen und beobachten, ob er wiederkommt"];
const sensorShop = "Wenn der Fehler nach Prüfung der Steckverbindungen persistent auftritt.";

function sensorFAQs(code) {
  return [
    {q:`Ist ${code} gefährlich?`,a:"Nicht akut, aber die Motorsteuerung arbeitet mit falschen oder fehlenden Daten."},
    {q:"Kann ich weiterfahren?",a:"In der Regel ja. Bei Notlauf nur zur nächsten Werkstatt fahren."},
    {q:"Was kostet die Reparatur?",a:"Oft reicht eine Steckerreinigung (kostenlos). Ein neuer Sensor kostet 20 bis 300 Euro je nach Typ."},
    {q:"Kann Feuchtigkeit die Ursache sein?",a:"Ja, Wasser im Stecker kann Kurzschlüsse oder Signalverlust verursachen."},
    {q:"Muss ich in die Werkstatt?",a:"Wenn eine Sichtprüfung das Problem nicht löst, ja."},
    {q:"Beeinflusst der Fehler die AU?",a:"Ja, aktive Fehlercodes führen in der Regel zum Nichtbestehen."}
  ];
}

for (const sc of sensorCodes) {
  // skip codes we already defined in detail
  const existing = codes.find(c => c.code === sc[0]);
  if (existing) continue;

  add(sc[0], sc[1], sc[2], sc[3],
    [...sensorSymptoms], [...sensorCauses], "medium",
    [...sensorChecks], sensorShop, sensorFAQs(sc[0]),
    sc[4], sc[5]);
}

// ═══════════════════════════════════════════════════════════════
// EGR
// ═══════════════════════════════════════════════════════════════
const egrCodes = [
  ["P0400","AGR-System – Durchfluss Fehlfunktion","Allgemeine Fehlfunktion des AGR-Durchflusses.","Das Steuergerät erkennt, dass der AGR-Durchfluss nicht den Erwartungen entspricht."],
  ["P0401","AGR-System – Durchfluss unzureichend","Die Abgasrückführung leitet zu wenig Abgas zurück.","Das AGR-System führt Abgase in den Ansaugtrakt zurück, um NOx zu senken. P0401: zu wenig Rückführung."],
  ["P0402","AGR-System – Durchfluss zu hoch","Zu viel Abgas wird zurückgeführt.","Zu viel zurückgeführtes Abgas verdrängt Frischluft und stört die Verbrennung."],
  ["P0403","AGR-Ventil Steuerkreis Fehlfunktion","Der elektrische Steuerkreis des AGR-Ventils ist gestört.","Das Steuergerät kann das AGR-Ventil nicht korrekt ansteuern."],
  ["P0404","AGR-Ventil – Bereich/Leistung außerhalb Spezifikation","Das AGR-Ventil erreicht nicht die vorgegebene Position.","Oft durch Ruß und Verkokung blockiert."],
  ["P0405","AGR-Positionssensor – Signal zu niedrig","Der Positionssensor meldet zu niedrige Spannung.","Der AGR-Positionssensor liefert ein Signal unter dem erwarteten Bereich."],
];

const egrSymptoms = ["Motorkontrollleuchte leuchtet","Klopfgeräusche unter Last möglich","Erhöhte NOx-Emissionen","Leerlaufprobleme möglich","AU-Probleme"];
const egrCauses = ["AGR-Ventil verkokt oder verstopft","Blockierte AGR-Leitungen","Defekter AGR-Drucksensor","Defektes AGR-Ventil","Verstopfter AGR-Kühler","Verkoktes Ansaugrohr","Vakuumproblem (ältere Fahrzeuge)","Fehlerhafte Verkabelung"];
const egrChecks = ["AGR-Ventil lokalisieren und sichtprüfen","Auf Rußablagerungen achten","Vakuumschläuche kontrollieren (ältere Fahrzeuge)","Steckverbindung am AGR-Ventil prüfen","Fehlercode löschen und beobachten"];
const egrShop = "Wenn der Fehler persistent ist – AGR-Ventil muss ggf. gereinigt oder getauscht werden.";
const egrRelated = ["P0400","P0401","P0402","P0403","P0404"];

function egrFAQs(code) {
  return [
    {q:"Was ist das AGR-System?",a:"Es führt Abgase in den Ansaugtrakt zurück, um Stickoxide (NOx) zu reduzieren."},
    {q:"Kann ich das AGR-Ventil reinigen?",a:"Manchmal – mit speziellem AGR-Reiniger. Bei starker Verkokung hilft das oft nicht."},
    {q:`Ist ${code} gefährlich?`,a:"Nicht direkt, aber Klopfen unter Last kann den Motor schädigen."},
    {q:"Was kostet ein neues AGR-Ventil?",a:"80 bis 400 Euro je nach Fahrzeug."},
    {q:"Betrifft das Diesel und Benziner?",a:"Ja, beide Motortypen haben AGR-Systeme."},
    {q:"Kann ich das AGR-Ventil abklemmen?",a:"Nicht empfehlenswert und in vielen Ländern illegal."}
  ];
}

for (const ec of egrCodes) {
  const existing = codes.find(c => c.code === ec[0]);
  if (existing) continue;
  const rel = egrRelated.filter(r => r !== ec[0]).slice(0, 4);
  rel.push("P0171");
  add(ec[0], ec[1], ec[2], ec[3], [...egrSymptoms], [...egrCauses], "medium", [...egrChecks], egrShop, egrFAQs(ec[0]), "egr", rel);
}

// ═══════════════════════════════════════════════════════════════
// THROTTLE / IDLE
// ═══════════════════════════════════════════════════════════════
const throttleCodes = [
  ["P0505","Leerlaufregelung – Fehlfunktion","Die Leerlaufregelung arbeitet nicht korrekt.","Das System zur Stabilisierung des Leerlaufs funktioniert nicht einwandfrei."],
  ["P0506","Leerlaufdrehzahl zu niedrig","Die Leerlaufdrehzahl liegt unter dem Sollwert.","Der Motor bekommt nicht genug Luft oder Kraftstoff im Leerlauf."],
  ["P0507","Leerlaufdrehzahl zu hoch","Die Leerlaufdrehzahl liegt über dem Sollwert.","Das Steuergerät kann die Drehzahl nicht herunterregeln."],
];

const throttleSymptoms = ["Schwankender Leerlauf","Motor stirbt ab oder dreht hoch","Motorkontrollleuchte leuchtet","Schlechter Kaltstart","Vibrationen im Stand"];
const throttleCauses = ["Verschmutztes Leerlaufregelventil/Drosselklappe","Falschluft im Ansaugtrakt","Defekter Drosselklappensensor","Vakuumleck","Defektes Leerlaufregelventil (IACV)","Verstopfter Luftfilter","Schwacher Kraftstoffdruck","Falsche Grundeinstellung"];
const throttleChecks = ["Drosselklappe sichtprüfen – ist sie verschmutzt?","Ansaugschläuche auf Falschluft kontrollieren","Vakuumschläuche prüfen","Leerlaufdrehzahl beobachten","Fehlercode löschen und beobachten"];
const throttleShop = "Wenn der Motor regelmäßig abstirbt oder der Leerlauf stark schwankt.";

function throttleFAQs(code) {
  return [
    {q:"Kann ich die Drosselklappe reinigen?",a:"Ja, mit Drosselklappenreiniger. Anschließend ggf. Grundeinstellung nötig."},
    {q:"Was ist ein IACV?",a:"Ein Ventil, das die Luftmenge im Leerlauf regelt."},
    {q:`Ist ${code} gefährlich?`,a:"Wenn der Motor regelmäßig abstirbt, kann es im Verkehr gefährlich werden."},
    {q:"Was kostet die Reparatur?",a:"Reinigung: 50 bis 150 Euro. Neues Ventil: 50 bis 300 Euro."},
    {q:"Kann Falschluft den Leerlauf beeinflussen?",a:"Ja, zusätzliche Luft stört die Leerlaufregelung."},
    {q:"Muss nach Reinigung eine Anpassung erfolgen?",a:"Bei vielen modernen Fahrzeugen ja – Drosselklappenadaption mit Diagnosegerät."}
  ];
}

for (const tc of throttleCodes) {
  const existing = codes.find(c => c.code === tc[0]);
  if (existing) continue;
  add(tc[0], tc[1], tc[2], tc[3], [...throttleSymptoms], [...throttleCauses], "medium", [...throttleChecks], throttleShop, throttleFAQs(tc[0]), "throttle", ["P0505","P0506","P0507","P0121","P0171"].filter(r => r !== tc[0]));
}

// ═══════════════════════════════════════════════════════════════
// ADDITIONAL CODES to reach 150
// ═══════════════════════════════════════════════════════════════
const additionalCodes = [
  // Transmission
  ["P0700","Getriebesteuerung – Fehlfunktion erkannt","Das Getriebesteuergerät hat einen Fehler erkannt.","P0700 ist ein allgemeiner Informationscode – das Getriebesteuergerät signalisiert dem Motorsteuergerät, dass ein getriebeseitiger Fehler vorliegt.","transmission",["P0715","P0720","P0730","P0740","P0750"]],
  ["P0715","Turbinendrehzahlsensor – Schaltkreis Fehlfunktion","Der Turbinendrehzahlsensor (Eingangsdrehzahl Getriebe) funktioniert nicht.","Der Sensor misst die Drehzahl der Getriebe-Eingangswelle.","transmission",["P0700","P0720","P0730","P0740","P0750"]],
  ["P0720","Abtriebsdrehzahlsensor – Schaltkreis Fehlfunktion","Der Abtriebsdrehzahlsensor des Getriebes funktioniert nicht.","Der Sensor misst die Drehzahl der Getriebe-Ausgangswelle.","transmission",["P0700","P0715","P0730","P0740","P0750"]],
  ["P0730","Falsches Übersetzungsverhältnis","Das Getriebe schaltet nicht korrekt.","Das tatsächliche Übersetzungsverhältnis weicht von der Sollvorgabe ab.","transmission",["P0700","P0715","P0720","P0740","P0750"]],
  ["P0740","Drehmomentwandler-Überbrückungskupplung – Schaltkreis Fehlfunktion","Die Wandlerüberbrückung arbeitet nicht korrekt.","Die Lock-Up-Kupplung im Drehmomentwandler kann nicht richtig ein- oder auskuppeln.","transmission",["P0700","P0715","P0720","P0730","P0750"]],
  ["P0750","Schaltmagnetventil A – Fehlfunktion","Das Schaltmagnetventil A im Getriebe funktioniert nicht.","Magnetventile steuern den Ölfluss und damit die Gangwechsel im Automatikgetriebe.","transmission",["P0700","P0715","P0720","P0730","P0755"]],
  ["P0755","Schaltmagnetventil B – Fehlfunktion","Das Schaltmagnetventil B funktioniert nicht.","Wie P0750 für Magnetventil B.","transmission",["P0700","P0750","P0715","P0720","P0730"]],

  // Ignition / additional
  ["P0335","Kurbelwellensensor – Schaltkreis Fehlfunktion","Der Kurbelwellensensor liefert kein Signal.","Ohne Kurbelwellensignal kann der Motor nicht starten oder läuft sehr unruhig.","sensor",["P0336","P0340","P0341","P0300","P0171"]],
  ["P0336","Kurbelwellensensor – Signal außerhalb Bereich","Das Kurbelwellensensor-Signal ist unplausibel.","Schwankungen oder Aussetzer im Signal des Sensors.","sensor",["P0335","P0340","P0341","P0300","P0171"]],
  ["P0340","Nockenwellensensor Bank 1 – Schaltkreis Fehlfunktion","Der Nockenwellensensor auf Bank 1 liefert kein Signal.","Ohne Nockenwellensignal kann das Steuergerät die Einspritzung nicht korrekt zuordnen.","sensor",["P0341","P0335","P0336","P0010","P0300"]],
  ["P0341","Nockenwellensensor Bank 1 – Signal außerhalb Bereich","Das Signal des Nockenwellensensors ist unplausibel.","Abweichungen zwischen erwartetem und tatsächlichem Signal.","sensor",["P0340","P0335","P0336","P0010","P0300"]],
  ["P0345","Nockenwellensensor Bank 2 – Schaltkreis Fehlfunktion","Der Nockenwellensensor auf Bank 2 liefert kein Signal.","Wie P0340 für Bank 2.","sensor",["P0340","P0341","P0335","P0020","P0300"]],

  // Knock sensor
  ["P0325","Klopfsensor 1 – Schaltkreis Fehlfunktion","Der Klopfsensor 1 funktioniert nicht.","Der Klopfsensor erkennt motorschädigendes Klopfen und passt den Zündzeitpunkt an.","sensor",["P0326","P0327","P0328","P0300","P0171"]],
  ["P0326","Klopfsensor 1 – Signal außerhalb Bereich","Das Klopfsensor-Signal ist unplausibel.","Schwankende oder dauerhaft falsche Werte.","sensor",["P0325","P0327","P0328","P0300","P0171"]],
  ["P0327","Klopfsensor 1 – Signal zu niedrig","Der Klopfsensor meldet zu niedrige Werte.","Möglicher Kabelbruch oder defekter Sensor.","sensor",["P0325","P0326","P0328","P0300","P0171"]],
  ["P0328","Klopfsensor 1 – Signal zu hoch","Der Klopfsensor meldet zu hohe Werte.","Möglicher Kurzschluss oder mechanisches Problem.","sensor",["P0325","P0326","P0327","P0300","P0171"]],

  // MAP Sensor
  ["P0105","MAP-Sensor – Schaltkreis Fehlfunktion","Der Saugrohrdrucksensor (MAP) funktioniert nicht.","Der MAP-Sensor misst den Druck im Ansaugrohr für die Gemischberechnung.","sensor",["P0106","P0107","P0108","P0101","P0171"]],
  ["P0106","MAP-Sensor – Signal außerhalb Bereich","MAP-Sensor-Signal ist unplausibel.","Die Werte passen nicht zum Betriebszustand.","sensor",["P0105","P0107","P0108","P0101","P0171"]],
  ["P0107","MAP-Sensor – Signal zu niedrig","MAP-Signal unter Erwartung.","Möglicher Kurzschluss oder Vakuumleck.","sensor",["P0105","P0106","P0108","P0101","P0171"]],
  ["P0108","MAP-Sensor – Signal zu hoch","MAP-Signal über Erwartung.","Möglicher Kabelbruch oder offene Referenzleitung.","sensor",["P0105","P0106","P0107","P0101","P0171"]],

  // Fuel pressure
  ["P0190","Kraftstoffdrucksensor – Schaltkreis Fehlfunktion","Der Kraftstoffdrucksensor funktioniert nicht.","Der Sensor überwacht den Druck in der Kraftstoffleitung.","fuel",["P0191","P0192","P0193","P0171","P0172"]],
  ["P0191","Kraftstoffdrucksensor – Signal außerhalb Bereich","Kraftstoffdrucksensor-Signal unplausibel.","Die gemessenen Werte passen nicht zum Betriebszustand.","fuel",["P0190","P0192","P0193","P0171","P0172"]],
  ["P0192","Kraftstoffdrucksensor – Signal zu niedrig","Kraftstoffdruck-Signal unter Erwartung.","Möglicher niedriger Kraftstoffdruck oder Sensordefekt.","fuel",["P0190","P0191","P0193","P0171","P0300"]],
  ["P0193","Kraftstoffdrucksensor – Signal zu hoch","Kraftstoffdruck-Signal über Erwartung.","Möglicher Sensordefekt oder tatsächlich zu hoher Druck.","fuel",["P0190","P0191","P0192","P0172","P0300"]],

  // Misc engine codes
  ["P0201","Einspritzdüse Zylinder 1 – Steuerkreis","Der Steuerkreis der Einspritzdüse von Zylinder 1 ist gestört.","Das Steuergerät kann die Einspritzdüse nicht korrekt ansteuern.","fuel",["P0202","P0203","P0204","P0300","P0301"]],
  ["P0202","Einspritzdüse Zylinder 2 – Steuerkreis","Der Steuerkreis der Einspritzdüse von Zylinder 2 ist gestört.","Wie P0201 für Zylinder 2.","fuel",["P0201","P0203","P0204","P0300","P0302"]],
  ["P0203","Einspritzdüse Zylinder 3 – Steuerkreis","Der Steuerkreis der Einspritzdüse von Zylinder 3 ist gestört.","Wie P0201 für Zylinder 3.","fuel",["P0201","P0202","P0204","P0300","P0303"]],
  ["P0204","Einspritzdüse Zylinder 4 – Steuerkreis","Der Steuerkreis der Einspritzdüse von Zylinder 4 ist gestört.","Wie P0201 für Zylinder 4.","fuel",["P0201","P0202","P0203","P0300","P0304"]],

  // Additional O2 sensor
  ["P0136","Lambda-Sonde Bank 1 Sensor 2 – Schaltkreis Fehlfunktion","Die hintere Lambda-Sonde Bank 1 liefert kein gültiges Signal.","Die hintere Sonde überwacht den Katalysator.","sensor",["P0141","P0420","P0130","P0131","P0132"]],
  ["P0137","Lambda-Sonde Bank 1 Sensor 2 – Spannung zu niedrig","Hintere Lambda-Sonde Bank 1 zeigt dauernd niedrige Spannung.","Kann auf ein Problem mit dem Kat oder der Sonde hindeuten.","sensor",["P0136","P0138","P0420","P0141","P0130"]],
  ["P0138","Lambda-Sonde Bank 1 Sensor 2 – Spannung zu hoch","Hintere Lambda-Sonde Bank 1 zeigt dauernd hohe Spannung.","Deutet auf fettes Gemisch hinter dem Kat oder defekte Sonde hin.","sensor",["P0136","P0137","P0420","P0141","P0172"]],

  // Speed sensor
  ["P0500","Geschwindigkeitssensor – Fehlfunktion","Der Fahrzeuggeschwindigkeitssensor liefert kein gültiges Signal.","Ohne Geschwindigkeitssignal funktieren Tacho, ABS und Getriebesteuerung nicht korrekt.","sensor",["P0501","P0502","P0503","P0720","P0700"]],
  ["P0501","Geschwindigkeitssensor – Signal außerhalb Bereich","Das Geschwindigkeitssignal ist unplausibel.","Abweichungen vom erwarteten Signalverlauf.","sensor",["P0500","P0502","P0503","P0720","P0700"]],

  // Thermostat
  ["P0597","Thermostat-Heizelement – Steuerkreis offen","Der Steuerkreis des beheizbaren Thermostats ist unterbrochen.","Moderne Fahrzeuge nutzen beheizbare Thermostaten für schnelleres Aufwärmen.","sensor",["P0125","P0128","P0115","P0116","P0117"]],

  // Manifold
  ["P0410","Sekundärluftsystem – Fehlfunktion","Das Sekundärluftsystem arbeitet nicht korrekt.","Das System pumpt Frischluft in den Abgasstrom, um den Kat schneller aufzuheizen.","catalyst",["P0411","P0412","P0420","P0421","P0171"]],
  ["P0411","Sekundärluftsystem – Durchfluss nicht korrekt","Der Sekundärluft-Durchfluss weicht ab.","Zu viel oder zu wenig Luft wird in den Abgasstrom gepumpt.","catalyst",["P0410","P0412","P0420","P0421","P0171"]],
  ["P0412","Sekundärluftventil – Steuerkreis Fehlfunktion","Das Magnetventil des Sekundärluftsystems funktioniert nicht.","Elektrisches Problem am Sekundärluft-Umschaltventil.","catalyst",["P0410","P0411","P0420","P0421","P0171"]],

  // Additional power train
  ["P0480","Kühlerlüfter 1 – Steuerkreis Fehlfunktion","Der Steuerkreis des Kühlerlüfters 1 funktioniert nicht.","Der Lüfter kann nicht korrekt ein- oder ausgeschaltet werden.","sensor",["P0481","P0115","P0116","P0117","P0118"]],
  ["P0481","Kühlerlüfter 2 – Steuerkreis Fehlfunktion","Der Steuerkreis des Kühlerlüfters 2 funktioniert nicht.","Wie P0480 für den zweiten Lüfter.","sensor",["P0480","P0115","P0116","P0117","P0118"]],

  // Diesel specific
  ["P0251","Einspritzpumpe – Regelabweichung (Diesel)","Die Einspritzpumpe liefert nicht den erwarteten Kraftstoffdruck.","Ein Diesel-spezifischer Fehler der Hochdruck-Einspritzpumpe.","fuel",["P0190","P0192","P0193","P0300","P0171"]],
  ["P0380","Glühkerzen-Steuerkreis – Fehlfunktion","Der Glühkerzen-Steuerkreis funktioniert nicht korrekt.","Glühkerzen heizen den Brennraum vor dem Dieselstart vor.","fuel",["P0381","P0300","P0301","P0335","P0340"]],
  ["P0381","Glühkerzen-Kontrollleuchte – Steuerkreis Fehlfunktion","Die Glühkerzen-Kontrollleuchte funktioniert nicht.","Die Anzeige für den Vorglühvorgang ist gestört.","fuel",["P0380","P0300","P0335","P0340","P0341"]],

  // Communication
  ["P0600","CAN-Bus – Serieller Kommunikationsfehler","Die serielle Datenverbindung (CAN-Bus) hat einen Fehler.","Die Steuergeräte kommunizieren über den CAN-Bus. P0600 zeigt eine Störung in dieser Kommunikation.","sensor",["P0601","P0602","P0700","P0335","P0340"]],
  ["P0601","Interner Steuergerät-Speicherfehler (Prüfsumme)","Das Motorsteuergerät hat einen internen Speicherfehler erkannt.","Ein Prüfsummenfehler im internen Speicher des Steuergeräts.","sensor",["P0600","P0602","P0700","P0335","P0340"]],
  ["P0602","Steuergerät – Programmierfehler","Das Steuergerät meldet einen Programmierfehler.","Möglicherweise ist ein Software-Update fehlgeschlagen oder das Steuergerät wurde nicht korrekt codiert.","sensor",["P0600","P0601","P0700","P0335","P0340"]],

  // Boost pressure
  ["P0234","Ladedruckregelung – Ladedruck zu hoch","Der Ladedruck des Turboladers ist zu hoch.","Das Wastegate oder der Ladedruckregler öffnet nicht ausreichend.","fuel",["P0235","P0299","P0171","P0172","P0300"]],
  ["P0235","Ladedrucksensor – Schaltkreis Fehlfunktion","Der Ladedrucksensor funktioniert nicht.","Der Sensor misst den Ladedruck im Ansaugtrakt.","fuel",["P0234","P0299","P0106","P0107","P0108"]],
  ["P0299","Ladedruckregelung – Ladedruck zu niedrig","Der Turbolader erreicht nicht den erwarteten Ladedruck.","Mögliche Ursachen: Undichtigkeit im Ladeluftschlauch, defektes Wastegate, verschlissener Turbo.","fuel",["P0234","P0235","P0171","P0101","P0300"]],

  // Purge
  ["P0496","EVAP-System – Spülstrom zu hoch (Motor aus)","Kraftstoffdämpfe werden unkontrolliert angesaugt.","Das Spülventil ist undicht oder klemmt offen.","evap",["P0440","P0441","P0442","P0443","P0455"]],
  ["P0497","EVAP-System – Spülstrom zu niedrig","Zu wenig Kraftstoffdämpfe werden dem Motor zugeführt.","Das Spülventil öffnet nicht ausreichend.","evap",["P0440","P0441","P0442","P0443","P0496"]],

  // VVT additional
  ["P0013","Nockenwellenverstellung (Auslass) Bank 1 – Steuerkreis","Der Steuerkreis der Auslass-Nockenwellenverstellung Bank 1 ist gestört.","Das Magnetventil für die Auslass-Nockenwelle wird nicht korrekt angesteuert.","sensor",["P0010","P0011","P0012","P0014","P0300"]],
  ["P0014","Nockenwellenverstellung (Auslass) Bank 1 – Position zu weit vorgestellt","Die Auslass-Nockenwelle ist zu weit vorgestellt.","Möglicher Öldruck-Mangel oder defektes Magnetventil.","sensor",["P0013","P0010","P0011","P0012","P0300"]],

  // Additional misc
  ["P0420","already_defined","","","",""],
  ["P0562","Systemspannung zu niedrig","Die Bordspannung liegt unter dem Sollwert.","Die Batterie oder Lichtmaschine liefert nicht genug Spannung.","sensor",["P0563","P0600","P0601","P0335","P0340"]],
  ["P0563","Systemspannung zu hoch","Die Bordspannung liegt über dem Sollwert.","Die Lichtmaschine liefert zu viel Spannung – möglicher Regler-Defekt.","sensor",["P0562","P0600","P0601","P0335","P0340"]],
];

const genericSymptoms = ["Motorkontrollleuchte leuchtet","Leistungsverlust möglich","Fahrverhalten beeinträchtigt","Erhöhter Kraftstoffverbrauch","Motor ggf. im Notlauf"];
const genericCauses = ["Defekter Sensor oder Aktuator","Korrodierter Steckverbinder","Kabelbruch oder Kurzschluss","Verschleiß durch Alterung","Feuchtigkeit oder Wassereintritt","Defekte Sicherung oder Relais","Falsche Ersatzteile verbaut","Softwareproblem im Steuergerät"];
const genericChecks = ["Relevante Steckverbindungen auf festen Sitz prüfen","Kabel und Stecker auf sichtbare Schäden kontrollieren","Sicherungen im Sicherungskasten prüfen","Fehlercode löschen und beobachten, ob er wiederkommt","Auf weitere gespeicherte Fehlercodes prüfen"];
const genericShop = "Wenn der Fehler nach Sichtprüfung der Steckverbindungen persistent auftritt.";

function genericFAQs(code) {
  return [
    {q:`Ist ${code} gefährlich?`,a:"Die Dringlichkeit hängt vom konkreten Problem ab. Bei Notlauf oder ungewöhnlichem Fahrverhalten zeitnah prüfen lassen."},
    {q:"Kann ich weiterfahren?",a:"In den meisten Fällen ja, bei deutlichen Fahrproblemen vorsichtig zur Werkstatt."},
    {q:"Was kostet die Reparatur?",a:"Abhängig von der Ursache: von Steckerreinigung (kostenlos) bis Komponententausch (mehrere hundert Euro)."},
    {q:"Kann ich den Fehler selbst beheben?",a:"Einfache Prüfungen wie Stecker und Sicherungen sind möglich. Die genaue Diagnose erfordert meist Werkstatttechnik."},
    {q:"Beeinflusst der Fehler die AU/TÜV?",a:"Ja, aktive Fehlercodes führen in der Regel zum Nichtbestehen der AU."},
    {q:"Muss ich in die Werkstatt?",a:"Wenn der Fehler nach dem Löschen wiederkommt oder Symptome auftreten, ja."}
  ];
}

for (const ac of additionalCodes) {
  if (ac[1] === "already_defined") continue;
  const existing = codes.find(c => c.code === ac[0]);
  if (existing) continue;
  add(ac[0], ac[1], ac[2], ac[3], [...genericSymptoms], [...genericCauses], "medium", [...genericChecks], genericShop, genericFAQs(ac[0]), ac[4], ac[5]);
}

// Ensure we have exactly 150 codes, pad if needed
// Add some extra generic P-codes if under 150
const extraCodes = [
  ["P0463","Kraftstoffstandsensor – Signal zu hoch","Tankfüllstandssensor meldet unrealistisch hohen Wert.","sensor",["P0462","P0461","P0460","P0500","P0501"]],
  ["P0462","Kraftstoffstandsensor – Signal zu niedrig","Tankfüllstandssensor meldet unrealistisch niedrigen Wert.","sensor",["P0463","P0461","P0460","P0500","P0501"]],
  ["P0461","Kraftstoffstandsensor – Signal außerhalb Bereich","Das Signal des Tankfüllstandssensors ist unplausibel.","sensor",["P0462","P0463","P0460","P0500","P0501"]],
  ["P0460","Kraftstoffstandsensor – Schaltkreis Fehlfunktion","Der Kraftstoffstandsensor liefert kein gültiges Signal.","sensor",["P0461","P0462","P0463","P0500","P0501"]],
  ["P0222","Drosselklappensensor 2 – Signal zu niedrig","Der zweite TPS meldet zu niedrige Werte.","throttle",["P0223","P0121","P0122","P0123","P0505"]],
  ["P0223","Drosselklappensensor 2 – Signal zu hoch","Der zweite TPS meldet zu hohe Werte.","throttle",["P0222","P0121","P0122","P0123","P0505"]],
  ["P0016","Nockenwellen-/Kurbelwellen-Korrelation Bank 1 Sensor A","Die Signale von Nockenwellen- und Kurbelwellensensor passen nicht zusammen.","sensor",["P0017","P0335","P0340","P0010","P0011"]],
  ["P0017","Nockenwellen-/Kurbelwellen-Korrelation Bank 1 Sensor B","Die Korrelation zwischen Auslass-Nockenwelle und Kurbelwelle stimmt nicht.","sensor",["P0016","P0335","P0340","P0013","P0014"]],
  ["P0030","Lambda-Sonde Bank 1 Sensor 1 – Heizkreis Steuerkreis","Steuerkreis der Sondenheizung gestört.","sensor",["P0135","P0130","P0131","P0132","P0134"]],
  ["P0036","Lambda-Sonde Bank 1 Sensor 2 – Heizkreis Steuerkreis","Steuerkreis der hinteren Sondenheizung gestört.","sensor",["P0141","P0136","P0137","P0138","P0420"]],
  ["P0068","Drosselklappe/MAP-Sensor – Korrelation","Die Werte von Drosselklappe und MAP-Sensor passen nicht zusammen.","sensor",["P0105","P0106","P0121","P0122","P0123"]],
  ["P0420B","already_defined","","","",""],
];

for (const ec of extraCodes) {
  if (codes.length >= 150) break;
  if (ec[1] === "already_defined") continue;
  const existing = codes.find(c => c.code === ec[0]);
  if (existing) continue;

  const title = ec[1];
  const short = ec[2];
  add(ec[0], title, short, short,
    [...genericSymptoms], [...genericCauses], "medium",
    [...genericChecks], genericShop, genericFAQs(ec[0]),
    ec[3], ec[4]);
}

// Trim or report count
console.log(`Generated ${codes.length} codes`);
if (codes.length > 150) codes.length = 150;

// Sort by code
codes.sort((a, b) => a.code.localeCompare(b.code));

// Validate all related codes exist in set
const codeSet = new Set(codes.map(c => c.code));
for (const c of codes) {
  c.related = c.related.filter(r => codeSet.has(r) && r !== c.code).slice(0, 5);
}

// Write
fs.mkdirSync(path.join(__dirname, "src"), { recursive: true });
fs.writeFileSync(
  path.join(__dirname, "src", "codes.json"),
  JSON.stringify(codes, null, 2),
  "utf-8"
);
console.log("Wrote src/codes.json");
