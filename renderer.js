const fs = require('fs');
const path = require('path');

// Tabulator CSS laden (lokal aus node_modules)
const tabulatorCssPath = path.join(__dirname, 'node_modules', 'tabulator-tables', 'dist', 'css', 'tabulator.min.css');
const linkElement = document.createElement('link');
linkElement.rel = 'stylesheet';
linkElement.href = tabulatorCssPath;
document.head.appendChild(linkElement);

// Tabulator JavaScript laden (lokal aus node_modules)
const tabulatorJsPath = path.join(__dirname, 'node_modules', 'tabulator-tables', 'dist', 'js', 'tabulator.min.js');
const scriptElement = document.createElement('script');
scriptElement.src = tabulatorJsPath;
scriptElement.onload = function() {
    console.log('Tabulator JavaScript geladen!');
    // Tabelle initialisieren NACH dem Laden von Tabulator
    initTable();
};
document.head.appendChild(scriptElement);

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

// ===== TABULATOR TABELLE =====

// Dummy-Daten für die Tabelle
const tableData = [
    { id: 1, name: "Max Mustermann", alter: 28, stadt: "Berlin", status: "Aktiv" },
    { id: 2, name: "Anna Schmidt", alter: 34, stadt: "München", status: "Aktiv" },
    { id: 3, name: "Peter Klein", alter: 42, stadt: "Hamburg", status: "Inaktiv" },
    { id: 4, name: "Lisa Müller", alter: 25, stadt: "Köln", status: "Aktiv" },
    { id: 5, name: "Tom Wagner", alter: 31, stadt: "Frankfurt", status: "Aktiv" }
];

// Funktion zum Initialisieren der Tabelle
// Diese wird aufgerufen, NACHDEM Tabulator geladen wurde
function initTable() {
    console.log('Initialisiere Tabelle...');

    // Tabulator ist jetzt als globale Variable verfügbar
    const table = new Tabulator("#data-table", {
        data: tableData,              // Die Dummy-Daten laden
        layout: "fitColumns",         // Spalten automatisch anpassen
        height: "170px",              // Feste Höhe der Tabelle
        columns: [                    // Spalten definieren
            { title: "ID", field: "id", width: 60 },
            { title: "Name", field: "name", width: 150, editor: "input" },  // ← Editierbar!
            { title: "Alter", field: "alter", width: 80, editor: "input" },  // ← Editierbar!
            { title: "Stadt", field: "stadt", width: 120, editor: "input" },  // ← Editierbar!
            { title: "Status", field: "status", width: 100, editor: "list", editorParams: { values: ["Aktiv", "Inaktiv"] } }  // ← Dropdown!
        ]
    });

    /*
    // ===== EVENT LISTENER: Edit-Modus =====
    // Wird ausgelöst, wenn eine Zelle in den Edit-Modus geht
    table.on("cellEditing", function(cell) {
        console.log("Edit-Modus gestartet!");

        // Info-Box aktualisieren (HIER statt im cellClick!)
        const rowData = cell.getRow().getData();
        const infoBox = document.getElementById('info-box');
        infoBox.innerHTML = `
            <span style="color: #ff9500;">EDIT-MODUS</span><br><br>
            Name: ${rowData.name}<br>
            Alter: ${rowData.alter}<br>
            Stadt: ${rowData.stadt}<br>
            Status: ${rowData.status}
        `;

        // Tabelle größer machen (nur CSS, KEIN table.setHeight()!)
        const tableElement = document.getElementById('data-table');
        tableElement.style.width = '600px';  // von 510px auf 515px

        // Höhe direkt per CSS setzen (auf dem inneren Tabulator-Element)
        const tabulatorElement = tableElement.querySelector('.tabulator');
        if (tabulatorElement) {
            tabulatorElement.style.height = '200px';  // von 165px auf 170px
        }
    });
    

    // Wird ausgelöst, wenn das Editieren erfolgreich abgeschlossen ist
    table.on("cellEdited", function(cell) {
        console.log("Edit-Modus beendet - gespeichert!");

        // Tabelle zurück auf normale Größe
        const tableElement = document.getElementById('data-table');
        tableElement.style.width = '600px';  // zurück auf 510px

        // Höhe zurücksetzen (direkt per CSS)
        const tabulatorElement = tableElement.querySelector('.tabulator');
        if (tabulatorElement) {
            tabulatorElement.style.height = '200px';  // zurück auf 165px
        }
    });

    // Wird ausgelöst, wenn das Editieren abgebrochen wird (ESC)
    table.on("cellEditCancelled", function(cell) {
        console.log("Edit-Modus abgebrochen!");

        // Tabelle zurück auf normale Größe
        const tableElement = document.getElementById('data-table');
        tableElement.style.width = '510px';  // zurück auf 510px

        // Höhe zurücksetzen (direkt per CSS)
        const tabulatorElement = tableElement.querySelector('.tabulator');
        if (tabulatorElement) {
            tabulatorElement.style.height = '165px';  // zurück auf 165px
        }
    });
    */
    
    // ===== EVENT LISTENER: Cell Click =====
    // Wird ausgelöst, wenn man auf eine Zelle klickt
    table.on("cellClick", function(e, cell) {
        // 'cell' ist die geklickte Zelle
        // 'e' ist das originale Click-Event

        const row = cell.getRow();           // Die ganze Zeile
        const column = cell.getColumn();     // Die Spalte
        const value = cell.getValue();       // Der Wert in der Zelle
        const rowData = row.getData();       // Alle Daten der Zeile

        // Wenn die Zelle editierbar ist (hat einen Editor), nicht reagieren
        // Damit das Dropdown und Editieren normal funktioniert
        const columnDef = column.getDefinition();
        if (columnDef.editor) {
            // Diese Zelle ist editierbar - nichts machen, damit Edit-Modus funktioniert
            // Info-Box wird im cellEditing Event aktualisiert
            return; // Sofort beenden, KEINE DOM-Manipulation!
        }

        // Nur für nicht-editierbare Zellen (z.B. ID):
        console.log("=== ZELLE GEKLICKT ===");
        console.log("Spalte:", column.getField());  // z.B. "id"
        console.log("Wert:", value);                // z.B. 1
        console.log("Ganze Zeile:", rowData);       // { id: 1, name: "Max Mustermann", ... }

        // Info-Box aktualisieren (KEIN ALERT - das würde Tabulator stören!)
        const infoBox = document.getElementById('info-box');
        if (column.getField() === "id") {
            // Spezielle Nachricht bei ID-Klick
            infoBox.innerHTML = `
                <span style="color: #00d4ff;">ID ${value} angeklickt!</span><br><br>
                Ausgewählt:<br>
                Name: ${rowData.name}<br>
                Alter: ${rowData.alter}<br>
                Stadt: ${rowData.stadt}<br>
                Status: ${rowData.status}
            `;
        } else {
            // Normale Info-Anzeige
            infoBox.innerHTML = `
                Ausgewählt:<br>
                Name: ${rowData.name}<br>
                Alter: ${rowData.alter}<br>
                Stadt: ${rowData.stadt}<br>
                Status: ${rowData.status}
            `;
        }
    });
    

    console.log("Tabulator Tabelle initialisiert!");
}