const fs = require('fs');
const path = require('path');

// Pfad zur JSON Datei bestimmen
const layoutPath = path.join(__dirname, 'layout.json');

function applyLayout() {
    // 1. JSON Datei lesen
    fs.readFile(layoutPath, 'utf-8', (err, data) => {
        if (err) {
            console.error("Konnte layout.json nicht lesen", err);
            return;
        }

        // 2. JSON parsen
        const layout = JSON.parse(data);

        // 3. Durch alle Keys im JSON iterieren
        for (const [elementId, coords] of Object.entries(layout)) {
            // Das HTML Element finden
            const el = document.getElementById(elementId);
            
            if (el) {
                // Die CSS Position setzen
                el.style.left = coords.x + 'px';
                el.style.top = coords.y + 'px';
            } else {
                console.warn(`Element mit ID '${elementId}' nicht im HTML gefunden.`);
            }
        }
        console.log("Layout angewendet!");
    });
}

// Layout beim Start anwenden
applyLayout();

// ===== HOT-RELOAD für layout.json =====

// Die layout.json Datei überwachen
fs.watch(layoutPath, (eventType, filename) => {
    // eventType kann 'change' oder 'rename' sein
    // filename ist der Name der geänderten Datei

    console.log(`Layout-Datei wurde geändert (${eventType}). Lade Layout neu...`);

    // Kleiner Timeout, damit die Datei fertig gespeichert ist
    // (Manche Editoren schreiben in mehreren Schritten)
    setTimeout(() => {
        applyLayout();
    }, 100); // 100ms warten
});

// Optional: Layout neu laden, wenn man eine Taste drückt (z.B. F5 ist Standard, aber hier als Demo)
document.addEventListener('keydown', (e) => {
    if (e.key === 'F5') {
        location.reload();
    }
});

// ===== SLIDER KOPPLUNG =====

// Schritt 1: Den Slider im HTML finden
// Der Slider hat die Klasse "slider"
// alternative: const slider = document.querySelector('.slider');
const slider = document.getElementById("percent-slider");
// Schritt 2: Das Label (span) finden, wo der Wert steht
// Das span hat die ID "val"
const valueLabel = document.getElementById('val');
// speichern-button refenz holen
const saveButton = document.getElementById('action-btn');
// abbrechen-button referenz holen
const cancelButton = document.getElementById('cancel-btn');


// Schritt 3: Auf Änderungen reagieren
// Wir "hören" auf das 'input' Event - das wird ausgelöst, wenn der Slider bewegt wird
slider.addEventListener('input', function() {
    // 'this.value' ist der aktuelle Wert des Sliders (z.B. 75)
    // Wir setzen den Text im Label auf diesen Wert + "%"
    valueLabel.textContent = this.value + '%';

    // Zur Info: In die Konsole ausgeben (kannst du mit F12 sehen)
    console.log('Slider Wert:', this.value);
});


//wenn speichern-btn gedrück, schreib hello world mit fs in datei auf festplatte
saveButton.addEventListener('click', function() {
    // Pfad definieren (im gleichen Ordner wie renderer.js)
    const file = path.join(__dirname, 'test.txt');
    fs.writeFile(file, 'hello world', (err) => {
        if (err) console.error('Fehler beim Speichern:', err);
        else console.log('Datei erfolgreich gespeichert:', file);
    });
});

//test