const { app, BrowserWindow } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        useContentSize: true, // true = Der Innenbereich ist 800x600 (Fenster wird etwas größer)
                              // false = Das ganze Fenster inkl. Rahmen ist 800x600
        resizable: false,     // Größe fixieren
        webPreferences: {
            nodeIntegration: true, // Erlaubt 'require' und Node-Module im Renderer (HTML/JS
            contextIsolation: false // Vereinfacht den Zugriff auf Node.js Variablen
        }
    });

    // Menüleiste ausblenden (damit es sauberer aussieht bei fixen 800x600)
    win.setMenu(null);

    // Developer Tools automatisch öffnen (hilfreich beim Entwickeln!)
    win.webContents.openDevTools();

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});