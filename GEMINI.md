# Project Overview: Electron UI Practice

This is an Electron-based training project designed to demonstrate and practice UI positioning using a JSON-driven layout system. It features a fixed-size window (800x600) where UI elements are positioned absolutely based on coordinates defined in a configuration file.

## Core Technologies
- **Electron**: Desktop application framework (v28.0.0).
- **Node.js**: Integrated into the renderer process for direct filesystem access.
- **Tabulator-tables**: Used for displaying and editing data in a grid format.
- **HTML/CSS/JavaScript**: Standard web technologies for the frontend.
- **JSON**: Used as a "Source of Truth" for UI element coordinates.

## Architecture
The project follows a standard Electron structure with modifications for training:

### Main Process (`main.js`)
- Configures a non-resizable `BrowserWindow` with `useContentSize: true` to ensure exactly 800x600 pixels of usable space.
- Disables the menu bar for a clean UI.
- Enables `nodeIntegration` and disables `contextIsolation` (Note: This is for development/training ease and should be avoided in production for security).

### Renderer Process (`renderer.js`)
- **JSON-Driven Layout**: Reads `layout.json` at startup and applies `left` and `top` CSS styles to elements matching IDs in the JSON.
- **Hot-Reloading**: Uses `fs.watch` on `layout.json` to automatically re-apply positions when the file is saved.
- **UI Logic**: Handles slider updates, button clicks (writing to `test.txt`), and Tabulator table initialization/events.
- **Dynamic Loading**: Programmatically injects Tabulator CSS and JS from `node_modules`.

### Layout Configuration (`layout.json`)
- Maps element IDs to `x` and `y` coordinates.
- Any element with the `ui-element` class in `index.html` can be controlled here.

## Building and Running
To run the application, ensure you have dependencies installed:

```bash
# Install dependencies
npm install

# Start the application
npm start
```

## Development Conventions
1. **Positioning**: Do not use CSS for positioning elements intended to be part of the layout system. Instead, add the `ui-element` class and a unique ID to the HTML element, then define its `x` and `y` in `layout.json`.
2. **FileSystem Access**: The renderer process has direct access to `fs`. Use it for reading configuration or saving simple data (like `test.txt`).
3. **Hot Reload**: Changes to `layout.json` are applied instantly. For HTML/CSS/JS changes, use `F5` to reload the window.
4. **Styling**: Global styles are in `style.css`. UI elements should generally use the `.card` or `.ui-element` classes for consistency.

## Key Files
- `main.js`: Electron entry point and window configuration.
- `renderer.js`: Main UI logic and layout engine.
- `index.html`: UI structure and element definitions.
- `layout.json`: Coordinate map for UI elements.
- `style.css`: Visual styling and positioning base classes.
- `CLAUDE.md`: Additional development guidance for AI assistants.
